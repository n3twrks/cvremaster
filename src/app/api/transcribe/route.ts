import { NextRequest, NextResponse } from 'next/server'

const GLADIA_UPLOAD = 'https://api.gladia.io/v2/upload'
const GLADIA_TRANSCRIPTION = 'https://api.gladia.io/v2/transcription'

async function upload(audio: Blob, apiKey: string): Promise<string> {
  const form = new FormData()
  form.append('audio', audio)
  const res = await fetch(GLADIA_UPLOAD, {
    method: 'POST',
    headers: { 'x-gladia-key': apiKey },
    body: form,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gladia upload failed (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.audio_url as string
}

async function startTranscription(audioUrl: string, apiKey: string): Promise<string> {
  const res = await fetch(GLADIA_TRANSCRIPTION, {
    method: 'POST',
    headers: { 'x-gladia-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_config: { code_switching: false },
      diarization: false,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gladia transcription start failed (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.id as string
}

async function pollUntilDone(id: string, apiKey: string, maxAttempts = 60): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(r => setTimeout(r, 2000))
    const res = await fetch(`${GLADIA_TRANSCRIPTION}/${id}`, {
      headers: { 'x-gladia-key': apiKey },
    })
    if (!res.ok) throw new Error(`Gladia poll failed (${res.status})`)
    const data = await res.json()
    if (data.status === 'done') {
      return (data.result?.transcription?.full_transcript as string) ?? ''
    }
    if (data.status === 'error') {
      throw new Error('Gladia transcription error: ' + (data.error_message ?? 'unknown'))
    }
  }
  throw new Error('Transcription timeout — réessayez avec un fichier plus court.')
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.Gladia_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Gladia_API_KEY manquante côté serveur' }, { status: 500 })
  }

  let audioBlob: Blob
  try {
    const form = await req.formData()
    const file = form.get('audio')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Fichier audio manquant' }, { status: 400 })
    }
    audioBlob = file as Blob
  } catch {
    return NextResponse.json({ error: 'Impossible de lire le fichier audio' }, { status: 400 })
  }

  try {
    const audioUrl = await upload(audioBlob, apiKey)
    const id = await startTranscription(audioUrl, apiKey)
    const transcript = await pollUntilDone(id, apiKey)
    return NextResponse.json({ transcript })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur inconnue'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
