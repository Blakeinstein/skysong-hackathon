import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();

  const files = data.getAll('files[]') as unknown as FileList;
  if (files) {
    const bytesPromises = [];
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].name);
      bytesPromises.push(files[i].arrayBuffer());
    }
    const bytes = await Promise.all(bytesPromises);
    const buffers = bytes.map(b => Buffer.from(b));
    console.log(buffers);
  }

  return NextResponse.json({ success: true })
}