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
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey) throw new Error('MINIMAX_API_KEY is not set')

  const res = await fetch(MINIMAX_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`MiniMax API ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data.content[0].text.trim()
}
