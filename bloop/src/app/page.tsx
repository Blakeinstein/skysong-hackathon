import Link from "next/link"

import { reset } from "@/actions/reset"
import { activeJob } from "./api/submitCourseMaterial/route"

async function getData() {
  try {
    return { state: activeJob.state };
  } catch (e) {
    return { state: 'inactive' };
  }
}

const Home = async () => {
  const { state } = await getData();

  const isLoading = !(state !== 'pending');
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className='text-5xl'>Blob: AI-TA</h1>
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