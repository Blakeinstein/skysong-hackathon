import React from "react";
import MarkdownMessage from "@/components/markdownMessage";
import { Icon } from "@iconify/react";

const aiMessage: React.FC<{ children: string }> = ({ children }) => {

  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            src="https://media2.giphy.com/media/hSKujYy774RrlhpAHB/giphy.gif?cid=ecf05e47ttxs9zooxzci9n475z01b8i2io53u2natdm286ja&ep=v1_gifs_related&rid=giphy.gif&ct=g"
            alt="ai"
            className="grayscale"
          />
        </div>
      </div>
      <div className="chat-bubble chat-bubble-success ">
        <MarkdownMessage>{children}</MarkdownMessage>
      </div>
    </div>
  )
}

export default aiMessage;
