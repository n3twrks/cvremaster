import { CVAnalysis } from '@/types/cv'

function key(projectId?: string) {
  return projectId ? `cvremaster_analysis_${projectId}` : 'cvremaster_analysis'
}

export function saveAnalysis(a: CVAnalysis, projectId?: string): void {
  try { localStorage.setItem(key(projectId), JSON.stringify(a)) } catch { /* noop */ }
}

export function loadAnalysis(projectId?: string): CVAnalysis | null {
  try {
    const raw = localStorage.getItem(key(projectId))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function clearAnalysis(projectId?: string): void {
  localStorage.removeItem(key(projectId))
}
