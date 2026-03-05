import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    if (file.type === 'text/plain') {
      return NextResponse.json({ text: buffer.toString('utf-8') })
    }

    if (file.type === 'application/pdf') {
      // Use the lib path directly to avoid pdf-parse's test file loading issue in Next.js
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js')
      const data = await pdfParse(buffer)
      if (!data.text?.trim()) {
        return NextResponse.json({ error: 'Could not extract text. Try a text-based PDF or paste manually.' }, { status: 422 })
      }
      return NextResponse.json({ text: data.text })
    }

    return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or TXT file.' }, { status: 400 })
  } catch (err) {
    console.error('[parse-cv]', err)
    return NextResponse.json({ error: 'Failed to parse file.' }, { status: 500 })
  }
}
