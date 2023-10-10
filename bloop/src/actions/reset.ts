'use server';

import { PINECONE_INDEX_NAME } from "@/config/pinecone";
import fs from "node:fs/promises";

import { tempPath } from "@/config/temp";
import { pinecone } from "@/utils/pinecone-client";
import path from "node:path";
import { sleep } from "@/utils/sleep";

export async function reset() {
  try {
    for (const file of await fs.readdir(tempPath)) {
      await fs.unlink(path.join(tempPath, file));
    }

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