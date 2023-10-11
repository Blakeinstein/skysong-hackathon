'use client';

import DashLink from "@/components/dashlink";
import MarkdownMessage from "@/components/markdownMessage";
import Link from "next/link";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { BaseResponse } from "serpapi";

export type QuizGenerateRequest = {
  topics: string,
  constraints?: string,
  count: number
}



const parseSuggestions = (res: BaseResponse) => {
  return res["related_questions"].map((question: Record<string, string>) => ({
    title: question["question"],
    description: question["snippet"],
    link: question["link"],
  }))
}

export default function Home() {
  const methods = useForm<QuizGenerateRequest>();

  const [quizData, setQuizData] = useState<string>('');

  const [topicSuggestions, setTopicSuggestions] = useState<ReturnType<typeof parseSuggestions>[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<QuizGenerateRequest> = async (data) => {
    const { topics, constraints, count } = data;

    setLoading(true);
    const [result, suggestions] = await Promise.all([
      fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: `Can you generate ${count} number of questions about ${topics} with 1 correct and 3 correct options` +
          (constraints ? ` and ${constraints}?` : '?'),
          history: [],
        }),
      }).then(res => res.json()),
      fetch("/api/quiz?" + new URLSearchParams({ topics })).then(res => res.json()).then(parseSuggestions),
    ]);
    
    setLoading(false);

    setTopicSuggestions(suggestions);

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
      <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-1 gap-2 w-full p-12">
        <div className={"p-12 col-span-2 bg-white" + (quizData && " border-2 shadow-xl")}>
          <MarkdownMessage>
            {quizData}
          </MarkdownMessage>
        </div>
        <div className={"p-2 bg-white flex flex-col gap-2 items-center" + (quizData && " border-2 shadow-xl")}>
          {topicSuggestions.map((topic, i) => (
            <div className="card w-96 bg-base-100 shadow-xl" key={i}>
              <div className="card-body">
                <h2 className="card-title">{topic.title}</h2>
                <p>{topic.description}</p>
                <div className="card-actions justify-end">
                  <a className="btn btn-primary" href={topic.link} target="_blank">Go to reference</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
