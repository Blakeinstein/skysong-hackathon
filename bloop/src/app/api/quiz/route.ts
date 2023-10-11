import { NextResponse } from "next/server";
import { getJson } from "serpapi";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const topics = url.searchParams.get('topics');
    if (!topics) {
      return NextResponse.json({ message: 'No question in the request' }, { status: 400 });
    }
    const data = await getJson({
      q: topics + "in AWS",
      engine: "google",
      api_key: process.env.SERPAPI_API_KEY,
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Something went wrong' }, { status: 500 });
  }
}