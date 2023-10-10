import { NextRequest, NextResponse } from "next/server";

import promiseFs from "node:fs/promises";
import path from "node:path";

import { tempPath } from "@/config/temp";
import ingestQueue from "@/queue/ingest";
import ingestData from "@/actions/ingestData";

type FileWritePromise = Promise<unknown>;

export const activeJob: {
  state: "inactive" | "active" | "done";
  job?: Promise<unknown>
} = { state: "inactive"};

export async function POST(request: NextRequest) {
  console.log("Got post");

  const data = await request.formData();  

  const fileWritePromises: FileWritePromise[] = [];

  const files = data.getAll('files[]') as unknown as FileList;
  if (files) {
    const bytesPromises = [];
    for (let i = 0; i < files.length; i++) {
      bytesPromises.push(files[i].arrayBuffer());
    }
    const bytes = await Promise.all(bytesPromises);
    const buffers = bytes.map(b => Buffer.from(b));
    fileWritePromises.concat(
      buffers.map(
        (b, i) => promiseFs.writeFile(path.join(tempPath, files[i].name), b)
      )
    );
  }

  const texts = data.getAll('texts[]') as unknown as string[];
  fileWritePromises.concat(
    texts?.map((t, i) => promiseFs.writeFile(path.join(tempPath, `raw-text-file-${i}.txt`), t))
  );
  
  await Promise.all(fileWritePromises);

  activeJob.state = "active";
  activeJob.job = ingestData({ path: tempPath, links: data.getAll('links[]') as unknown as string[]}).then(
    () => {
      activeJob.state = "done";
      activeJob.job = undefined;
    }
  );
  return NextResponse.json({ success: true })
}