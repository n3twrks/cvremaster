'use client'

import { useRef, useState } from 'react'
import { CVData, Message } from '@/types/cv'
import { extractTextFromPDF } from '@/lib/pdfParser'
import { parseJSONResponse } from '@/lib/parseAIResponse'
import { encodeCVToURL } from '@/lib/cvStorage'
import { downloadHTML } from '@/lib/exportHTML'
import { downloadPDF } from '@/lib/exportPDF'

interface Props {
  cvData: CVData | null
  onUpdateCV: (data: CVData) => void
  addMessage: (role: Message['role'], content: string) => void
  setIsLoading: (v: boolean) => void
}

export default function Toolbar({ cvData, onUpdateCV, addMessage, setIsLoading }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    addMessage('user', `Import du fichier : ${file.name}`)
    addMessage('thinking', 'Extraction du texte PDF en cours…')
    setIsLoading(true)

    try {
      const text = await extractTextFromPDF(file)

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system:
            'Tu es un expert en parsing de CV. Analyse le texte et retourne UNIQUEMENT un objet JSON valide sans aucun texte avant ou après, sans backticks markdown. Structure : { name, tagline, contact[], summary, experience[{title, company, location, date, bullets[]}], education[{school, degree, date}], skills[], languages[], hobbies[] }',
          user: `Voici le texte extrait du CV :\n\n${text}`,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')

      const parsed: CVData = parseJSONResponse(data.result)
      onUpdateCV(parsed)
      addMessage('assistant', "CV importé et structuré. Vous pouvez maintenant l'éditer via le chat.")
    } catch (err) {
      addMessage('assistant', `Erreur lors de l'import : ${err instanceof Error ? err.message : 'inconnu'}`)
    } finally {
      setIsLoading(false)
    }
  }

  function handleExportHTML() {
    if (!cvData) return
    downloadHTML(cvData)
    addMessage('assistant', 'Fichier HTML téléchargé.')
  }

  async function handleExportPDF() {
    if (!cvData || pdfLoading) return
    setPdfLoading(true)
    addMessage('thinking', 'Génération du PDF en cours…')
    try {
      await downloadPDF(cvData)
      addMessage('assistant', 'PDF téléchargé.')
    } catch (err) {
      addMessage('assistant', `Erreur PDF : ${err instanceof Error ? err.message : 'inconnu'}`)
    } finally {
      setPdfLoading(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  async function handleCopyLink() {
    if (!cvData) return
    const encoded = encodeCVToURL(cvData)
    const url = `${window.location.origin}${window.location.pathname}?cv=${encoded}`
    await navigator.clipboard.writeText(url)
    addMessage('assistant', 'Lien copié dans le presse-papier !')
  }

  return (
    <div
      id="toolbar"
      className="flex items-center gap-2 px-4 py-3 bg-[#FAFAF8] border-b border-[#E5E4E0] flex-wrap"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Import PDF */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#CCCBC6] bg-white text-[#1A1A18] text-sm font-body font-medium hover:bg-[#F4F3F0] transition-colors duration-150"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Importer PDF
      </button>

      <div className="w-px h-5 bg-[#E5E4E0]" />

      {/* Export HTML */}
      <button
        onClick={handleExportHTML}
        disabled={!cvData}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#CCCBC6] bg-white text-[#1A1A18] text-sm font-body font-medium hover:bg-[#F4F3F0] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 3h11M2.5 6h8M2.5 9h9M2.5 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Export HTML
      </button>

      {/* Export PDF — primary CTA */}
      <button
        onClick={handleExportPDF}
        disabled={!cvData || pdfLoading}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1B4332] text-[#FAFAF8] text-sm font-body font-medium hover:bg-[#163A2B] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 9V1M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {pdfLoading ? 'Génération…' : 'Export PDF'}
      </button>

      {/* Print A4 */}
      <button
        onClick={handlePrint}
        disabled={!cvData}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#CCCBC6] bg-white text-[#1A1A18] text-sm font-body font-medium hover:bg-[#F4F3F0] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Imprimer / Cmd+P → Enregistrer en PDF"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 6V3h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Imprimer
      </button>

      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        disabled={!cvData}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#CCCBC6] bg-white text-[#1A1A18] text-sm font-body font-medium hover:bg-[#F4F3F0] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Copier lien
      </button>
    </div>
  )
}
