import { Message } from '@/lib/types'
import ThinkingIndicator from './ThinkingIndicator'

interface Props {
  messages: Message[]
  isThinking: boolean
}

function AIAvatar() {
  return (
    <div className="w-7 h-7 rounded-full bg-[#00509B] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5 shadow-sm">
      AI
    </div>
  )
}

export default function InterviewChat({ messages, isThinking }: Props) {
  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex items-start gap-2.5 animate-fade-in ${
            msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {msg.role === 'assistant' && <AIAvatar />}
          <div
            className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'assistant'
                ? 'bg-white border border-gray-100 shadow-sm rounded-tl-sm text-gray-800'
                : 'bg-[#00509B] text-white rounded-tr-sm shadow-sm shadow-blue-900/20'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex items-start gap-2.5">
          <AIAvatar />
          <ThinkingIndicator />
        </div>
      )}
    </div>
  )
}
