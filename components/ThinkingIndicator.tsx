'use client'

export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 w-fit animate-fade-in">
      <div className="flex gap-1.5 items-center">
        <div className="w-2 h-2 rounded-full bg-[#00509B] animate-bounce3 dot-1" />
        <div className="w-2 h-2 rounded-full bg-[#00509B] animate-bounce3 dot-2" />
        <div className="w-2 h-2 rounded-full bg-[#00509B] animate-bounce3 dot-3" />
      </div>
      <span className="text-xs text-gray-400 font-medium">AI is thinking…</span>
    </div>
  )
}
