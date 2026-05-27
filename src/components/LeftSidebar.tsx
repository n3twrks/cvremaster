'use client'

import { useState } from 'react'
import { CVData } from '@/types/cv'
import DataEditor from './DataEditor'
import TemplateGallery from './TemplateGallery'

type Tab = 'donnees' | 'templates'

interface Props {
  cvData: CVData | null
  photo: string | null
  activeTemplateId: string
  onUpdateCV: (data: CVData) => void
  onSetPhoto: (dataUrl: string | null) => void
  onSetTemplate: (id: string) => void
}

export default function LeftSidebar({
  cvData,
  photo,
  activeTemplateId,
  onUpdateCV,
  onSetPhoto,
  onSetTemplate,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('donnees')

  return (
    <aside className="!w-[400px] shrink-0 flex flex-col bg-[#FAFAF8] border-r border-[#E5E4E0] h-full">
      {/* Tab bar */}
      <div className="px-4 py-3 border-b border-[#E5E4E0]">
        <div className="flex gap-1">
          {(['donnees', 'templates'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-md text-sm font-body font-medium transition-colors duration-150 ${
                activeTab === tab
                  ? 'bg-[#1B4332] text-[#FAFAF8]'
                  : 'text-[#6B6A66] hover:text-[#1A1A18] hover:bg-[#F4F3F0]'
              }`}
            >
              {tab === 'donnees' ? 'Données' : 'Templates'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'donnees' ? (
          <DataEditor
            cvData={cvData}
            onUpdateCV={onUpdateCV}
            photo={photo}
            onSetPhoto={onSetPhoto}
          />
        ) : (
          <TemplateGallery
            activeTemplateId={activeTemplateId}
            onSelect={onSetTemplate}
          />
        )}
      </div>
    </aside>
  )
}
