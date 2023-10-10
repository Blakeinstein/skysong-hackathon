'use client';

import Link from "next/link";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import Links from "./links";
import Texts from "./texts";
import Files from "./files";
import { CourseData } from "@/types/formData";
import DashLink from "@/components/dashlink";

export default function Home() {
  const methods = useForm<CourseData>();

  const submitHandler: SubmitHandler<CourseData> = async (data) => {
    console.log(data);

    const body = new FormData();
    for (const entry in data) {
      if (Array.isArray(data[entry])) {
        for (const subentry of data[entry]) {
          body.append(entry + '[]', subentry instanceof FileList ? subentry[0] : subentry);
        }
      } else {
        body.append(entry, data[entry] as never);
      }
    }

    const response = await fetch('/api/submitCourseMaterial', {
      method: "POST",
      body,
    });
    methods.reset();
    return response;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <DashLink />
      <h1 className='text-5xl'>Upload course materials</h1>
      <FormProvider {...methods}>
        <form className='flex flex-col gap-4 w-full lg:w-[40vw]' onSubmit={methods.handleSubmit(submitHandler)}>
          <Links />
          <Texts />
          <Files />
          <button className="btn btn-primary">Submit!</button>
        </form>
      </FormProvider>
    </main>
  )
}
