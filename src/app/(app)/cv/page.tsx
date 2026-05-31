'use client'

import { useCVStore } from '@/hooks/useCVStore'
import Toolbar from '@/components/Toolbar'
import LeftSidebar from '@/components/LeftSidebar'
import CenterPanel from '@/components/CenterPanel'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const store = useCVStore()

  return (
    <main className="flex flex-col h-screen bg-[#FAFAF8] overflow-hidden">

      {/* Top header — logo + future user menu */}
      <header className="flex items-center justify-between px-5 h-14 bg-[#FAFAF8] border-b border-[#E5E4E0] shrink-0">
        <span className="font-display text-lg text-[#1A1A18]">CVRemaster</span>
      </header>

      {/* Action sub-bar — full width, thinner */}
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

      {/* Three-column body */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left: Données / Templates */}
        <LeftSidebar
          cvData={store.cvData}
          photo={store.photo}
          showPhoto={store.showPhoto}
          activeTemplateId={store.activeTemplateId}
          onUpdateCV={store.updateCV}
          onSetPhoto={store.setPhoto}
          onSetShowPhoto={store.setShowPhoto}
          onSetTemplate={store.setTemplate}
        />

        {/* Center: CV preview */}
        <CenterPanel cvData={store.cvData} templateId={store.activeTemplateId} language={store.activeLanguage} />

        {/* Right: Chat / Analyser */}
        <Sidebar
          messages={store.messages}
          isLoading={store.isLoading}
          cvData={store.cvData}
          onUpdateCV={store.updateCV}
          addMessage={store.addMessage}
          setIsLoading={store.setIsLoading}
        />
      </div>
    </main>
  )
}
