'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import JobRoleCard from '@/components/JobRoleCard'
import CVInput from '@/components/CVInput'
import { JOB_ROLES } from '@/lib/jobRoles'
import { JobRole } from '@/lib/types'

export default function LandingPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null)
  const [cvText, setCvText] = useState('')
  const [error, setError] = useState('')

  const handleStart = () => {
    if (!selectedRole) {
      setError('Please select a job role to continue.')
      return
    }
    if (cvText.trim().length < 30) {
      setError('Please paste a CV with at least a brief work history.')
      return
    }
    sessionStorage.setItem(
      'interview_session',
      JSON.stringify({ jobRole: selectedRole, cvText: cvText.trim() })
    )
    router.push('/interview')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-[#00509B] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B74F] animate-pulse" />
          AI-Powered Candidate Screening
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          AI Worker Vetting Demo
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          Adaptive AI interviews for faster hiring.
        </p>
      </div>

      {/* Step 1 */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-6 rounded-full bg-[#00509B] text-white text-xs font-bold flex items-center justify-center">
            1
          </div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
            Select a Job Role
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {JOB_ROLES.map((role) => (
            <JobRoleCard
              key={role.id}
              role={role}
              selected={selectedRole?.id === role.id}
              onSelect={() => {
                setSelectedRole(role)
                setError('')
              }}
            />
          ))}
        </div>
      </div>

      {/* Step 2 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-6 h-6 rounded-full bg-[#00509B] text-white text-xs font-bold flex items-center justify-center">
            2
          </div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">
            Paste Candidate CV
          </h2>
        </div>
        <CVInput value={cvText} onChange={(v) => { setCvText(v); setError('') }} />
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-2xl bg-[#00509B] text-white font-semibold text-base hover:bg-[#003d7a] active:scale-[0.99] transition-all duration-150 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
      >
        Start AI Interview
        <span className="text-lg">→</span>
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        5 questions · ~3 minutes · AI-generated report
      </p>
    </div>
  )
}
