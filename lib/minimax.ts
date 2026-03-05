const MINIMAX_URL = 'https://api.minimax.io/anthropic/v1/messages'

interface MinimaxMessage {
  role: 'user' | 'assistant'
  content: string
}

interface MinimaxBody {
  model: string
  max_tokens: number
  system: string
  messages: MinimaxMessage[]
}

export async function callMinimax(body: MinimaxBody): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const res = await fetch(MINIMAX_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  // Log full response so we can see structure in Vercel logs
  console.log('[minimax] status:', res.status)
  console.log('[minimax] response:', JSON.stringify(data).slice(0, 500))

  if (!res.ok) {
    throw new Error(`MiniMax API ${res.status}: ${JSON.stringify(data)}`)
  }

  // Handle both Anthropic-style and direct text responses
  const content = data.content ?? data.choices
  if (!content || content.length === 0) {
    throw new Error(`Empty content in response: ${JSON.stringify(data)}`)
  }

  // MiniMax-M2.5 returns a thinking block before the text block — find the text one
  const block = content.find((b: { type: string }) => b.type === 'text') ?? content[0]
  const text = block.text ?? block.message?.content ?? block.content ?? ''

  if (!text) {
    throw new Error(`No text block found. Blocks: ${content.map((b: {type:string}) => b.type).join(', ')}`)
  }

  return text.trim()
}
