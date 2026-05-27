'use client'

import { useState } from 'react'
import { CVData, Message } from '@/types/cv'
import TemplateRenderer from './TemplateRenderer'
import DataEditor from './DataEditor'
import TemplateGallery from './TemplateGallery'

type Tab = 'apercu' | 'donnees' | 'templates'

interface Props {
  cvData: CVData | null
  photo: string | null
  activeTemplateId: string
  onUpdateCV: (data: CVData) => void
  onSetPhoto: (dataUrl: string | null) => void
  onSetTemplate: (id: string) => void
  addMessage: (role: Message['role'], content: string) => void
}

export default function MainPanel({
  cvData,
  photo,
  activeTemplateId,
  onUpdateCV,
  onSetPhoto,
  onSetTemplate,
  addMessage: _addMessage,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('apercu')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'apercu', label: 'Aperçu' },
    { id: 'donnees', label: 'Données' },
    { id: 'templates', label: 'Templates' },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2 bg-[#FAFAF8] border-b border-[#E5E4E0]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-colors duration-150 ${
              activeTab === tab.id
                ? 'bg-[#1B4332] text-[#FAFAF8]'
                : 'text-[#6B6A66] hover:text-[#1A1A18] hover:bg-[#F4F3F0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
        {activeTab === 'apercu' && cvData && (
          <span className="ml-auto text-xs font-body text-[#9D9C98] truncate">
            {activeTemplateId === 'classic' ? 'Classic' : activeTemplateId.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
          </span>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'apercu' && (
          <div className="flex-1 overflow-auto bg-[#F4F3F0] p-6 print:p-0 print:bg-white">
            {cvData ? (
              <TemplateRenderer cvData={cvData} templateId={activeTemplateId} />
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
        )}

        {activeTab === 'donnees' && (
          <DataEditor
            cvData={cvData}
            onUpdateCV={onUpdateCV}
            photo={photo}
            onSetPhoto={onSetPhoto}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateGallery
            activeTemplateId={activeTemplateId}
            onSelect={(id) => {
              onSetTemplate(id)
              setActiveTab('apercu')
            }}
          />
        )}
      </div>
    </div>
  )
}
