'use client';

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

export type QuizGenerateRequest = {
  topics: string
}

export default function Home() {
  const methods = useForm<QuizGenerateRequest>();

  const onSubmit: SubmitHandler<QuizGenerateRequest> = (data) => {

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className='text-5xl'>Generate a quiz</h1>
      <div className='flex flex-col gap-2'>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex lg:w-[30vw] flex-col gap-2">
            <label className="flex gap-2 items-center">
              Topic(s):
              <input className="input input-bordered input-sm grow" {...methods.register('topics', { required: true })} />
            </label>
            <label className="flex flex-col gap-2 w-full">
              Additional criteria:
              <textarea className="textarea textarea-bordered" {...methods.register('topics')} />
            </label>
            <button className="btn btn-primary">Go!</button>
          </form>
        </FormProvider>
      </div>
    </main>
  )
}
