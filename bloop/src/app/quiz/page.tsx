'use client';

import DashLink from "@/components/dashlink";
import MarkdownMessage from "@/components/markdownMessage";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, SubmitHandler, set, useForm } from "react-hook-form";
import Markdown from "react-markdown";

export type QuizGenerateRequest = {
  topics: string,
  constraints?: string,
  count: number
}

export default function Home() {
  const methods = useForm<QuizGenerateRequest>();

  const [quizData, setQuizData] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<QuizGenerateRequest> = async (data) => {
    const { topics, constraints, count } = data;

    setLoading(true);
    const result = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: `Can you generate ${count} number of questions about ${topics} with 1 correct and 3 correct options` +
        (constraints ? ` and ${constraints}?` : '?'),
        history: [],
      }),
    }).then(res => res.json());
    
    setLoading(false);

    setQuizData(result.text);
  }

  return (
    <main className="h-screen w-full p-4 flex flex-col items-center gap-2">
      <DashLink />
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
              <textarea className="textarea textarea-bordered" {...methods.register('constraints', { required: false})} />
            </label>
            <label>
              Number of questions: {methods.watch('count') || 5}
              <input
                className="range range-sm"
                type="range"
                step={1}
                min={1}
                max={20}
                {...methods.register('count', { required: true, min: 1, max: 20, value: 5 })}
              />
            </label>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading loading-lg" /> : 'Generate'}
            </button>
          </form>
        </FormProvider>
      </div>
      {quizData && <div className="grow border-2 shadow-xl p-12 bg-white">
        <MarkdownMessage>
          {quizData}
        </MarkdownMessage>
      </div>}
    </main>
  )
}
