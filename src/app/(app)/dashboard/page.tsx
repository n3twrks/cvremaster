'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  CVProject,
  loadProjects,
  createProject,
  updateProjectMeta,
  deleteProject,
  duplicateProject,
  migrateLegacyData,
} from '@/lib/projectStorage'
import { saveCV } from '@/lib/cvStorage'
import { parseJSONResponse } from '@/lib/parseAIResponse'
import { extractTextFromPDF } from '@/lib/pdfParser'
import ProjectCard from '@/components/dashboard/ProjectCard'
import NewProjectModal from '@/components/dashboard/NewProjectModal'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Run migration once at first render and capture the name
  const [migratedName] = useState<string | null>(() => migrateLegacyData()?.name ?? null)
  const [projects, setProjects] = useState<CVProject[]>(loadProjects)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  // Derive initial toast from URL params + migration — no need for an effect
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(() => {
    if (searchParams.get('error') === 'not-found') return { msg: 'Projet introuvable', type: 'error' }
    if (migratedName) return { msg: `Données migrées vers le projet "${migratedName}"`, type: 'success' }
    return null
  })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(msg: string, type: 'error' | 'success' = 'success') {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  // Auto-dismiss initial toast + clean URL — only router.replace here (not setState)
  useEffect(() => {
    if (toast) toastTimer.current = setTimeout(() => setToast(null), 3500)
    if (searchParams.get('error') === 'not-found') router.replace('/dashboard')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate(name: string, pdfFile?: File) {
    setCreating(true)
    try {
      const project = createProject(name)

      if (pdfFile) {
        const text = await extractTextFromPDF(pdfFile)
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: 'Tu es un expert en parsing de CV. Analyse le texte et retourne UNIQUEMENT un objet JSON valide sans aucun texte avant ou après, sans backticks markdown. Structure : { name, tagline, contact[], summary, experience[{title, company, location, date, bullets[]}], education[{school, degree, date}], skills[], languages[], hobbies[] }',
            user: `Voici le texte extrait du CV :\n\n${text}`,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur API')
        const cvData = parseJSONResponse(data.result)
        saveCV(cvData, project.id)
        updateProjectMeta(project.id, { tagline: cvData.tagline })
      }

      setShowModal(false)
      router.push(`/cv?project=${project.id}`)
    } catch (err) {
      showToast(`Erreur : ${err instanceof Error ? err.message : 'inconnu'}`, 'error')
      setCreating(false)
    }
  }

  function handleRename(id: string, name: string) {
    updateProjectMeta(id, { name })
    setProjects(loadProjects())
  }

  function handleDuplicate(id: string) {
    const source = projects.find(p => p.id === id)
    const newName = `${source?.name ?? 'CV'} (copie)`
    duplicateProject(id, newName)
    setProjects(loadProjects())
    showToast(`"${newName}" créé`)
  }

  function handleDelete(id: string) {
    deleteProject(id)
    setProjects(loadProjects())
  }

  return (
    <main className="flex flex-col h-screen bg-[#FAFAF8] overflow-hidden">

      <header className="flex items-center justify-between px-6 h-14 bg-[#FAFAF8] border-b border-[#E5E4E0] shrink-0">
        <span className="font-display text-lg text-[#1A1A18]">CVRemaster</span>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B4332] text-[#FAFAF8] text-sm font-body font-medium hover:bg-[#163A2B] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Nouveau CV
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">

        {projects.length === 0 ? (
          <EmptyState onNew={() => setShowModal(true)} />
        ) : (
          <>
            <p className="text-xs font-body font-medium text-[#9D9C98] uppercase tracking-widest mb-4">
              Mes CVs ({projects.length})
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {projects
                .slice()
                .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                .map(p => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onRename={handleRename}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => { setShowModal(false); setCreating(false) }}
          onCreate={handleCreate}
          creating={creating}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-body font-medium pointer-events-none transition-all ${
            toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-[#D8EDDF] border border-[#A7D9B8] text-[#1B4332]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </main>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#F4F3F0] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="2" width="20" height="24" rx="2.5" stroke="#9D9C98" strokeWidth="1.6" />
          <path d="M9 9h10M9 13h10M9 17h6" stroke="#9D9C98" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-body font-medium text-[#1A1A18] mb-1">Aucun CV pour l&apos;instant</p>
        <p className="text-xs font-body text-[#9D9C98]">Créez votre premier projet pour commencer</p>
      </div>
      <button
        onClick={onNew}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B4332] text-[#FAFAF8] text-sm font-body font-medium hover:bg-[#163A2B] transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Créer un CV
      </button>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}
