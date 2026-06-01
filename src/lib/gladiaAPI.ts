export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData()
  form.append('audio', blob)
  const res = await fetch('/api/transcribe', { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Transcription échouée')
  return data.transcript as string
}
