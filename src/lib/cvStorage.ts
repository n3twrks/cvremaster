import { CVData } from '@/types/cv'

const MAX_VERSIONS = 20

function k(base: string, projectId?: string) {
  return projectId ? `${base}_${projectId}` : base
}

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

export function saveCV(data: CVData, projectId?: string): void {
  try {
    const { photo: _photo, ...rest } = data
    localStorage.setItem(k('cvremaster_data', projectId), JSON.stringify(rest))
  } catch (e) {
    console.error('localStorage save error', e)
  }
}

export function loadCV(projectId?: string): CVData | null {
  try {
    const raw = localStorage.getItem(k('cvremaster_data', projectId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearCV(projectId?: string): void {
  localStorage.removeItem(k('cvremaster_data', projectId))
}

export function saveTemplate(id: string, projectId?: string): void {
  try {
    localStorage.setItem(k('cvremaster_template', projectId), id)
  } catch {}
}

export function loadTemplate(projectId?: string): string {
  try {
    return localStorage.getItem(k('cvremaster_template', projectId)) ?? 'classic'
  } catch {
    return 'classic'
  }
}

export function savePhoto(dataUrl: string | null, projectId?: string): void {
  try {
    const key = k('cvremaster_photo', projectId)
    if (dataUrl) localStorage.setItem(key, dataUrl)
    else localStorage.removeItem(key)
  } catch {}
}

export function loadPhoto(projectId?: string): string | null {
  try {
    return localStorage.getItem(k('cvremaster_photo', projectId))
  } catch {
    return null
  }
}

export function saveShowPhoto(val: boolean, projectId?: string): void {
  try { localStorage.setItem(k('cvremaster_show_photo', projectId), JSON.stringify(val)) } catch {}
}

export function loadShowPhoto(projectId?: string): boolean {
  try {
    const raw = localStorage.getItem(k('cvremaster_show_photo', projectId))
    return raw === null ? true : (JSON.parse(raw) as boolean)
  } catch { return true }
}

export function saveSpacingScale(val: number, projectId?: string): void {
  try { localStorage.setItem(k('cvremaster_spacing_scale', projectId), JSON.stringify(val)) } catch {}
}

export function loadSpacingScale(projectId?: string): number {
  try {
    const raw = localStorage.getItem(k('cvremaster_spacing_scale', projectId))
    return raw === null ? 1 : (JSON.parse(raw) as number)
  } catch { return 1 }
}

export function saveShowHobbies(val: boolean, projectId?: string): void {
  try { localStorage.setItem(k('cvremaster_show_hobbies', projectId), JSON.stringify(val)) } catch {}
}

export function loadShowHobbies(projectId?: string): boolean {
  try {
    const raw = localStorage.getItem(k('cvremaster_show_hobbies', projectId))
    return raw === null ? true : (JSON.parse(raw) as boolean)
  } catch { return true }
}

export function saveShowSummary(val: boolean, projectId?: string): void {
  try { localStorage.setItem(k('cvremaster_show_summary', projectId), JSON.stringify(val)) } catch {}
}

export function loadShowSummary(projectId?: string): boolean {
  try {
    const raw = localStorage.getItem(k('cvremaster_show_summary', projectId))
    return raw === null ? true : (JSON.parse(raw) as boolean)
  } catch { return true }
}

export function saveHiddenBullets(hidden: string[], projectId?: string): void {
  try { localStorage.setItem(k('cvremaster_hidden_bullets', projectId), JSON.stringify(hidden)) } catch {}
}

export function loadHiddenBullets(projectId?: string): string[] {
  try {
    const raw = localStorage.getItem(k('cvremaster_hidden_bullets', projectId))
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch { return [] }
}

export function loadVersions(projectId?: string): CVVersion[] {
  try {
    const raw = localStorage.getItem(k('cvremaster_versions', projectId))
    return raw ? (JSON.parse(raw) as CVVersion[]) : []
  } catch { return [] }
}

export function saveVersion(name: string, data: CVData, templateId?: string, language?: string, projectId?: string): CVVersion {
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
    const existing = loadVersions(projectId)
    const updated = [version, ...existing].slice(0, MAX_VERSIONS)
    localStorage.setItem(k('cvremaster_versions', projectId), JSON.stringify(updated))
  } catch {}
  return version
}

export function upsertVersion(name: string, data: CVData, templateId?: string, language?: string, projectId?: string): CVVersion {
  const existing = loadVersions(projectId)
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
    try { localStorage.setItem(k('cvremaster_versions', projectId), JSON.stringify(existing)) } catch {}
    return updated
  }

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
    localStorage.setItem(k('cvremaster_versions', projectId), JSON.stringify(updated))
  } catch {}
  return version
}

export function deleteVersion(id: string, projectId?: string): void {
  try {
    const updated = loadVersions(projectId).filter(v => v.id !== id)
    localStorage.setItem(k('cvremaster_versions', projectId), JSON.stringify(updated))
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
