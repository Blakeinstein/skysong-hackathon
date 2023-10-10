'use server';

import { PINECONE_INDEX_NAME } from "@/config/pinecone";
import { pinecone } from "@/utils/pinecone-client";
import { sleep } from "@/utils/sleep";

export async function reset() {
  try {

    await pinecone.deleteIndex(PINECONE_INDEX_NAME);
    await sleep(10000);
    await pinecone.createIndex({
      name: PINECONE_INDEX_NAME,
      dimension: 1536,
      metric: "cosine",
    });
  } catch (e) {
    console.log(e);
  }

  return true;
}