import React from "react";
import MarkdownMessage from "@/components/markdownMessage";
import { Icon } from "@iconify/react";

const aiMessage: React.FC<{ children: string }> = ({ children }) => {

  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Icon icon="eos-icons:ai-healing-outlined" className="w-10 h-10"/>
        </div>
      </div>
      <div className="chat-bubble chat-bubble-success ">
        <MarkdownMessage>{children}</MarkdownMessage>
      </div>
    </div>
  )
}

export default aiMessage;
