'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Props {
  label: string
  transcript: string
  isEdited?: boolean
  onSave: (text: string) => void
  onClose: () => void
}

export default function TranscriptEditor({ label, transcript, isEdited, onSave, onClose }: Props) {
  const [text, setText] = useState(transcript)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-xl flex flex-col gap-4 p-5"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base text-[#1A1A18]">Éditer la transcription</h3>
            <p className="text-xs text-[#6B6A66] font-body mt-0.5">{label}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9D9C98] hover:text-[#1A1A18] transition-colors mt-0.5 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {isEdited && (
          <span className="text-[10px] font-body text-[#9D9C98] bg-[#F4F3F0] px-2 py-0.5 rounded self-start">
            modifié manuellement
          </span>
        )}

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          className="w-full resize-none rounded-lg border border-[#CCCBC6] bg-[#FAFAF8] px-3 py-2.5 text-sm font-body text-[#1A1A18] focus:outline-none focus:border-[#1B4332] transition-colors overflow-y-auto"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-body text-[#6B6A66] hover:text-[#1A1A18] hover:bg-[#F4F3F0] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(text)}
            className="px-4 py-2 rounded-md bg-[#1B4332] text-white text-sm font-body font-medium hover:bg-[#163A2B] transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  )
}
