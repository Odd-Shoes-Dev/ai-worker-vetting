interface Props {
  value: string
  onChange: (value: string) => void
}

export default function CVInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste the candidate's CV here...\n\nExample:\nJohn Smith, 34\nWorked 3 years at DHL warehouse — loading trucks, packing orders, operating pallet jack.\nPrevious job: labourer at construction site (2 years).`}
        rows={9}
        className="w-full rounded-2xl border-2 border-gray-200 bg-white p-5 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#00509B] transition-colors leading-relaxed"
      />
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {value.length > 0 && (
          <>
            <span className="text-xs text-gray-400">{value.length} chars</span>
            <button
              onClick={() => onChange('')}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  )
}
