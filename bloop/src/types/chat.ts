import { Document } from 'langchain/document';

export type Message = {
  isUserMessage: boolean
  data: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

export type Chat = {
  messages: Message[]
}
