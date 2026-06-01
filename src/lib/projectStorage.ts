const PROJECTS_KEY = 'cvremaster_projects'

export interface CVProject {
  id: string
  name: string
  createdAt: string
  lastModified: string
  templateId: string
  language: string
  tagline?: string
}

const PROJECT_SCOPED_SUFFIXES = ['data', 'photo', 'template', 'show_photo', 'versions', 'language', 'analysis', 'context']

export function loadProjects(): CVProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    return raw ? (JSON.parse(raw) as CVProject[]) : []
  } catch { return [] }
}

export function saveProjects(projects: CVProject[]): void {
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)) } catch {}
}

export function createProject(name: string): CVProject {
  const id = `cv_${Date.now()}`
  const project: CVProject = {
    id,
    name: name.trim() || 'Mon CV',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    templateId: 'classic',
    language: 'fr',
  }
  saveProjects([...loadProjects(), project])
  return project
}

export function updateProjectMeta(id: string, patch: Partial<Omit<CVProject, 'id' | 'createdAt'>>): void {
  const projects = loadProjects()
  const idx = projects.findIndex(p => p.id === id)
  if (idx < 0) return
  projects[idx] = { ...projects[idx], ...patch, lastModified: new Date().toISOString() }
  saveProjects(projects)
}

export function deleteProject(id: string): void {
  PROJECT_SCOPED_SUFFIXES.forEach(suffix => {
    try { localStorage.removeItem(`cvremaster_${suffix}_${id}`) } catch {}
  })
  saveProjects(loadProjects().filter(p => p.id !== id))
}

export function duplicateProject(sourceId: string, newName: string): CVProject {
  const newId = `cv_${Date.now()}`
  PROJECT_SCOPED_SUFFIXES.forEach(suffix => {
    try {
      const val = localStorage.getItem(`cvremaster_${suffix}_${sourceId}`)
      if (val !== null) localStorage.setItem(`cvremaster_${suffix}_${newId}`, val)
    } catch {}
  })
  const source = loadProjects().find(p => p.id === sourceId)
  const newProject: CVProject = {
    id: newId,
    name: newName.trim() || `${source?.name ?? 'CV'} (copie)`,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    templateId: source?.templateId ?? 'classic',
    language: source?.language ?? 'fr',
    tagline: source?.tagline,
  }
  saveProjects([...loadProjects(), newProject])
  return newProject
}

// Runs once: migrate legacy non-scoped keys into a new project
export function migrateLegacyData(): CVProject | null {
  try {
    const legacyData = localStorage.getItem('cvremaster_data')
    if (!legacyData) return null

    const project = createProject('Mon CV')

    const legacyMap: Record<string, string> = {
      cvremaster_data: `cvremaster_data_${project.id}`,
      cvremaster_photo: `cvremaster_photo_${project.id}`,
      cvremaster_template: `cvremaster_template_${project.id}`,
      cvremaster_show_photo: `cvremaster_show_photo_${project.id}`,
      cvremaster_versions: `cvremaster_versions_${project.id}`,
      cvremaster_language: `cvremaster_language_${project.id}`,
      cvremaster_analysis: `cvremaster_analysis_${project.id}`,
    }

    Object.entries(legacyMap).forEach(([oldKey, newKey]) => {
      try {
        const val = localStorage.getItem(oldKey)
        if (val !== null) {
          localStorage.setItem(newKey, val)
          localStorage.removeItem(oldKey)
        }
      } catch {}
    })

    return project
  } catch {
    return null
  }
}
