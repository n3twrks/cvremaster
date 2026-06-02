'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCVStore } from '@/hooks/useCVStore'
import { loadProjects, createProject } from '@/lib/projectStorage'
import { saveCV } from '@/lib/cvStorage'
import { decodeCVFromURL } from '@/lib/cvStorage'
import Toolbar from '@/components/Toolbar'
import LeftSidebar from '@/components/LeftSidebar'
import CenterPanel from '@/components/CenterPanel'
import Sidebar from '@/components/Sidebar'

function CVEditor() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const projectId = searchParams.get('project') ?? ''
  const sharedCVParam = searchParams.get('cv')

  const project = useMemo(
    () => (projectId ? (loadProjects().find(p => p.id === projectId) ?? null) : null),
    [projectId]
  )

  useEffect(() => {
    // Handle legacy shared link (?cv=xxx without ?project=)
    if (!projectId && sharedCVParam) {
      const decoded = decodeCVFromURL(sharedCVParam)
      if (decoded) {
        const p = createProject(decoded.name || 'CV partagé')
        saveCV(decoded, p.id)
        router.replace(`/cv?project=${p.id}`)
        return
      }
    }
    if (!projectId) { router.replace('/dashboard'); return }
    if (!project) { router.replace('/dashboard?error=not-found') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, sharedCVParam, project])

  const store = useCVStore(projectId)

  if (!project) return null

  return (
    <main className="flex flex-col h-screen bg-[#FAFAF8] overflow-hidden">

      <header className="flex items-center justify-between px-5 h-14 bg-[#FAFAF8] border-b border-[#E5E4E0] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs font-body text-[#9D9C98] hover:text-[#1A1A18] transition-colors shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </Link>
          <span className="text-[#CCCBC6] text-xs shrink-0">/</span>
          <span className="font-display text-sm text-[#1A1A18] truncate">{project.name}</span>
        </div>
      </header>

      <Toolbar
        cvData={store.cvData}
        onUpdateCV={store.updateCV}
        addMessage={store.addMessage}
        setIsLoading={store.setIsLoading}
        versions={store.versions}
        createVersion={store.createVersion}
        upsertVersion={store.upsertVersion}
        restoreVersion={store.restoreVersion}
        removeVersion={store.removeVersion}
        activeLanguage={store.activeLanguage}
        setActiveLanguage={store.setActiveLanguage}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">

        <LeftSidebar
          cvData={store.rawCvData}
          photo={store.photo}
          showPhoto={store.showPhoto}
          showSummary={store.showSummary}
          hiddenBullets={store.hiddenBullets}
          activeTemplateId={store.activeTemplateId}
          onUpdateCV={store.updateCV}
          onSetPhoto={store.setPhoto}
          onSetShowPhoto={store.setShowPhoto}
          onSetShowSummary={store.setShowSummary}
          showHobbies={store.showHobbies}
          onSetShowHobbies={store.setShowHobbies}
          onToggleHiddenBullet={store.toggleHiddenBullet}
          spacingScale={store.spacingScale}
          onSetSpacingScale={store.setSpacingScale}
          onSetTemplate={store.setTemplate}
        />

        <CenterPanel cvData={store.cvData} templateId={store.activeTemplateId} language={store.activeLanguage} spacingScale={store.spacingScale} />

        <Sidebar
          key={projectId}
          messages={store.messages}
          isLoading={store.isLoading}
          cvData={store.cvData}
          projectId={projectId}
          onUpdateCV={store.updateCV}
          addMessage={store.addMessage}
          setIsLoading={store.setIsLoading}
        />
      </div>
    </main>
  )
}

export default function CVPage() {
  return (
    <Suspense fallback={null}>
      <CVEditor />
    </Suspense>
  )
}
