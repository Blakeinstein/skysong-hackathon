'use server';

import { PINECONE_INDEX_NAME } from "@/config/pinecone";
import { pinecone } from "@/utils/pinecone-client";

export async function reset() {
  await pinecone.deleteIndex(PINECONE_INDEX_NAME);
  return true;
}