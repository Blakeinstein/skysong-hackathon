'use client';

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Icon } from '@iconify/react';
import Image from 'next/image';
import UserMessage from "./userMessage";
import AiMessage from "./aiMessage";

import { Message } from "@/types/chat";
import Link from "next/link";
import DashLink from "@/components/dashlink";

const Chat = () => {
  const { register, handleSubmit, reset } = useForm<{ message: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage: SubmitHandler<{ message: string }> = async (data) => {
    const history = [...messages];
    setMessages([...history, {
      isUserMessage: true,
      data: data.message,
    }]);

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

    setMessages([...history, {
      isUserMessage: true,
      data: data.message,
    }, {
      isUserMessage: false,
      data: apiResponse.text as unknown as string,
      sourceDocs: apiResponse.sourceDocuments,
    }]);
  }

  return <div className="h-full flex flex-col gap-4 justify-end p-4 border-2 shadow-xl border-black">
    <div className="grow">
      <DashLink />
    </div>
    <AiMessage>What would you like to know today?</AiMessage>
    {messages.map((message, i) => {
      if (message.isUserMessage) {
        return (
          <UserMessage key={`user-${i}`}>{message.data}</UserMessage>
        )
      } else {
        return (
          <AiMessage key={`api-${i}`}>
            {message.data}
          </AiMessage>
        )
      }
    })}
    <div className="grid place-items-center">
      {loading && <span className="loading loading-dots loading-lg" />}
    </div>
    <form className="join" onSubmit={handleSubmit(sendMessage)}>
      <input className="join-item input input-bordered grow" type="text" {...register('message')} />
      <button className="join-item btn btn-primary">
        <Icon icon="mingcute:send-fill" className="w-6 h-6"/>
      </button>
    </form>
  </div>
}

export default Chat;