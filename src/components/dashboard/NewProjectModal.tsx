'use client'

import { useEffect, useRef, useState } from 'react'
import { extractTextFromPDF } from '@/lib/pdfParser'

interface Props {
  onClose: () => void
  onCreate: (name: string, pdfFile?: File) => void
  creating: boolean
}

export default function NewProjectModal({ onClose, onCreate, creating }: Props) {
  const [name, setName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onCreate(name || 'Mon CV', selectedFile ?? undefined)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-base text-[#1A1A18]">Nouveau CV</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9D9C98] hover:bg-[#F4F3F0] hover:text-[#1A1A18] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-body font-medium text-[#6B6A66] mb-1.5">
              Nom du projet
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Mon CV"
              className="w-full rounded-lg border border-[#CCCBC6] bg-white px-3 py-2.5 text-sm font-body text-[#1A1A18] placeholder-[#9D9C98] focus:outline-none focus:border-[#1B4332] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-body font-medium text-[#6B6A66] mb-1.5">
              Importer un PDF <span className="font-normal text-[#9D9C98]">(optionnel)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={e => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            {selectedFile ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#D8EDDF] bg-[#F0FAF4]">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#1B4332] shrink-0">
                  <rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-xs font-body text-[#1B4332] truncate flex-1">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-[#9D9C98] hover:text-[#1A1A18] transition-colors shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-[#CCCBC6] text-xs font-body text-[#9D9C98] hover:border-[#1B4332] hover:text-[#1B4332] hover:bg-[#F0FAF4] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Choisir un fichier PDF
              </button>
            )}
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E5E4E0] text-sm font-body font-medium text-[#6B6A66] hover:bg-[#F4F3F0] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-2.5 rounded-lg bg-[#1B4332] text-[#FAFAF8] text-sm font-body font-medium hover:bg-[#163A2B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Création…
                </span>
              ) : (
                selectedFile ? 'Créer et importer' : 'Créer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Re-export so dashboard can use it without importing pdfParser directly
export { extractTextFromPDF }
