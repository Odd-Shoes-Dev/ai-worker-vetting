import { Evaluation } from '@/lib/types'

const RECOMMENDATION_STYLES: Record<
  Evaluation['recommendation'],
  { bg: string; text: string; label: string; dot: string }
> = {
  'Strong Fit': {
    bg: 'bg-[#00B74F]',
    text: 'text-white',
    label: '✓ Strong Fit',
    dot: 'bg-[#00B74F]',
  },
  'Possible Fit': {
    bg: 'bg-amber-400',
    text: 'text-white',
    label: '~ Possible Fit',
    dot: 'bg-amber-400',
  },
  'Not Recommended': {
    bg: 'bg-red-500',
    text: 'text-white',
    label: '✕ Not Recommended',
    dot: 'bg-red-500',
  },
}

function ScoreArc({ score }: { score: number }) {
  const color =
    score >= 70 ? '#00B74F' : score >= 45 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-6xl font-bold tabular-nums"
        style={{ color }}
      >
        {score}
      </div>
      <div className="text-base text-gray-400 font-medium -mt-1">/ 100</div>
      {/* Score bar */}
      <div className="mt-3 w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

interface Props {
  evaluation: Evaluation
}

export default function EvaluationCard({ evaluation }: Props) {
  const style = RECOMMENDATION_STYLES[evaluation.recommendation]

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      {/* Top band */}
      <div className={`h-1.5 ${style.dot}`} />

      {/* Score + Badge */}
      <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-gray-50">
        <ScoreArc score={evaluation.score} />
        <div
          className={`px-5 py-2.5 rounded-full ${style.bg} ${style.text} font-semibold text-sm shadow-sm`}
        >
          {style.label}
        </div>
      </div>

      {/* Summary */}
      <div className="px-8 py-6 border-b border-gray-50">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Summary
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">{evaluation.summary}</p>
      </div>

      {/* Strengths & Concerns */}
      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-[#00B74F] uppercase tracking-widest mb-3">
            Strengths
          </p>
          <ul className="space-y-2">
            {evaluation.strengths.length > 0 ? (
              evaluation.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#00B74F] font-bold mt-px">✓</span>
                  {s}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400">None noted.</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Concerns
          </p>
          <ul className="space-y-2">
            {evaluation.concerns.length > 0 ? (
              evaluation.concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 mt-px">·</span>
                  {c}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400">No significant concerns.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
