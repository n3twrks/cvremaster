import { NextRequest, NextResponse } from 'next/server'

const MODELS = {
  primary: process.env.AI_MODEL_PRIMARY ?? 'gemini-2.5-flash-lite',
  fallback: process.env.AI_MODEL_FALLBACK ?? 'gemini-flash-lite-latest',
}

async function callGemini(
  system: string,
  user: string,
  apiKey: string,
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
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  )

  if (!response.ok && !useFallback) {
    return callGemini(system, user, apiKey, true)
  }

  return response
}

export async function POST(req: NextRequest) {
  const { system, user } = await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY manquante' }, { status: 500 })
  }

  const response = await callGemini(system, user, apiKey)
  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || 'Erreur Gemini' },
      { status: response.status }
    )
  }

  const result = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return NextResponse.json({ result })
}
