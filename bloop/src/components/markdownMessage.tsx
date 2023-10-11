import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

export default function MarkdownMessage({ children }: { children: string }) {
  return <Markdown
    className="prose break-words prose-p:leading-relaxed prose-pre:p-0"
    remarkPlugins={[remarkGfm, remarkMath]}
    components={{
      p({ children }) {
        return <p className="mb-2 last:mb-0">{children}</p>
      }
    }}
  >
    {children}
  </Markdown>
}