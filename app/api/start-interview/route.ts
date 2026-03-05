import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are an AI hiring assistant evaluating candidates for blue-collar jobs.

Your goal is to verify real work experience through a short text interview.

Rules:
- Ask only ONE question at a time
- Keep questions short and clear (2 sentences max)
- Use plain, everyday language — no jargon
- Focus on actual tasks the candidate has done
- Ask about specific situations, not hypotheticals
- Be friendly and professional`

export async function POST(req: NextRequest) {
  try {
    const { jobRole, cvText } = await req.json()

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: process.env.ANTHROPIC_BASE_URL,
    })

    const userMessage = `Job Role: ${jobRole.title}
Key tasks for this role: ${jobRole.tasks.join(', ')}

Candidate CV:
${cvText}

Start the interview. Based on what you see in the CV, ask your first practical question about their hands-on experience with this type of work. Ask only one question.`

    const message = await client.messages.create({
      model: 'MiniMax-M2.5',
      max_tokens: 180,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const question = (message.content[0] as { text: string }).text.trim()
    return NextResponse.json({ question })
  } catch (err) {
    console.error('[start-interview]', err)
    return NextResponse.json({ error: 'Failed to generate first question.' }, { status: 500 })
  }
}
