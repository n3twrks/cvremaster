import { CVData } from '@/types/cv'

/** Convert an array that may contain objects or strings into a string[] */
function toStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr.map(item => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) {
      return Object.values(item as Record<string, unknown>)
        .filter(v => typeof v === 'string')
        .join(' — ')
    }
    return String(item)
  })
}

/** Normalise a raw parsed object so it always matches CVData types */
export function normaliseCVData(raw: Record<string, unknown>): CVData {
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

/** Strip optional markdown code fences and parse JSON robustly.
 *  Handles: plain JSON, ```json...```, preamble text before the block,
 *  and raw {...} objects embedded anywhere in the response. */
export function parseJSONResponse(raw: string): CVData {
  let text = raw.trim()

  // 1. Extract JSON from inside a code fence (anywhere in the response)
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  if (fenceMatch) {
    text = fenceMatch[1].trim()
  }

  // 2. Try direct parse
  try {
    return normaliseCVData(JSON.parse(text) as Record<string, unknown>)
  } catch { /* fall through */ }

  // 3. Extract first {...} block (handles "Here is the JSON: {...}")
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    return normaliseCVData(JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>)
  }

  throw new Error('No valid JSON found in AI response')
}

/** Extract JSON_UPDATE payload — returns null if missing or malformed */
export function extractJSONUpdate(result: string): CVData | null {
  if (!result.startsWith('JSON_UPDATE:')) return null
  try {
    const raw = result.slice('JSON_UPDATE:'.length).trim()
    return parseJSONResponse(raw)
  } catch {
    return null
  }
}

/* ── PATCH_UPDATE ── */

export interface PatchOp {
  path: string   // e.g. "summary", "experience.0.title", "experience.0.bullets.1"
  value: unknown
}

/** Extract PATCH_UPDATE payload — returns null if missing or malformed */
export function extractPatchUpdate(result: string): PatchOp[] | null {
  if (!result.startsWith('PATCH_UPDATE:')) return null
  try {
    const raw = result.slice('PATCH_UPDATE:'.length).trim()
    const patches = JSON.parse(raw)
    if (!Array.isArray(patches)) return null
    return patches as PatchOp[]
  } catch {
    return null
  }
}

/** Recursively set a value at a dot-separated path on a plain object/array */
function setAt(target: unknown, keys: string[], value: unknown): unknown {
  if (keys.length === 0) return value

  const [head, ...rest] = keys

  if (Array.isArray(target)) {
    const idx = Number(head)
    const copy = [...target]
    copy[idx] = setAt(copy[idx], rest, value)
    return copy
  }

  const obj = (typeof target === 'object' && target !== null ? target : {}) as Record<string, unknown>
  return { ...obj, [head]: setAt(obj[head], rest, value) }
}

/** Apply a list of patch ops to cvData and return the normalised result */
export function applyPatch(cvData: CVData, patches: PatchOp[]): CVData {
  let raw = cvData as unknown as Record<string, unknown>
  for (const { path, value } of patches) {
    raw = setAt(raw, path.split('.'), value) as Record<string, unknown>
  }
  return normaliseCVData(raw)
}
