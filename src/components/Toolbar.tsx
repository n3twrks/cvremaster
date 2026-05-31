'use client'

import { useRef, useState, useEffect } from 'react'
import { CVData, Message } from '@/types/cv'
import { CVVersion, CVVersionSnapshot } from '@/lib/cvStorage'
import { extractTextFromPDF } from '@/lib/pdfParser'
import { parseJSONResponse } from '@/lib/parseAIResponse'
import { encodeCVToURL } from '@/lib/cvStorage'
import { downloadHTML } from '@/lib/exportHTML'
import { downloadPDF } from '@/lib/exportPDF'

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
] as const

type LangCode = typeof LANGUAGES[number]['code']

interface Props {
  cvData: CVData | null
  onUpdateCV: (data: CVData) => void
  addMessage: (role: Message['role'], content: string) => void
  setIsLoading: (v: boolean) => void
  versions: CVVersion[]
  createVersion: (name: string, language?: string) => void
  upsertVersion: (name: string, language?: string) => void
  restoreVersion: (v: CVVersion) => void
  removeVersion: (id: string) => void
  activeLanguage: string
  setActiveLanguage: (lang: string) => void
}

export default function Toolbar({
  cvData, onUpdateCV, addMessage, setIsLoading,
  versions, upsertVersion, restoreVersion, removeVersion,
  activeLanguage, setActiveLanguage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const versionsRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [versionName, setVersionName] = useState('')
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null)

  useEffect(() => {
    if (!showVersions) return
    function onOutside(e: MouseEvent) {
      if (versionsRef.current && !versionsRef.current.contains(e.target as Node)) setShowVersions(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [showVersions])

  useEffect(() => {
    if (!showLangPicker) return
    function onOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setShowLangPicker(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [showLangPicker])

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
          system: 'Tu es un expert en parsing de CV. Analyse le texte et retourne UNIQUEMENT un objet JSON valide sans aucun texte avant ou après, sans backticks markdown. Structure : { name, tagline, contact[], summary, experience[{title, company, location, date, bullets[]}], education[{school, degree, date}], skills[], languages[], hobbies[] }',
          user: `Voici le texte extrait du CV :\n\n${text}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')
      onUpdateCV(parseJSONResponse(data.result))
      addMessage('assistant', "CV importé et structuré. Vous pouvez maintenant l'éditer via le chat.")
    } catch (err) {
      addMessage('assistant', `Erreur lors de l'import : ${err instanceof Error ? err.message : 'inconnu'}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSwitchLanguage(newLang: LangCode) {
    if (newLang === activeLanguage || !cvData) {
      setShowLangPicker(false)
      return
    }
    setShowLangPicker(false)

    const langLabel = LANGUAGES.find(l => l.code === newLang)?.name ?? newLang

    // If a version already exists for this language, restore it
    const existing = versions.find(v => v.language === newLang)
    if (existing) {
      restoreVersion(existing)
      return
    }

    // Auto-save current state before translating
    upsertVersion(LANGUAGES.find(l => l.code === activeLanguage)?.name ?? activeLanguage, activeLanguage)

    // Translate via AI
    setTranslating(true)
    setIsLoading(true)
    addMessage('thinking', `Traduction du CV en ${langLabel}…`)

    try {
      // Strip photo before sending — base64 images bloat the token count massively
      const { photo: savedPhoto, ...cvWithoutPhoto } = cvData

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Tu es un expert en traduction de CV. Traduis le contenu textuel du CV dans la langue demandée. Retourne UNIQUEMENT un objet JSON valide (sans backticks, sans texte avant ou après). Même structure que l'entrée. Traduis : tagline, summary, bullets d'expérience, intitulés de diplômes. Ne traduis pas les noms propres (personnes, entreprises, villes).`,
          user: `CV :\n${JSON.stringify(cvWithoutPhoto)}\n\nTraduis tout en ${langLabel} (${newLang}). Retourne uniquement le JSON.`,
          maxOutputTokens: 25000,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')

      console.log('[Translation] finishReason:', data.finishReason, '| response length:', data.result?.length)
      if (data.finishReason === 'MAX_TOKENS') {
        console.error('[Translation] ❌ Truncated! Raw (tail):', data.result?.slice(-200))
        addMessage('assistant', `Erreur : réponse tronquée (JSON incomplet). Le CV est peut-être trop long pour la traduction automatique.`)
        return
      }
      console.log('[Translation] Raw response (first 300 chars):', data.result?.slice(0, 300))

      try {
        const updated = parseJSONResponse(data.result)
        // Re-attach the photo that was stripped before sending
        onUpdateCV({ ...updated, photo: savedPhoto })
        upsertVersion(langLabel, newLang)
        setActiveLanguage(newLang)
        addMessage('assistant', `✓ CV traduit en ${langLabel}.`)
      } catch (parseErr) {
        console.error('[Translation] ❌ Parse error:', parseErr)
        console.error('[Translation] Full raw response:', data.result)
        addMessage('assistant', `Erreur : la réponse de traduction est invalide. Voir la console pour le détail.`)
      }
    } catch (err) {
      addMessage('assistant', `Erreur de traduction : ${err instanceof Error ? err.message : 'inconnu'}`)
    } finally {
      setTranslating(false)
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

  async function handleCopyLink() {
    if (!cvData) return
    const encoded = encodeCVToURL(cvData)
    const url = `${window.location.origin}${window.location.pathname}?cv=${encoded}`
    await navigator.clipboard.writeText(url)
    addMessage('assistant', 'Lien copié dans le presse-papier !')
  }

  function handleSaveVersion() {
    if (!cvData) return
    const langName = LANGUAGES.find(l => l.code === activeLanguage)?.name ?? activeLanguage
    upsertVersion(versionName || langName, activeLanguage)
    setVersionName('')
    addMessage('assistant', `Snapshot sauvegardé pour ${LANGUAGES.find(l => l.code === activeLanguage)?.name ?? activeLanguage}.`)
  }

  const currentLang = LANGUAGES.find(l => l.code === activeLanguage) ?? LANGUAGES[0]

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-white border-b border-[#E5E4E0] flex-wrap">
      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />

      {/* Import PDF */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={btnSecondary}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Importer PDF
      </button>

      <Sep />

      {/* Export HTML */}
      <button onClick={handleExportHTML} disabled={!cvData} className={btnSecondary + ' disabled:opacity-40 disabled:cursor-not-allowed'}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 3h11M2.5 6h8M2.5 9h9M2.5 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        HTML
      </button>

      {/* Export PDF */}
      <button
        onClick={handleExportPDF}
        disabled={!cvData || pdfLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1B4332] text-[#FAFAF8] text-xs font-body font-medium hover:bg-[#163A2B] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 9V1M5 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {pdfLoading ? 'PDF…' : 'PDF'}
      </button>

      {/* Print */}
      <button onClick={() => window.print()} disabled={!cvData} className={btnSecondary + ' disabled:opacity-40 disabled:cursor-not-allowed'} title="Cmd+P → Enregistrer en PDF">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 6V3h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 10h6M5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Imprimer
      </button>

      {/* Copy link */}
      <button onClick={handleCopyLink} disabled={!cvData} className={btnSecondary + ' disabled:opacity-40 disabled:cursor-not-allowed'}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Lien
      </button>

      <Sep />

      {/* Language switcher */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => setShowLangPicker(v => !v)}
          disabled={!cvData || translating}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-body font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            showLangPicker
              ? 'border-[#1B4332] bg-[#D8EDDF] text-[#1B4332]'
              : 'border-[#CCCBC6] bg-white text-[#1A1A18] hover:bg-[#F4F3F0]'
          }`}
          title="Changer la langue du CV"
        >
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span>{currentLang.code.toUpperCase()}</span>
          {translating && <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
        </button>

        {showLangPicker && (
          <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-[#E5E4E0] rounded-lg shadow-lg z-50 py-1">
            {LANGUAGES.map(lang => {
              const hasVersion = versions.some(v => v.language === lang.code)
              const isCurrent = lang.code === activeLanguage
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSwitchLanguage(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-body transition-colors hover:bg-[#F4F3F0] ${isCurrent ? 'text-[#1B4332] font-medium' : 'text-[#1A1A18]'}`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  {isCurrent && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {hasVersion && !isCurrent && (
                    <span className="text-[9px] font-mono text-[#9D9C98]">sauvegardé</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Versions panel */}
      <div ref={versionsRef} className="relative">
        <button
          onClick={() => setShowVersions(v => !v)}
          disabled={!cvData}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-body font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            showVersions
              ? 'border-[#1B4332] bg-[#D8EDDF] text-[#1B4332]'
              : 'border-[#CCCBC6] bg-white text-[#1A1A18] hover:bg-[#F4F3F0]'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Versions
          {versions.length > 0 && (
            <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#D8EDDF] text-[#1B4332] font-mono leading-none">
              {versions.length}
            </span>
          )}
        </button>

        {showVersions && (
          <div className="absolute top-full right-0 mt-1.5 w-[340px] bg-white border border-[#E5E4E0] rounded-lg shadow-lg z-50 p-3">
            {/* Save snapshot for current language */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={versionName}
                onChange={e => setVersionName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveVersion()}
                className="flex-1 rounded-md border border-[#CCCBC6] bg-white px-2.5 py-1.5 text-xs font-body text-[#1A1A18] placeholder-[#9D9C98] focus:outline-none focus:border-[#1B4332] transition-colors"
                placeholder="Label du snapshot (optionnel)"
              />
              <button
                onClick={handleSaveVersion}
                className="px-3 py-1.5 rounded-md bg-[#1B4332] text-[#FAFAF8] text-xs font-body font-medium hover:bg-[#163A2B] transition-colors whitespace-nowrap"
              >
                Sauvegarder
              </button>
            </div>

            {versions.length > 0 && <div className="border-t border-[#F4F3F0] mb-2" />}

            <div className="space-y-1 max-h-[320px] overflow-y-auto">
              {versions.length === 0 ? (
                <p className="text-xs font-body text-[#9D9C98] text-center py-2">Aucune version sauvegardée</p>
              ) : (
                versions.map(v => {
                  const lang = LANGUAGES.find(l => l.code === v.language)
                  const isExpanded = expandedVersionId === v.id
                  const historyCount = v.history?.length ?? 0
                  return (
                    <div key={v.id}>
                      {/* Version row */}
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F4F3F0] transition-colors group">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {lang && <span className="text-sm leading-none">{lang.flag}</span>}
                            <p className="text-xs font-body font-medium text-[#1A1A18] truncate">{v.name}</p>
                          </div>
                          <p className="text-[10px] font-mono text-[#9D9C98]">
                            {new Date(v.savedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {historyCount > 0 && (
                          <button
                            onClick={() => setExpandedVersionId(isExpanded ? null : v.id)}
                            className="text-[10px] font-mono text-[#9D9C98] hover:text-[#1A1A18] transition-colors whitespace-nowrap shrink-0"
                          >
                            {historyCount} snap{historyCount > 1 ? 's' : ''} {isExpanded ? '▲' : '▼'}
                          </button>
                        )}
                        <button
                          onClick={() => { restoreVersion(v); setShowVersions(false) }}
                          className="text-[11px] font-body text-[#1B4332] hover:text-[#163A2B] transition-colors whitespace-nowrap opacity-0 group-hover:opacity-100"
                        >
                          Restaurer
                        </button>
                        <button
                          onClick={() => removeVersion(v.id)}
                          className="w-5 h-5 flex items-center justify-center text-[#9D9C98] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                      {/* History snapshots */}
                      {isExpanded && v.history?.map((snap: CVVersionSnapshot, i: number) => (
                        <div key={i} className="flex items-center gap-2 pl-8 pr-2 py-1 group">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono text-[#9D9C98]">
                              {new Date(snap.savedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <button
                            onClick={() => { restoreVersion({ ...v, data: snap.data, savedAt: snap.savedAt }); setShowVersions(false) }}
                            className="text-[11px] font-body text-[#1B4332] hover:text-[#163A2B] transition-colors whitespace-nowrap opacity-0 group-hover:opacity-100"
                          >
                            Restaurer
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Sep() {
  return <div className="w-px h-4 bg-[#E5E4E0] shrink-0" />
}

const btnSecondary = 'flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CCCBC6] bg-white text-[#1A1A18] text-xs font-body font-medium hover:bg-[#F4F3F0] transition-colors duration-150'
