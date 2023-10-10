import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { PINECONE_INDEX_NAME } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

import { Queue } from 'quirrel/next-app'

const ingestQueue = Queue<{
  path: string,
  links: string[],
}>(
  "/api/queue/ingest",
  async (data) => {
    console.log("Data", data);

  if (!data?.path) return;
  try {
    console.log(data.path);
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(data.path, {
      '.pdf': (path) => new PDFLoader(path),
      '.txt': (path) => new TextLoader(path),
      '.md': (path) => new TextLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    console.log(rawDocs.length, 'raw docs')

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);


    console.log(docs.length, 'docs')

    if (data.links) {
      console.log(data.links);
      try {
        const linkDocs = await Promise.all(data.links.map(l => new PuppeteerWebBaseLoader(l).load()));
        console.log(linkDocs.length, 'link docs')
        docs.concat(linkDocs.flatMap(d => d));
      } catch (e) {
        console.log(e);
      }
    }

    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.index(PINECONE_INDEX_NAME); 

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
  }
)

export default ingestQueue;