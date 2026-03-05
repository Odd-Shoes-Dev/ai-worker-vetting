import { NextRequest, NextResponse } from 'next/server'
import { callMinimax } from '@/lib/minimax'

const SYSTEM_PROMPT = `You are an AI hiring assistant evaluating candidates for blue-collar jobs.

Your goal is to verify real work experience through a short text interview.

Rules:
- Ask only ONE question at a time
- Keep questions short and clear (2 sentences max)
- Use plain, everyday language — no jargon
- Focus on actual tasks the candidate has done
- Build on what the candidate just said
- Be friendly and professional`

const MAX_QUESTIONS = 5

export async function POST(req: NextRequest) {
  try {
    const { jobRole, cvText, conversationHistory, questionCount } = await req.json()

    const transcript = conversationHistory
      .map((m: { role: string; content: string }) =>
        `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`
      )
      .join('\n\n')

    // After 5 answered questions → generate evaluation
    if (questionCount >= MAX_QUESTIONS) {
      const evalPrompt = `You have completed a ${MAX_QUESTIONS}-question interview for the role of ${jobRole.title}.

Candidate CV:
${cvText}

Interview transcript:
${transcript}

Now produce a final candidate evaluation. Return ONLY a valid JSON object — no markdown, no explanation:

{
  "score": <integer 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "concerns": ["<concern 1>", "<concern 2>"],
  "summary": "<2-3 sentence plain-language summary>",
  "recommendation": "<Strong Fit|Possible Fit|Not Recommended>"
}

Base your evaluation on:
- Relevance of experience to ${jobRole.title}
- Ability to handle: ${jobRole.tasks.join(', ')}
- Reliability and work ethic from their answers

Be honest and practical. Use simple language.`

      const raw = await callMinimax({
        model: 'MiniMax-M2.5',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: evalPrompt }],
      })

      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in evaluation response')
      const evaluation = JSON.parse(jsonMatch[0])
      return NextResponse.json({ evaluation })
    }

    // Generate next question
    const nextPrompt = `Job Role: ${jobRole.title}
Required tasks: ${jobRole.tasks.join(', ')}

Candidate CV:
${cvText}

Interview so far:
${transcript}

This is question ${questionCount + 1} of ${MAX_QUESTIONS}. Based on the candidate's last answer, ask ONE focused follow-up question about their practical experience. Keep it short and conversational.`

    const question = await callMinimax({
      model: 'MiniMax-M2.5',
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: nextPrompt }],
    })

    return NextResponse.json({ question })
  } catch (err) {
    console.error('[next-question]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
