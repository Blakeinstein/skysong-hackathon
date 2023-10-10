import Link from "next/link"

import { reset } from "@/actions/reset"
import { pinecone } from "@/utils/pinecone-client"
import { PINECONE_INDEX_NAME } from "@/config/pinecone"
import { activeJob } from "./api/submitCourseMaterial/route"

async function getData() {
  try {
    const res = await pinecone.index(PINECONE_INDEX_NAME).describeIndexStats()
    return { count: res.totalRecordCount, state: activeJob.state };
  } catch (e) {
    return { count: 0, state: 'inactive' };
  }
}

const Home = async () => {
  const { count, state } = await getData();

  const isLoading = !(state !== 'pending' && count !== 0);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className='text-5xl'>Welcome!</h1>
      <div className='flex flex-col gap-2'>
        <Link className='btn' href="/instructor">Upload documents</Link>
        <div className="flex gap-2">
          {state === 'pending' && <span className="loading loading-spinner loading-md" />}
          <Link className={`btn ${isLoading && 'btn-disabled'} `} href="/quiz">Generate quiz</Link>
          <Link className={`btn ${isLoading && 'btn-disabled'} `} href="/chatbot">Chatbot</Link>
        </div>
        <form className='contents' action={reset}>
          <button className='btn btn-error'>Reset</button>
        </form>
      </div>
    </main>
  )
}

export default Home;