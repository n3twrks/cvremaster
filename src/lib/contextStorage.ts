export interface ContextEntry {
  id: string
  type: 'profile' | 'education' | 'experience' | 'skills' | 'aspirations' | 'qualities' | 'flaws'
  label: string
  transcript: string
  transcribedAt?: string
  durationSec?: number
  isEdited?: boolean
}

export interface ContextPack {
  entries: ContextEntry[]
  updatedAt: string
  combinedText?: string
}

const key = (projectId: string) => `cvremaster_context_${projectId}`

export function loadContextPack(projectId: string): ContextPack {
  try {
    const raw = localStorage.getItem(key(projectId))
    return raw ? (JSON.parse(raw) as ContextPack) : { entries: [], updatedAt: new Date().toISOString() }
  } catch {
    return { entries: [], updatedAt: new Date().toISOString() }
  }
}

export function saveContextPack(projectId: string, pack: ContextPack): void {
  localStorage.setItem(key(projectId), JSON.stringify(pack))
}

export function clearContextPack(projectId: string): void {
  try { localStorage.removeItem(key(projectId)) } catch {}
}
