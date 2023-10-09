import Link from "next/link"

export default function Home() {
  const reset = () => {
    console.log("reset attempt");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className='text-5xl'>Welcome!</h1>
      <div className='flex flex-col gap-2'>
        <Link className='btn' href="/instructor">Instructor View</Link>
        <Link className='btn' href="/student">Student View</Link>
        <button className='btn' onClick={reset}>Reset</button>
      </div>
    </main>
  )
}
