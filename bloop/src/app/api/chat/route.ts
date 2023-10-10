import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { makeChain } from '@/utils/gptChain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME } from '@/config/pinecone';
import { Message } from '@/types/chat';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message, history } = await request.json() as { message: string, history: Message[] };

  if (!message) {
    return NextResponse.json({ message: 'No question in the request' }, { status: 400 });
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedMessage = message.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
      },
    );

    //create chain
    const chain = makeChain(vectorStore);

    const pastMessages = history?.map((message: Message, i: number) => {
      if (i % 2 === 0) {
        return new HumanMessage(message.data);
      } else {
        return new AIMessage(message.data);
      }
    });

    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedMessage,
      chat_history: pastMessages,
      stream: true,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.log('error', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
