import { CVData } from '@/types/cv'

const CV_KEY = 'cvremaster_data'
const TEMPLATE_KEY = 'cvremaster_template'
const PHOTO_KEY = 'cvremaster_photo'

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
