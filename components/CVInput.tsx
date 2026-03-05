'use client'

import { useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

type Tab = 'paste' | 'upload'

async function extractTextFromPdf(file: File): Promise<string> {
  // Dynamically import pdfjs-dist to avoid SSR issues
  const pdfjsLib = await import('pdfjs-dist')
  // Use CDN worker to avoid bundling the large worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(pageText)
  }
  return pages.join('\n')
}

export default function CVInput({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>('paste')
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setParseError('')
    setFileName(file.name)

    if (file.type === 'text/plain') {
      const text = await file.text()
      onChange(text)
      return
    }

    if (file.type === 'application/pdf') {
      setParsing(true)
      try {
        const text = await extractTextFromPdf(file)
        if (!text.trim()) throw new Error('Could not extract text. Try a text-based PDF.')
        onChange(text)
      } catch (e) {
        setParseError(e instanceof Error ? e.message : 'Failed to parse PDF.')
        setFileName('')
      } finally {
        setParsing(false)
      }
      return
    }

    setParseError('Unsupported file type. Please upload a PDF or TXT file.')
    setFileName('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearFile = () => {
    setFileName('')
    setParseError('')
    onChange('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-3 bg-gray-100 p-1 rounded-xl w-fit">
        {(['paste', 'upload'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); onChange(''); setFileName(''); setParseError('') }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'paste' ? '✏️ Paste Text' : '📎 Upload File'}
          </button>
        ))}
      </div>

      {tab === 'paste' ? (
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Paste the candidate's CV here...\n\nExample:\nJohn Smith, 34\nWorked 3 years at DHL warehouse — loading trucks, packing orders, operating pallet jack.\nPrevious job: labourer at construction site (2 years).`}
            rows={9}
            className="w-full rounded-2xl border-2 border-gray-200 bg-white p-5 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-[#00509B] transition-colors leading-relaxed"
          />
          {value.length > 0 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className="text-xs text-gray-400">{value.length} chars</span>
              <button
                onClick={() => onChange('')}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !fileName && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              fileName
                ? 'border-[#00B74F] bg-green-50'
                : 'border-gray-200 bg-white hover:border-[#00509B] hover:bg-blue-50 cursor-pointer'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleInputChange}
              className="hidden"
            />

            {parsing ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#00509B] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Reading CV…</p>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00B74F] flex items-center justify-center text-white text-lg">
                  ✓
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{fileName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{value.length} characters extracted</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); clearFile() }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl">📄</div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">
                    Drop a file here, or{' '}
                    <span className="text-[#00509B]">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PDF or TXT · Max 10MB</p>
                </div>
              </div>
            )}
          </div>

          {parseError && (
            <p className="mt-2 text-xs text-red-500">{parseError}</p>
          )}

          {/* Extracted text preview */}
          {value && !parsing && (
            <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                Extracted text preview
              </p>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{value}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
