import { JobRole } from '@/lib/types'

interface Props {
  role: JobRole
  selected: boolean
  onSelect: () => void
}

export default function JobRoleCard({ role, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`text-left w-full p-5 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? 'border-[#00509B] bg-blue-50 shadow-md shadow-blue-900/10 scale-[1.02]'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm hover:scale-[1.01]'
      }`}
    >
      <div className="text-3xl mb-3">{role.icon}</div>
      <div className={`font-semibold mb-2.5 ${selected ? 'text-[#00509B]' : 'text-gray-900'}`}>
        {role.title}
      </div>
      <ul className="space-y-1.5">
        {role.tasks.map((task) => (
          <li key={task} className="text-xs text-gray-500 flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                selected ? 'bg-[#00509B]' : 'bg-gray-300'
              }`}
            />
            {task}
          </li>
        ))}
      </ul>
      {selected && (
        <div className="mt-3 text-xs font-semibold text-[#00509B] flex items-center gap-1">
          <span className="w-4 h-4 rounded-full bg-[#00509B] text-white text-[10px] flex items-center justify-center">
            ✓
          </span>
          Selected
        </div>
      )}
    </button>
  )
}
