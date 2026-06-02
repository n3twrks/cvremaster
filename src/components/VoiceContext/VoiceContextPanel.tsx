'use client'

import { useState, useCallback } from 'react'
import { CVData } from '@/types/cv'
import { ContextEntry, ContextPack, loadContextPack, saveContextPack } from '@/lib/contextStorage'
import ContextSlot from './ContextSlot'
import ContextFileView from './ContextFileView'

interface Props {
  cvData: CVData | null
  projectId: string
  onSendToChat: (text: string) => void
}

type PanelTab = 'slots' | 'contexte'

type SlotDef = Omit<ContextEntry, 'transcript' | 'transcribedAt' | 'durationSec' | 'isEdited'>

function buildSlotDefs(cvData: CVData | null): SlotDef[] {
  const defs: SlotDef[] = [
    { id: 'ctx_profile',     type: 'profile',     label: 'Profil global' },
    { id: 'ctx_skills',      type: 'skills',      label: 'Compétences & expertise' },
    { id: 'ctx_qualities',   type: 'qualities',   label: 'Qualités' },
    { id: 'ctx_flaws',       type: 'flaws',       label: 'Défauts & axes d\'amélioration' },
    { id: 'ctx_aspirations', type: 'aspirations', label: 'Aspirations' },
  ]
  cvData?.education?.forEach((edu, i) => {
    const datePart = edu.date ? ` · ${edu.date}` : ''
    defs.push({
      id: `ctx_edu_${i}`,
      type: 'education',
      label: `${edu.degree}${edu.school ? ` @ ${edu.school}` : ''}${datePart}`,
    })
  })
  cvData?.experience?.forEach((exp, i) => {
    const datePart = exp.date ? ` · ${exp.date}` : ''
    defs.push({
      id: `ctx_exp_${i}`,
      type: 'experience',
      label: `${exp.title}${exp.company ? ` @ ${exp.company}` : ''}${datePart}`,
    })
  })
  return defs
}

function buildChatMessage(entry: ContextEntry): string {
  return `[Contexte vocal — ${entry.label}]\n"${entry.transcript}"\n\nSur la base de ce contexte, enrichis et améliore les sections pertinentes de mon CV (summary, compétences, expériences) en conservant un ton professionnel et en restant fidèle aux faits mentionnés.`
}

export default function VoiceContextPanel({ cvData, projectId, onSendToChat }: Props) {
  const [pack, setPack] = useState<ContextPack>(() => loadContextPack(projectId))
  const [panelTab, setPanelTab] = useState<PanelTab>('slots')

  const slotDefs = buildSlotDefs(cvData)

  const entries: ContextEntry[] = slotDefs.map(def => {
    const saved = pack.entries.find(e => e.id === def.id)
    return saved ?? { ...def, transcript: '' }
  })

  const savePack = useCallback((newPack: ContextPack) => {
    try { saveContextPack(projectId, newPack) } catch { /* localStorage full */ }
  }, [projectId])

  const updateEntry = useCallback((updated: ContextEntry) => {
    setPack(prev => {
      const idx = prev.entries.findIndex(e => e.id === updated.id)
      const newEntries = idx >= 0
        ? prev.entries.map((e, i) => i === idx ? updated : e)
        : [...prev.entries, updated]
      const newPack: ContextPack = { ...prev, entries: newEntries, updatedAt: new Date().toISOString() }
      savePack(newPack)
      return newPack
    })
  }, [savePack])

  const saveCombinedText = useCallback((text: string) => {
    setPack(prev => {
      const newPack: ContextPack = { ...prev, combinedText: text, updatedAt: new Date().toISOString() }
      savePack(newPack)
      return newPack
    })
  }, [savePack])

  const fixedEntries = entries.filter(e => ['profile', 'skills', 'qualities', 'flaws', 'aspirations'].includes(e.type))
  const educationEntries = entries.filter(e => e.type === 'education')
  const experienceEntries = entries.filter(e => e.type === 'experience')
  const filledCount = entries.filter(e => e.transcript).length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub-tabs */}
      <div className="px-4 pt-3 pb-0 border-b border-[#E5E4E0] shrink-0">
        <div className="flex gap-0.5">
          {(['slots', 'contexte'] as PanelTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setPanelTab(tab)}
              className={`px-3 py-1.5 text-xs font-body font-medium rounded-t transition-colors ${
                panelTab === tab
                  ? 'bg-white border border-b-white border-[#E5E4E0] -mb-px text-[#1A1A18]'
                  : 'text-[#9D9C98] hover:text-[#6B6A66]'
              }`}
            >
              {tab === 'slots' ? 'Slots' : (
                <span className="flex items-center gap-1">
                  Contexte
                  {filledCount > 0 && (
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1B4332] text-white text-[9px] font-mono">
                      {filledCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {panelTab === 'slots' ? (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
          {fixedEntries.map(entry => (
            <ContextSlot
              key={entry.id}
              entry={entry}
              onUpdate={updateEntry}
              onSendToChat={e => onSendToChat(buildChatMessage(e))}
            />
          ))}

          {educationEntries.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest font-body font-medium text-[#9D9C98] pt-2 pb-0.5">
                Parcours scolaire
              </p>
              {educationEntries.map(entry => (
                <ContextSlot
                  key={entry.id}
                  entry={entry}
                  onUpdate={updateEntry}
                  onSendToChat={e => onSendToChat(buildChatMessage(e))}
                />
              ))}
            </>
          )}

          {experienceEntries.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest font-body font-medium text-[#9D9C98] pt-2 pb-0.5">
                Expériences
              </p>
              {experienceEntries.map(entry => (
                <ContextSlot
                  key={entry.id}
                  entry={entry}
                  onUpdate={updateEntry}
                  onSendToChat={e => onSendToChat(buildChatMessage(e))}
                />
              ))}
            </>
          )}

          {experienceEntries.length === 0 && educationEntries.length === 0 && (
            <p className="text-[11px] font-body text-[#9D9C98] text-center pt-3">
              Ajoutez des expériences au CV pour voir les slots dynamiques.
            </p>
          )}
        </div>
      ) : (
        <ContextFileView
          entries={entries}
          savedText={pack.combinedText}
          onSave={saveCombinedText}
          onSendToChat={onSendToChat}
        />
      )}
    </div>
  )
}
