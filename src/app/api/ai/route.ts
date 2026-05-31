import { NextRequest, NextResponse } from 'next/server'

const MODELS = {
  primary: 'gemini-2.5-flash-lite',
  fallback: 'gemini-flash-lite-latest',
}

async function callGemini(
  system: string,
  user: string,
  apiKey: string,
  maxOutputTokens: number,
  useFallback = false
): Promise<Response> {
  const model = useFallback ? MODELS.fallback : MODELS.primary

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens },
      }),
    }
  )

  if (!response.ok && !useFallback) {
    return callGemini(system, user, apiKey, maxOutputTokens, true)
  }

  return response
}

export async function POST(req: NextRequest) {
  const { system, user, maxOutputTokens = 4096 } = await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY manquante' }, { status: 500 })
  }

  const response = await callGemini(system, user, apiKey, maxOutputTokens)
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

  console.log(`[Gemini] finishReason=${finishReason} responseLength=${result.length}`)
  if (finishReason === 'MAX_TOKENS') {
    console.warn('[Gemini] ⚠️  Response was truncated — JSON will be incomplete. Increase maxOutputTokens or reduce input.')
  }
  if (!result) {
    console.error('[Gemini] Empty result. Full candidate:', JSON.stringify(candidate))
  }

  return NextResponse.json({ result, finishReason })
}
