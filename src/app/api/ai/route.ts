import { NextRequest, NextResponse } from 'next/server'

const MODELS = {
  primary: 'gemini-flash-lite-latest',
  fallback: 'gemini-flash-lite-latest',
}

interface HistoryMessage {
  role: 'user' | 'model'
  content: string
}

async function callGemini(
  system: string,
  user: string,
  history: HistoryMessage[],
  apiKey: string,
  maxOutputTokens: number,
  useFallback = false
): Promise<Response> {
  const model = useFallback ? MODELS.fallback : MODELS.primary

  // Build multi-turn contents: history + current user message
  const contents = [
    ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
    { role: 'user', parts: [{ text: user }] },
  ]

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens },
      }),
    }
  )

  if (!response.ok && !useFallback) {
    return callGemini(system, user, history, apiKey, maxOutputTokens, true)
  }

  return response
}

export async function POST(req: NextRequest) {
  const { system, user, history = [], maxOutputTokens = 4096 } = await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY manquante' }, { status: 500 })
  }

  const response = await callGemini(system, user, history as HistoryMessage[], apiKey, maxOutputTokens)
  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || 'Erreur Gemini' },
      { status: response.status }
    )
  }

  const candidate = data.candidates?.[0]
  const result: string = candidate?.content?.parts?.[0]?.text || ''
  const finishReason: string = candidate?.finishReason || 'UNKNOWN'

  console.log(`[Gemini] turns=${(history as HistoryMessage[]).length / 2 + 1} finishReason=${finishReason} responseLength=${result.length}`)
  if (finishReason === 'MAX_TOKENS') {
    console.warn('[Gemini] ⚠️  Response was truncated — increase maxOutputTokens or reduce history.')
  }

  return NextResponse.json({ result, finishReason })
}
