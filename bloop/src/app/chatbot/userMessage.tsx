import { Icon } from "@iconify/react"
import { ReactNode } from "react"

const userMessage: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Icon icon="mingcute:user-1-line" className="w-8 h-8"/>
        </div>
      </div>
      <span className="chat-bubble chat-bubble-info">
        {children}
      </span>
    </div>
  )
}

export default userMessage;