'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EvaluationCard from '@/components/EvaluationCard'
import { Evaluation } from '@/lib/types'

export default function ResultPage() {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [role, setRole] = useState('')
  const [icon, setIcon] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('evaluation_result')
    if (!raw) {
      router.push('/')
      return
    }
    setEvaluation(JSON.parse(raw))
    setRole(sessionStorage.getItem('interview_role') ?? '')
    setIcon(sessionStorage.getItem('interview_role_icon') ?? '')
  }, [router])

  if (!evaluation) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 text-[#00B74F] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B74F]" />
          Interview Complete
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Candidate Evaluation</h1>
        {role && (
          <p className="text-gray-500 text-sm">
            {icon} {role}
          </p>
        )}
      </div>

      <EvaluationCard evaluation={evaluation} />

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            sessionStorage.clear()
            router.push('/')
          }}
          className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          ← New Interview
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 rounded-xl bg-[#00509B] text-white font-medium text-sm hover:bg-[#003d7a] transition-all shadow-md shadow-blue-900/20"
        >
          Print Report
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        This evaluation is AI-generated and should be used as a screening aid, not a final hiring decision.
      </p>
    </div>
  )
}
