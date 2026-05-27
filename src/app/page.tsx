'use client'

import { useCVStore } from '@/hooks/useCVStore'
import Toolbar from '@/components/Toolbar'
import LeftSidebar from '@/components/LeftSidebar'
import TemplateRenderer from '@/components/TemplateRenderer'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  const store = useCVStore()

  return (
    <main className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      {/* Left: Données / Templates */}
      <LeftSidebar
        cvData={store.cvData}
        photo={store.photo}
        activeTemplateId={store.activeTemplateId}
        onUpdateCV={store.updateCV}
        onSetPhoto={store.setPhoto}
        onSetTemplate={store.setTemplate}
      />

      {/* Center: Toolbar + CV preview */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Toolbar
          cvData={store.cvData}
          onUpdateCV={store.updateCV}
          addMessage={store.addMessage}
          setIsLoading={store.setIsLoading}
        />
        <div className="flex-1 overflow-auto bg-[#F4F3F0] p-6 print:p-0 print:bg-white">
          {store.cvData ? (
            <TemplateRenderer cvData={store.cvData} templateId={store.activeTemplateId} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-lg bg-[#F4F3F0] border border-[#E5E4E0] flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[#9D9C98]">
                    <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="10" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="18" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[#6B6A66] text-sm font-body">Importez votre CV PDF ou commencez à chatter</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Chat / Analyser */}
      <Sidebar
        messages={store.messages}
        isLoading={store.isLoading}
        cvData={store.cvData}
        onUpdateCV={store.updateCV}
        addMessage={store.addMessage}
        setIsLoading={store.setIsLoading}
      />
    </main>
  )
}
