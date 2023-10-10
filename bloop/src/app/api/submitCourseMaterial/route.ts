import { NextRequest, NextResponse } from "next/server";

import promiseFs from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";

import { tempPath } from "@/config/temp";

type FileWritePromise = Promise<unknown>;

const downloadWebPageToFile = async (url: string): FileWritePromise => {
  const name = url.split("/").pop() || "web-url.html";
  const res = await fetch(url);
  if (!(res.status === 200) || !res.body) throw new Error("Failed to download web page");

  const writeStream = fs.createWriteStream(path.join(tempPath, name));

  const stream = new WritableStream({
    write(chunk) {
      writeStream.write(chunk);
    }
  })
  return res.body.pipeTo(stream);
}

export async function POST(request: NextRequest) {
  console.log(tempPath);

  const data = await request.formData();  

  const fileWritePromises: FileWritePromise[] = [];

  const links = data.getAll('links[]') as unknown as string[];
  fileWritePromises.concat(
    links?.map(l => downloadWebPageToFile(l))
  );

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
    texts?.map((t, i) => promiseFs.writeFile(path.join(tempPath, `raw-text-file-${i}`), t))
  );
  
  await Promise.all(fileWritePromises);


  return NextResponse.json({ success: true })
}