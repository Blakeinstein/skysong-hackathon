'use client';

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Icon } from '@iconify/react';

import UserMessage from "./userMessage";
import AiMessage from "./aiMessage";
import { Message } from "@/types/chat";
import DashLink from "@/components/dashlink";

const Chat = () => {
  const { register, handleSubmit, reset } = useForm<{ message: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage: SubmitHandler<{ message: string }> = async (data) => {
    const history = [...messages];
    setMessages([
      {
        isUserMessage: true,
        data: data.message,
      },
      ...history
    ]);

    setLoading(true);
    reset();

    const apiResponse = await (fetch("/api/chat/", {
      method: "POST",
      body: JSON.stringify({
        message: data.message,
        history,
      }),
    }).then(res => res.json()));

    setLoading(false);

    setMessages([{
      isUserMessage: false,
      data: apiResponse.text as unknown as string,
      sourceDocs: apiResponse.sourceDocuments,
    }, {
      isUserMessage: true,
      data: data.message,
    }, ...history]);
  }

  return <div className="h-full flex flex-col-reverse gap-4 p-4 border-2 shadow-xl border-black overflow-scroll">
    <form className="join" onSubmit={handleSubmit(sendMessage)}>
      <input className="join-item input input-bordered grow" type="text" {...register('message')} />
      <button className="join-item btn btn-primary">
        <Icon icon="mingcute:send-fill" className="w-6 h-6"/>
      </button>
    </form>
    <div className="grid place-items-center">
      {loading && <span className="loading loading-dots loading-lg" />}
    </div>
    {messages.map((message, i) => {
      if (message.isUserMessage) {
        return (
          <UserMessage key={`user-${i}`}>
            {message.data}
          </UserMessage>
        )
      } else {
        return (
          <AiMessage key={`api-${i}`}>
            {message.data}
          </AiMessage>
        )
      }
    })}
    <AiMessage>How can I help you with the course today?</AiMessage>
    <div className="grow">
      <DashLink />
    </div>
  </div>
}

export default Chat;