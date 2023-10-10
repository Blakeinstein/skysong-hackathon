import { ReactNode } from "react"
import Image from 'next/image';

const aiMessage: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="chat chat-start">
      
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image src="/bot-image.png" alt="bot" width="200" height="200" />
        </div>
      </div>
      <span className="chat-bubble chat-bubble-success">
        {children}
      </span>
    </div>
  )
}

export default aiMessage;