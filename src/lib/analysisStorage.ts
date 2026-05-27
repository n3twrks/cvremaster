import { CVAnalysis } from '@/types/cv'

const KEY = 'cvremaster_analysis'

export function saveAnalysis(a: CVAnalysis): void {
  try { localStorage.setItem(KEY, JSON.stringify(a)) } catch { /* noop */ }
}

export function loadAnalysis(): CVAnalysis | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearAnalysis(): void {
  localStorage.removeItem(KEY)
}
