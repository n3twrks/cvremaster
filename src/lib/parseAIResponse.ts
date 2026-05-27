import { CVData } from '@/types/cv'

/** Convert an array that may contain objects or strings into a string[] */
function toStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr.map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) {
      // e.g. {language: "French", proficiency: "Native"} → "French — Native"
      // e.g. {name: "React"} → "React"
      return Object.values(item as Record<string, unknown>)
        .filter(v => typeof v === 'string')
        .join(' — ')
    }
    return String(item)
  })
}

/** Normalise a raw parsed object so it always matches CVData types */
function normaliseCVData(raw: Record<string, unknown>): CVData {
  const experience = Array.isArray(raw.experience)
    ? raw.experience.map((exp: Record<string, unknown>) => ({
        title: String(exp.title ?? ''),
        company: String(exp.company ?? ''),
        location: exp.location ? String(exp.location) : undefined,
        date: String(exp.date ?? ''),
        bullets: toStringArray(exp.bullets),
      }))
    : []

  const education = Array.isArray(raw.education)
    ? raw.education.map((edu: Record<string, unknown>) => ({
        school: String(edu.school ?? ''),
        degree: String(edu.degree ?? ''),
        date: String(edu.date ?? ''),
      }))
    : []

  return {
    name: String(raw.name ?? ''),
    tagline: String(raw.tagline ?? ''),
    contact: toStringArray(raw.contact),
    summary: String(raw.summary ?? ''),
    experience,
    education,
    skills: toStringArray(raw.skills),
    languages: toStringArray(raw.languages),
    hobbies: toStringArray(raw.hobbies).length ? toStringArray(raw.hobbies) : undefined,
    photo: typeof raw.photo === 'string' ? raw.photo : undefined,
  }
}

export { normaliseCVData }

/** Strip optional markdown code fences and parse JSON robustly */
export function parseJSONResponse(raw: string): CVData {
  let cleaned = raw.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  const parsed = JSON.parse(cleaned) as Record<string, unknown>
  return normaliseCVData(parsed)
}

/** Extract JSON_UPDATE payload and parse it, handling code fences */
export function extractJSONUpdate(result: string): CVData | null {
  if (!result.startsWith('JSON_UPDATE:')) return null
  const raw = result.slice('JSON_UPDATE:'.length).trim()
  return parseJSONResponse(raw)
}
