import Link from "next/link"

import { reset } from "@/actions/reset"

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className='text-5xl'>Welcome!</h1>
      <div className='flex flex-col gap-2'>
        <Link className='btn' href="/instructor">Instructor View</Link>
        <Link className='btn' href="/student">Student View</Link>
        <form className='contents' action={reset}>
          <button className='btn'>Reset</button>
        </form>
      </div>
    </main>
  )
}
