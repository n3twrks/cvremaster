'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, FileText, CheckCircle } from 'lucide-react'
import { extractTextFromPDF } from '@/lib/pdfParser'
import { parseJSONResponse } from '@/lib/parseAIResponse'
import { saveCV, saveTemplate } from '@/lib/cvStorage'

const TEMPLATES = [
  { id: 'classic', name: 'Classic', colors: ['#1A1A18', '#FAFAF8'] },
  { id: 'sidebar-dark', name: 'Sidebar Dark', colors: ['#2D2D2B', '#FFFFFF'] },
  { id: 'teal-horizontal', name: 'Teal Horizontal', colors: ['#0D9488', '#FFFFFF'] },
  { id: 'teal-sidebar', name: 'Teal Sidebar', colors: ['#F0FDFB', '#0D9488'] },
  { id: 'navy-dark', name: 'Navy Dark', colors: ['#1E3A5F', '#FFFFFF'] },
  { id: 'pastel-sidebar', name: 'Pastel', colors: ['#FDDCB5', '#F4A261'] },
]

type Step = 'idle' | 'extracting' | 'ready' | 'parsing' | 'done'

export default function TryItNowSection() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('idle')
  const [fileName, setFileName] = useState('')
  const [pdfText, setPdfText] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('classic')
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setError('Veuillez importer un fichier PDF.')
      return
    }
    setError('')
    setFileName(file.name)
    setStep('extracting')
    try {
      const text = await extractTextFromPDF(file)
      setPdfText(text)
      setStep('ready')
    } catch {
      setError("Impossible de lire ce PDF. Essayez un autre fichier.")
      setStep('idle')
    }
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleStart = async () => {
    setStep('parsing')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'Tu es un expert en parsing de CV. Analyse le texte et retourne UNIQUEMENT un objet JSON valide sans aucun texte avant ou après, sans backticks markdown. Structure : { name, tagline, contact[], summary, experience[{title, company, location, date, bullets[]}], education[{school, degree, date}], skills[], languages[], hobbies[] }',
          user: `Voici le texte extrait du CV :\n\n${pdfText}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')
      const cvData = parseJSONResponse(data.result)
      saveCV(cvData)
      saveTemplate(selectedTemplate)
      setStep('done')
      setTimeout(() => router.push('/cv'), 600)
    } catch {
      setError("Erreur lors de l'analyse. Réessayez.")
      setStep('ready')
    }
  }

  return (
    <section id="essayer" className="bg-white py-20 border-t border-[#E5E4E0]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FDF3DC] border border-[#E8A838] rounded-full text-xs font-body font-medium text-[#B45309] mb-4">
            ✨ Testez maintenant, sans inscription
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1A1A18]">
            Importez votre CV pour commencer
          </h2>
          <p className="mt-3 text-[#6B6A66] font-body">
            Importez votre PDF, choisissez un template et laissez l&apos;IA optimiser votre CV.
          </p>
        </div>

        <div className="bg-[#FAFAF8] border border-[#E5E4E0] rounded-2xl p-8 space-y-7">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => step === 'idle' && fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-xl py-10 flex flex-col items-center gap-3 transition-colors
              ${step === 'idle' ? 'cursor-pointer' : ''}
              ${isDragging ? 'border-[#1B4332] bg-[#D8EDDF]/30' : 'border-[#E5E4E0] hover:border-[#CCCBC6]'}
              ${step === 'ready' || step === 'done' ? 'border-[#A7D9B8] bg-[#D8EDDF]/20' : ''}
            `}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={onInputChange} />

            {step === 'idle' && (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#D8EDDF] flex items-center justify-center">
                  <Upload size={22} className="text-[#1B4332]" />
                </div>
                <div className="text-center">
                  <p className="font-body font-medium text-[#1A1A18]">Glissez votre CV PDF ici</p>
                  <p className="text-sm text-[#9D9C98] font-body mt-0.5">ou cliquez pour sélectionner</p>
                </div>
              </>
            )}

            {step === 'extracting' && (
              <>
                <Loader2 size={28} className="text-[#1B4332] animate-spin" />
                <p className="font-body text-[#6B6A66]">Lecture du PDF…</p>
              </>
            )}

            {(step === 'ready' || step === 'parsing' || step === 'done') && (
              <>
                <div className="w-12 h-12 rounded-xl bg-[#D8EDDF] flex items-center justify-center">
                  <FileText size={22} className="text-[#1B4332]" />
                </div>
                <div className="text-center">
                  <p className="font-body font-medium text-[#1A1A18]">{fileName}</p>
                  <button
                    onClick={e => { e.stopPropagation(); setStep('idle'); setPdfText(''); setFileName('') }}
                    className="text-xs text-[#9D9C98] hover:text-[#6B6A66] font-body mt-0.5 transition-colors"
                  >
                    Changer de fichier
                  </button>
                </div>
              </>
            )}
          </div>

          {error && <p className="text-sm text-red-600 font-body text-center">{error}</p>}

          {/* Template picker */}
          {(step === 'ready' || step === 'parsing' || step === 'done') && (
            <div className="space-y-3">
              <p className="font-body font-medium text-[#1A1A18] text-sm">Choisissez un template :</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {TEMPLATES.map(({ id, name, colors }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedTemplate(id)}
                    title={name}
                    className={`rounded-lg overflow-hidden aspect-[3/4] border-2 transition-colors ${
                      selectedTemplate === id ? 'border-[#1B4332]' : 'border-[#E5E4E0] hover:border-[#CCCBC6]'
                    }`}
                  >
                    <div className="w-full h-full flex">
                      <div className="w-1/3 h-full" style={{ background: colors[0] }} />
                      <div className="flex-1 h-full flex flex-col p-1 gap-0.5" style={{ background: colors[1] }}>
                        {[70, 85, 60, 75].map((w, i) => (
                          <div key={i} className="h-0.5 bg-gray-300 rounded" style={{ width: `${w}%`, opacity: 0.5 }} />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#9D9C98] font-body">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={step === 'idle' ? () => fileInputRef.current?.click() : handleStart}
            disabled={step === 'extracting' || step === 'parsing' || step === 'done'}
            className="w-full py-3.5 bg-[#1B4332] text-white font-body font-medium rounded-xl hover:bg-[#163A2B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {step === 'parsing' && <Loader2 size={16} className="animate-spin" />}
            {step === 'done' && <CheckCircle size={16} />}
            {step === 'idle' && 'Importer mon CV PDF'}
            {step === 'extracting' && 'Lecture en cours…'}
            {step === 'ready' && 'Analyser et créer mon CV →'}
            {step === 'parsing' && 'Analyse IA en cours…'}
            {step === 'done' && 'Redirection…'}
          </button>
        </div>
      </div>
    </section>
  )
}
