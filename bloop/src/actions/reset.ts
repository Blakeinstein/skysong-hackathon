'use server';

import { promiseFs } from 'node:fs/promises';
import { PINECONE_INDEX_NAME } from "@/config/pinecone";
import { pinecone } from "@/utils/pinecone-client";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export async function reset() {
  const idx = pinecone.index(PINECONE_INDEX_NAME);
  await idx.deleteAll();

  return true;
}