'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import InterviewChat from '@/components/InterviewChat'
import { InterviewSession, Message } from '@/lib/types'

const MAX_QUESTIONS = 5

export default function InterviewPage() {
  const router = useRouter()
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [answer, setAnswer] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load session from storage
  useEffect(() => {
    const raw = sessionStorage.getItem('interview_session')
    if (!raw) {
      router.push('/')
      return
    }
    setSession(JSON.parse(raw))
  }, [router])

  // Start interview once session is loaded
  useEffect(() => {
    if (session && !initialized.current) {
      initialized.current = true
      startInterview(session)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const startInterview = async (s: InterviewSession) => {
    setIsThinking(true)
    try {
      const res = await fetch('/api/start-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole: s.jobRole, cvText: s.cvText }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMessages([{ role: 'assistant', content: data.question }])
      setQuestionCount(1)
    } catch {
      setError('Failed to start the interview. Check your API key in .env.local.')
    } finally {
      setIsThinking(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim() || isThinking || !session) return

    const userMsg: Message = { role: 'user', content: answer.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setAnswer('')
    setIsThinking(true)
    setError('')

    try {
      const res = await fetch('/api/next-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole: session.jobRole,
          cvText: session.cvText,
          conversationHistory: updatedMessages,
          questionCount,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()

      if (data.evaluation) {
        sessionStorage.setItem('evaluation_result', JSON.stringify(data.evaluation))
        sessionStorage.setItem('interview_role', session.jobRole.title)
        sessionStorage.setItem('interview_role_icon', session.jobRole.icon)
        router.push('/result')
      } else {
        setMessages([...updatedMessages, { role: 'assistant', content: data.question }])
        setQuestionCount((q) => q + 1)
        setTimeout(() => textareaRef.current?.focus(), 100)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!session) return null

  const progress = Math.round((questionCount / MAX_QUESTIONS) * 100)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>{session.jobRole.icon}</span>
              <span>{session.jobRole.title} Interview</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Question {Math.min(questionCount, MAX_QUESTIONS)} of {MAX_QUESTIONS}
            </p>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < questionCount ? 'bg-[#00509B]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00509B] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-gray-50 rounded-3xl p-5 overflow-y-auto mb-4"
        style={{ maxHeight: '420px', minHeight: '300px' }}>
        <InterviewChat messages={messages} isThinking={isThinking} />
        <div ref={bottomRef} />
      </div>

      {/* Answer input */}
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer here… (Enter to send, Shift+Enter for new line)"
          rows={3}
          disabled={isThinking || questionCount === 0}
          className="flex-1 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#00509B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || isThinking || questionCount === 0}
          className="h-[78px] px-6 rounded-2xl bg-[#00509B] text-white font-semibold text-sm hover:bg-[#003d7a] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-900/20 flex-shrink-0"
        >
          Send
        </button>
      </div>

      {error && (
        <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
