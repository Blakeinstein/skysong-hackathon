import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pinecone } from '@/utils/pinecone-client';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer';
import { PINECONE_INDEX_NAME } from '@/config/pinecone';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import fs from "node:fs/promises";
import path from "node:path";
/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/

const ingestData = async (data: {
  path: string,
  links: string[],
}) => {

  if (!data?.path) return;
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(data.path, {
      '.pdf': (path) => new PDFLoader(path),
      '.txt': (path) => new TextLoader(path),
      '.md': (path) => new TextLoader(path),
    });

    const rawDocs = await directoryLoader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    if (data.links) {
      try {
        const linkDocs = await Promise.all(
          data.links.map(
            l => new PuppeteerWebBaseLoader(l).load(),
            {
              launchOptions: {
                headless: true,
              },
              gotoOptions: {
                waitUntil: "domcontentloaded",
              },
            }
          )
        );

        docs.concat(linkDocs.flat());
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

    for (const file of await fs.readdir(data.path)) {
      await fs.unlink(path.join(data.path, file));
    }
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

export default ingestData;