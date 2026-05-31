import { CVData } from '@/types/cv'

const CV_KEY = 'cvremaster_data'
const TEMPLATE_KEY = 'cvremaster_template'
const PHOTO_KEY = 'cvremaster_photo'
const SHOW_PHOTO_KEY = 'cvremaster_show_photo'
const VERSIONS_KEY = 'cvremaster_versions'

const MAX_VERSIONS = 20

export interface CVVersionSnapshot {
  savedAt: string
  data: CVData
}

export interface CVVersion {
  id: string
  name: string
  savedAt: string
  data: CVData
  templateId?: string
  language?: string
  history: CVVersionSnapshot[]
}

export function saveCV(data: CVData): void {
  try {
    // Strip photo from main data — stored separately to keep data lean
    const { photo: _photo, ...rest } = data
    localStorage.setItem(CV_KEY, JSON.stringify(rest))
  } catch (e) {
    console.error('localStorage save error', e)
  }
}

export function loadCV(): CVData | null {
  try {
    const raw = localStorage.getItem(CV_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearCV(): void {
  localStorage.removeItem(CV_KEY)
}

export function saveTemplate(id: string): void {
  try {
    localStorage.setItem(TEMPLATE_KEY, id)
  } catch {}
}

export function loadTemplate(): string {
  try {
    return localStorage.getItem(TEMPLATE_KEY) ?? 'classic'
  } catch {
    return 'classic'
  }
}

export function savePhoto(dataUrl: string | null): void {
  try {
    if (dataUrl) localStorage.setItem(PHOTO_KEY, dataUrl)
    else localStorage.removeItem(PHOTO_KEY)
  } catch {}
}

export function loadPhoto(): string | null {
  try {
    return localStorage.getItem(PHOTO_KEY)
  } catch {
    return null
  }
}

export function saveShowPhoto(val: boolean): void {
  try { localStorage.setItem(SHOW_PHOTO_KEY, JSON.stringify(val)) } catch {}
}

export function loadShowPhoto(): boolean {
  try {
    const raw = localStorage.getItem(SHOW_PHOTO_KEY)
    return raw === null ? true : (JSON.parse(raw) as boolean)
  } catch { return true }
}

export function loadVersions(): CVVersion[] {
  try {
    const raw = localStorage.getItem(VERSIONS_KEY)
    return raw ? (JSON.parse(raw) as CVVersion[]) : []
  } catch { return [] }
}

export function saveVersion(name: string, data: CVData, templateId?: string, language?: string): CVVersion {
  const version: CVVersion = {
    id: Date.now().toString(),
    name: name.trim() || `Version du ${new Date().toLocaleDateString('fr-FR')}`,
    savedAt: new Date().toISOString(),
    data,
    templateId,
    language,
    history: [],
  }
  try {
    const existing = loadVersions()
    const updated = [version, ...existing].slice(0, MAX_VERSIONS)
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated))
  } catch {}
  return version
}

export function upsertVersion(name: string, data: CVData, templateId?: string, language?: string): CVVersion {
  const existing = loadVersions()
  const idx = language != null ? existing.findIndex(v => v.language === language) : -1

  if (idx >= 0) {
    const old = existing[idx]
    const snapshot: CVVersionSnapshot = { savedAt: old.savedAt, data: old.data }
    const updated: CVVersion = {
      ...old,
      name: name.trim() || old.name,
      savedAt: new Date().toISOString(),
      data,
      templateId: templateId ?? old.templateId,
      history: [snapshot, ...(old.history ?? [])].slice(0, 20),
    }
    existing[idx] = updated
    try { localStorage.setItem(VERSIONS_KEY, JSON.stringify(existing)) } catch {}
    return updated
  }

  // First save for this language — create
  const version: CVVersion = {
    id: Date.now().toString(),
    name: name.trim() || `Version du ${new Date().toLocaleDateString('fr-FR')}`,
    savedAt: new Date().toISOString(),
    data,
    templateId,
    language,
    history: [],
  }
  try {
    const updated = [version, ...existing].slice(0, MAX_VERSIONS)
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated))
  } catch {}
  return version
}

export function deleteVersion(id: string): void {
  try {
    const updated = loadVersions().filter(v => v.id !== id)
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(updated))
  } catch {}
}

export function encodeCVToURL(data: CVData): string {
  const { photo: _photo, ...rest } = data
  return btoa(unescape(encodeURIComponent(JSON.stringify(rest))))
}

export function decodeCVFromURL(encoded: string): CVData | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))))
  } catch {
    return null
  }
}
