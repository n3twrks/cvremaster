'use client'

import { TEMPLATES } from '@/templates/index'

interface Props {
  activeTemplateId: string
  onSelect: (id: string) => void
}

export default function TemplateGallery({ activeTemplateId, onSelect }: Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F3F0] p-6">
      <p className="text-xs font-body text-[#6B6A66] mb-4">
        Choisissez un template — votre CV s&apos;adapte instantanément dans l&apos;onglet Aperçu.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`text-left rounded-xl border-2 bg-white overflow-hidden transition-all duration-150 hover:shadow-md ${
              activeTemplateId === t.id
                ? 'border-[#1B4332] shadow-md'
                : 'border-[#E5E4E0] hover:border-[#CCCBC6]'
            }`}
          >
            {/* Schematic thumbnail */}
            <div className="h-[120px] overflow-hidden">
              <Thumbnail id={t.id} />
            </div>

            {/* Info */}
            <div className="px-3 py-2.5 border-t border-[#F4F3F0]">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-body font-semibold text-[#1A1A18]">{t.name}</span>
                {activeTemplateId === t.id && (
                  <span className="text-[10px] font-body font-medium text-[#1B4332] bg-[#D8EDDF] px-1.5 py-0.5 rounded">
                    Actif
                  </span>
                )}
              </div>
              <p className="text-[11px] font-body text-[#6B6A66] leading-snug">{t.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Thumbnail({ id }: { id: string }) {
  switch (id) {
    case 'classic':
      return (
        <div className="w-full h-full bg-white p-3 flex flex-col gap-1.5">
          <div className="w-24 h-3 bg-[#1A1A18] rounded-sm" />
          <div className="w-16 h-2 bg-[#E5E4E0] rounded-sm" />
          <div className="border-t border-[#E5E4E0] my-1" />
          <div className="w-10 h-1.5 bg-[#1B4332] rounded-sm mb-1" />
          <div className="space-y-1">
            {[90, 75, 80].map((w, i) => <div key={i} className="h-1.5 bg-[#F4F3F0] rounded-sm" style={{ width: `${w}%` }} />)}
          </div>
          <div className="border-t border-[#E5E4E0] my-1" />
          <div className="w-10 h-1.5 bg-[#1B4332] rounded-sm mb-1" />
          {[100, 85, 70, 90].map((w, i) => <div key={i} className="h-1.5 bg-[#F4F3F0] rounded-sm" style={{ width: `${w}%` }} />)}
        </div>
      )
    case 'sidebar-dark':
      return (
        <div className="w-full h-full flex">
          <div className="w-[30%] bg-[#3C3C3C] flex flex-col">
            <div className="w-full aspect-square bg-[#555]" />
            <div className="p-2 space-y-1.5 flex-1">
              {[80, 60, 90].map((w, i) => <div key={i} className="h-1 bg-[#666] rounded-sm" style={{ width: `${w}%` }} />)}
              <div className="border-t border-[#555] my-1" />
              {[70, 85, 60].map((w, i) => <div key={i} className="h-1 bg-[#555] rounded-sm" style={{ width: `${w}%` }} />)}
            </div>
          </div>
          <div className="flex-1 bg-white p-2 space-y-1.5">
            <div className="w-20 h-3 bg-[#444] rounded-sm" />
            <div className="border-t border-[#DDD] my-1" />
            {[95, 80, 75, 90].map((w, i) => <div key={i} className="h-1.5 bg-[#F0F0F0] rounded-sm" style={{ width: `${w}%` }} />)}
            <div className="border-t border-[#DDD] my-1" />
            {[70, 85].map((w, i) => <div key={i} className="h-1.5 bg-[#F0F0F0] rounded-sm" style={{ width: `${w}%` }} />)}
          </div>
        </div>
      )
    case 'teal-horizontal':
      return (
        <div className="w-full h-full bg-white flex flex-col">
          <div className="flex items-center gap-2 p-2 border-b-2 border-[#3DBDB3]">
            <div className="w-10 h-10 bg-[#3DBDB3] opacity-30 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="w-20 h-2.5 bg-[#333] rounded-sm" />
              <div className="w-14 h-1.5 bg-[#3DBDB3] rounded-sm" />
              <div className="w-28 h-1 bg-[#E5E4E0] rounded-sm" />
            </div>
          </div>
          {[['Personal Summary', 90], ['Work Experience', 100], ['Education', 70]].map(([, w], i) => (
            <div key={i} className="flex border-b border-[#EEE] px-2 py-1.5">
              <div className="w-16 shrink-0">
                <div className="h-1.5 bg-[#3DBDB3] rounded-sm w-full" />
              </div>
              <div className="flex-1 space-y-1 pl-2">
                <div className="h-1.5 bg-[#F0F0F0] rounded-sm" style={{ width: `${w}%` }} />
              </div>
            </div>
          ))}
        </div>
      )
    case 'teal-sidebar':
      return (
        <div className="w-full h-full flex">
          <div className="w-[30%] bg-[#FAFAFA] border-r-2 border-[#3DBDB3] p-2 space-y-1.5">
            <div className="w-full aspect-square bg-[#EEE] border border-[#3DBDB3]" />
            {[80, 60, 90, 70].map((w, i) => <div key={i} className="h-1 bg-[#DDD] rounded-sm" style={{ width: `${w}%` }} />)}
          </div>
          <div className="flex-1 bg-white p-2 space-y-1.5">
            <div className="w-20 h-3 bg-[#333] rounded-sm" />
            <div className="w-14 h-1.5 bg-[#3DBDB3] rounded-sm" />
            <div className="border-l-2 border-[#3DBDB3] pl-2 space-y-1 mt-1">
              {[90, 75, 80, 70].map((w, i) => <div key={i} className="h-1.5 bg-[#F0F0F0] rounded-sm" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        </div>
      )
    case 'navy-dark':
      return (
        <div className="w-full h-full flex">
          <div className="w-[30%] bg-[#2B3547] p-2 flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#3D4F68]" />
            <div className="w-full space-y-1">
              {[80, 60, 90, 70].map((w, i) => <div key={i} className="h-1 bg-[#3D4F68] rounded-sm" style={{ width: `${w}%` }} />)}
            </div>
          </div>
          <div className="flex-1 bg-white p-2 space-y-1.5">
            <div className="w-20 h-3 bg-[#2B3547] rounded-sm" />
            <div className="w-28 h-1.5 bg-[#F0F0F0] rounded-sm" />
            <div className="border-t border-[#DDD] my-1" />
            {[95, 80, 75, 90, 70].map((w, i) => (
              <div key={i} className="flex items-start gap-1">
                <div className="w-2 h-2 rounded-full border border-[#2B3547] shrink-0 mt-0.5" />
                <div className="h-1.5 bg-[#F0F0F0] rounded-sm flex-1" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'pastel-sidebar':
      return (
        <div className="w-full h-full flex">
          <div className="w-[30%] bg-[#F5F5F3] p-2 flex flex-col items-center gap-2">
            <div className="relative w-10 h-10">
              <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#F2C4A0]" />
              <div className="absolute top-0 left-0 w-9 h-9 rounded-full bg-[#E0DEDA]" />
            </div>
            <div className="w-full space-y-1">
              {[80, 60, 90, 70].map((w, i) => <div key={i} className="h-1 bg-[#E8E8E4] rounded-sm" style={{ width: `${w}%` }} />)}
            </div>
          </div>
          <div className="flex-1 bg-white p-2 space-y-1.5">
            <div className="w-20 h-3 bg-[#333] rounded-sm" />
            <div className="bg-[#F9E4D0] px-1 py-0.5 rounded-sm">
              <div className="w-14 h-1.5 bg-[#C97D50] rounded-sm" />
            </div>
            <div className="space-y-1 mt-1">
              {[90, 75, 80, 70].map((w, i) => <div key={i} className="h-1.5 bg-[#F0F0F0] rounded-sm" style={{ width: `${w}%` }} />)}
            </div>
          </div>
        </div>
      )
    default:
      return <div className="w-full h-full bg-[#F4F3F0]" />
  }
}
