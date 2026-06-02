'use client'

import { useRef, useEffect, useState } from 'react'
import { CVData, CVAnalysis, Message, SectionAnalysis } from '@/types/cv'
import { extractJSONUpdate, extractPatchUpdate, applyPatch } from '@/lib/parseAIResponse'
import { saveAnalysis, loadAnalysis } from '@/lib/analysisStorage'
import { loadContextPack } from '@/lib/contextStorage'
import ApiKeyBanner from './ApiKeyBanner'
import VoiceContextPanel from './VoiceContext/VoiceContextPanel'
import { Sparkles, Loader2, RotateCcw, Link2, Bookmark, BookmarkCheck, ChevronDown, X, ArrowRight } from 'lucide-react'

type Tab = 'chat' | 'analyser' | 'voice'

interface Props {
  messages: Message[]
  isLoading: boolean
  cvData: CVData | null
  projectId?: string
  onUpdateCV: (data: CVData) => void
  addMessage: (role: Message['role'], content: string) => void
  setIsLoading: (v: boolean) => void
}

// Exposed so other components can trigger a chat message externally
export type SidebarRef = { sendMessage: (text: string) => void; switchToChat: () => void }

export default function Sidebar({ messages, isLoading, cvData, projectId, onUpdateCV, addMessage, setIsLoading }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('chat')

  return (
    <aside
      id="sidebar"
      className="!w-[400px] shrink-0 flex flex-col bg-[#FAFAF8] border-l border-[#E5E4E0] h-full"
    >
      {/* Tabs */}
      <div className="px-5 py-3 border-b border-[#E5E4E0]">
        <div className="flex gap-1">
          {(['chat', 'analyser', 'voice'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-md text-sm font-body font-medium transition-colors duration-150 ${
                activeTab === tab
                  ? 'bg-[#1B4332] text-[#FAFAF8]'
                  : 'text-[#6B6A66] hover:text-[#1A1A18] hover:bg-[#F4F3F0]'
              }`}
            >
              {tab === 'chat' ? 'Chat' : tab === 'analyser' ? 'Analyser' : 'Voix'}
            </button>
          ))}
        </div>
      </div>

      <ApiKeyBanner />

      {activeTab === 'chat' ? (
        <ChatTab
          messages={messages}
          isLoading={isLoading}
          cvData={cvData}
          projectId={projectId}
          onUpdateCV={onUpdateCV}
          addMessage={addMessage}
          setIsLoading={setIsLoading}
        />
      ) : activeTab === 'analyser' ? (
        <AnalyserTab
          cvData={cvData}
          projectId={projectId}
          onApplyRec={(rec) => {
            setActiveTab('chat')
            addMessage('__apply__' as Message['role'], rec)
          }}
        />
      ) : (
        <VoiceContextPanel
          cvData={cvData}
          projectId={projectId ?? ''}
          onSendToChat={(text) => {
            setActiveTab('chat')
            addMessage('__voiceinject__' as Message['role'], text)
          }}
        />
      )}
    </aside>
  )
}

/* ── Chat tab ── */

const SYSTEM_PROMPT_BASE = `Tu es un expert en rédaction de CV. Tu as accès aux données actuelles en JSON.

RÈGLES DE RÉPONSE :
1. Pour modifier UN ou QUELQUES champs ciblés : commence par PATCH_UPDATE: suivi d'un tableau JSON.
   Format : PATCH_UPDATE: [{"path": "champ", "value": "nouvelle valeur"}, ...]
   Chemins valides : "name", "tagline", "summary", "contact.N", "skills.N", "languages.N.name", "languages.N.level", "languages.N.score", "hobbies.N",
   "experience.N.title", "experience.N.company", "experience.N.location", "experience.N.date", "experience.N.bullets.N",
   "education.N.degree", "education.N.school", "education.N.date"
   (remplace N par l'index 0, 1, 2…)
2. Pour restructurer entièrement le CV ou le créer depuis zéro : commence par JSON_UPDATE: suivi du JSON complet.
   Structure : { name, tagline, contact[], summary, experience[{title,company,location,date,bullets[]}], education[{school,degree,date}], skills[], languages[{name,level,score}], hobbies[] }
   Pour languages : name = nom de la langue, level = texte libre (Natif, C1, Bilingue, Professionnel…), score = entier 1–5
3. Pour une question ou conseil général : réponds normalement en texte.

RÈGLE DE LANGUE : Détecte la langue principale du CV (champs name, summary, experience, etc.) et réponds et écris les modifications dans cette même langue. Si le CV est en anglais, réponds en anglais et modifie le contenu en anglais. Si en français, en français.`

function buildSystemPrompt(projectId?: string): string {
  if (!projectId) return SYSTEM_PROMPT_BASE
  try {
    const pack = loadContextPack(projectId)
    const filled = pack.entries.filter(e => e.transcript)
    if (!filled.length) return SYSTEM_PROMPT_BASE
    const ctx = filled.map(e => `${e.label} : "${e.transcript}"`).join('\n')
    return `${SYSTEM_PROMPT_BASE}\n\n[CONTEXTE ADDITIONNEL FOURNI PAR L'UTILISATEUR]\n${ctx}\nUtilisez ces informations pour enrichir, préciser ou valider les modifications demandées. Ne les inventez pas, elles viennent directement de la bouche de l'utilisateur.`
  } catch {
    return SYSTEM_PROMPT_BASE
  }
}

function ChatTab({ messages, isLoading, cvData, projectId, onUpdateCV, addMessage, setIsLoading }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastApplyRef = useRef<string | null>(null)
  const lastVoiceRef = useRef<string | null>(null)
  // Stores raw API exchanges for multi-turn context (not display history)
  const apiHistoryRef = useRef<Array<{ role: 'user' | 'model'; content: string }>>([])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Watch for __apply__ messages injected by AnalyserTab
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role === ('__apply__' as Message['role']) && last.content !== lastApplyRef.current) {
      lastApplyRef.current = last.content
      sendText(`Améliore la section correspondante selon cette recommandation : "${last.content}"`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  // Watch for __voiceinject__ messages from VoiceContextPanel
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role === ('__voiceinject__' as Message['role']) && last.content !== lastVoiceRef.current) {
      lastVoiceRef.current = last.content
      sendText(last.content)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages])

  async function sendText(text: string) {
    if (!text.trim() || isLoading) return
    addMessage('user', text)
    addMessage('thinking', 'L\'IA réfléchit…')
    setIsLoading(true)

    // Pass last 20 messages (10 exchanges) to avoid context overflow
    const history = apiHistoryRef.current.slice(-20)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: buildSystemPrompt(projectId),
          // Include latest CV state in current message only — history keeps just the questions
          user: `CV actuel : ${JSON.stringify(cvData ?? {})}\n\nDemande : ${text}`,
          history,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')

      const result: string = data.result

      // Persist exchange: store user question (no CV JSON) + raw model response
      apiHistoryRef.current = [
        ...apiHistoryRef.current,
        { role: 'user', content: text },
        { role: 'model', content: result },
      ]

      const patches = extractPatchUpdate(result)
      if (patches) {
        if (cvData) onUpdateCV(applyPatch(cvData, patches))
        addMessage('assistant', `✓ CV mis à jour (${patches.length} champ${patches.length > 1 ? 's' : ''} modifié${patches.length > 1 ? 's' : ''}).`)
        return
      }

      const updated = extractJSONUpdate(result)
      if (updated) {
        onUpdateCV(updated)
        addMessage('assistant', '✓ CV entièrement restructuré.')
        return
      }

      addMessage('assistant', result)
    } catch (err) {
      // Don't update history on error — keep conversation state clean
      addMessage('assistant', `Erreur : ${err instanceof Error ? err.message : 'inconnu'}`)
    } finally {
      setIsLoading(false)
    }
  }

  function send() {
    const text = input.trim()
    if (!text) return
    setInput('')
    sendText(text)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages
          .filter(m => m.role !== ('__apply__' as Message['role']) && m.role !== ('__voiceinject__' as Message['role']))
          .map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        {isLoading && (
          <div className="flex gap-1 items-center text-[#9D9C98] text-xs font-body">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse delay-75">●</span>
            <span className="animate-pulse delay-150">●</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-4 border-t border-[#E5E4E0]">
        <div className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ex : Reformule mon résumé, améliore les bullets de mon dernier poste…"
            rows={3}
            className="w-full resize-none rounded-md border border-[#CCCBC6] bg-white px-3 py-2 text-sm font-body text-[#1A1A18] placeholder-[#9D9C98] focus:outline-none focus:border-[#1B4332] transition-colors duration-150"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isLoading}
            className="w-full py-2 rounded-md bg-[#1B4332] text-[#FAFAF8] text-sm font-body font-medium hover:bg-[#163A2B] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Envoyer
          </button>
        </div>
      </div>
    </>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  if (msg.role === 'thinking') {
    return <div className="text-xs font-body text-[#9D9C98] italic">{msg.content}</div>
  }
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[280px] px-3 py-2 rounded-lg text-sm font-body leading-snug ${isUser ? 'bg-[#1B4332] text-[#FAFAF8]' : 'bg-white border border-[#E5E4E0] text-[#1A1A18]'}`}>
        {msg.content}
      </div>
    </div>
  )
}

/* ── Analyser tab ── */

const SCORE_LABELS: Record<keyof CVAnalysis['scores'], string> = {
  wording: 'Wording',
  length: 'Longueur',
  impact: 'Impact',
  coherence: 'Cohérence',
}

function AnalyserTab({ cvData, projectId, onApplyRec }: { cvData: CVData | null; projectId?: string; onApplyRec: (rec: string) => void }) {
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(() => loadAnalysis(projectId))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [rescoringSection, setRescoringSection] = useState<string | null>(null)

  async function rescoreSection(section: SectionAnalysis) {
    if (!cvData || !analysis) return
    setRescoringSection(section.name)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Tu es un expert coach CV. Analyse UNIQUEMENT la section "${section.name}" du CV fourni. Retourne UNIQUEMENT un objet JSON (sans backticks) : {"name": "${section.name}", "score": number (0-100), "comment": string, "suggestions": string[]}`,
          user: `CV :\n${JSON.stringify(cvData, null, 2)}\n\nRéanalyse la section "${section.name}".`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      let raw = data.result.trim()
      const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
      if (fenceMatch) raw = fenceMatch[1].trim()
      const start = raw.indexOf('{'); const end = raw.lastIndexOf('}')
      if (start !== -1 && end > start) raw = raw.slice(start, end + 1)
      const updated = JSON.parse(raw) as SectionAnalysis
      const newAnalysis = { ...analysis, sections: analysis.sections.map(s => s.name === section.name ? updated : s) }
      setAnalysis(newAnalysis)
      saveAnalysis(newAnalysis, projectId)
    } catch { /* silent fail */ } finally {
      setRescoringSection(null)
    }
  }

  async function runAnalysis() {
    if (!cvData) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Tu es un expert coach CV senior. Analyse ce CV et retourne UNIQUEMENT un objet JSON valide sans backticks ni texte autour. Structure exacte :
{
  "globalScore": number (0-100),
  "scores": { "wording": number, "length": number, "impact": number, "coherence": number },
  "sections": [{ "name": string, "score": number, "comment": string, "suggestions": string[] }],
  "skills": { "present": string[], "toHighlight": string[], "missing": string[] },
  "recommendations": string[]
}
Réponds en français.`,
          user: `CV à analyser :\n\n${JSON.stringify(cvData, null, 2)}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')
      let raw = data.result.trim()
      if (raw.startsWith('```')) raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      const parsed = JSON.parse(raw)
      const result: CVAnalysis = {
        ...parsed,
        savedRecommendations: analysis?.savedRecommendations ?? [],
        savedAt: new Date().toISOString(),
      }
      setAnalysis(result)
      saveAnalysis(result, projectId)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  function toggleSaveRec(rec: string) {
    if (!analysis) return
    const saved = analysis.savedRecommendations.includes(rec)
      ? analysis.savedRecommendations.filter(r => r !== rec)
      : [...analysis.savedRecommendations, rec]
    const updated = { ...analysis, savedRecommendations: saved }
    setAnalysis(updated)
    saveAnalysis(updated, projectId)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#E5E4E0] flex items-center justify-between">
        <span className="text-xs font-body text-[#6B6A66]">Scoring et recommandations IA</span>
        <button
          onClick={runAnalysis}
          disabled={!cvData || loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E8A838] text-[#1A1A18] text-xs font-body font-medium hover:bg-[#D4962E] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 size={12} className="animate-spin" />Analyse…</>
          ) : (
            <><Sparkles size={12} />Analyser</>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {!analysis && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#FDF3DC] flex items-center justify-center">
              <Link2 size={24} className="text-[#E8A838]" />
            </div>
            <p className="text-sm text-[#6B6A66] font-body">Cliquez sur Analyser pour obtenir un scoring et des recommandations IA.</p>
          </div>
        )}
        {error && <div className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 font-body">{error}</div>}

        {analysis && (
          <>
            <div className="flex flex-col items-center gap-1 py-3">
              <ScoreRing score={analysis.globalScore} size={72} />
              <span className="text-xs font-body text-[#6B6A66] mt-1">Score global</span>
              {analysis.savedAt && (
                <span className="text-[10px] font-mono text-[#9D9C98]">
                  {new Date(analysis.savedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(analysis.scores) as [keyof CVAnalysis['scores'], number][]).map(([key, val]) => (
                <div key={key} className="bg-white border border-[#E5E4E0] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-body text-[#6B6A66]">{SCORE_LABELS[key]}</span>
                    <span className={`text-xs font-mono font-medium ${scoreColor(val)}`}>{val}</span>
                  </div>
                  <ScoreBar score={val} />
                </div>
              ))}
            </div>

            {analysis.sections.length > 0 && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#9D9C98] mb-2">Analyse par section</h3>
                <div className="space-y-1">
                  {analysis.sections.map(s => (
                    <SectionCard
                      key={s.name}
                      section={s}
                      open={openSection === s.name}
                      onToggle={() => setOpenSection(openSection === s.name ? null : s.name)}
                      onRescore={() => rescoreSection(s)}
                      isRescoring={rescoringSection === s.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {(analysis.skills.toHighlight.length > 0 || analysis.skills.missing.length > 0) && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#9D9C98] mb-2">Compétences</h3>
                {analysis.skills.toHighlight.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[11px] text-[#1B4332] font-body font-medium mb-1">À mettre en avant</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skills.toHighlight.map((s, i) => <span key={i} className="px-2 py-0.5 bg-[#D8EDDF] border border-[#A7D9B8] text-[#1B4332] text-[11px] font-body rounded">{s}</span>)}
                    </div>
                  </div>
                )}
                {analysis.skills.missing.length > 0 && (
                  <div>
                    <p className="text-[11px] text-[#B45309] font-body font-medium mb-1">Manquantes / à ajouter</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skills.missing.map((s, i) => <span key={i} className="px-2 py-0.5 bg-[#FDF3DC] border border-[#E8A838] text-[#B45309] text-[11px] font-body rounded">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#9D9C98] mb-2">Recommandations</h3>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, i) => {
                    const saved = analysis.savedRecommendations.includes(rec)
                    return (
                      <div key={i} className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-xs font-body leading-snug transition-colors duration-150 ${saved ? 'bg-[#D8EDDF] border-[#A7D9B8] text-[#1B4332]' : 'bg-white border-[#E5E4E0] text-[#1A1A18]'}`}>
                        <span className="flex-1">{rec}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Apply button */}
                          <button
                            onClick={() => onApplyRec(rec)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#1B4332] hover:text-white text-[#1B4332] transition-colors"
                            title="Appliquer via le chat"
                          >
                            <ArrowRight size={11} />
                          </button>
                          {/* Save button */}
                          <button
                            onClick={() => toggleSaveRec(rec)}
                            className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${saved ? 'text-[#1B4332]' : 'text-[#9D9C98] hover:text-[#1B4332]'}`}
                            title={saved ? 'Retirer' : 'Enregistrer'}
                          >
                            {saved ? <BookmarkCheck size={11} /> : <Bookmark size={11} />}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {analysis.savedRecommendations.length > 0 && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#1B4332] mb-2">
                  ✓ Axes enregistrés ({analysis.savedRecommendations.length})
                </h3>
                <div className="space-y-1.5">
                  {analysis.savedRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#D8EDDF] border border-[#A7D9B8] text-xs font-body text-[#1B4332] leading-snug">
                      <span className="flex-1">{rec}</span>
                      <button onClick={() => toggleSaveRec(rec)} className="shrink-0 text-[#1B4332] hover:text-[#9B1C1C] transition-colors">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ── Score sub-components ── */

function ScoreRing({ score, size }: { score: number; size: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 75 ? '#1B4332' : score >= 50 ? '#E8A838' : '#9B1C1C'
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F4F3F0" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="500" fill={color} fontFamily="DM Mono, monospace">{score}</text>
    </svg>
  )
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-[#1B4332]' : score >= 50 ? 'bg-[#E8A838]' : 'bg-[#9B1C1C]'
  return (
    <div className="h-1 rounded-full bg-[#F4F3F0] overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  )
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-[#1B4332]'
  if (score >= 50) return 'text-[#B45309]'
  return 'text-[#9B1C1C]'
}

function SectionCard({ section, open, onToggle, onRescore, isRescoring }: {
  section: SectionAnalysis
  open: boolean
  onToggle: () => void
  onRescore?: () => void
  isRescoring?: boolean
}) {
  return (
    <div className="border border-[#E5E4E0] rounded-lg bg-white overflow-hidden">
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onToggle()}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#FAFAF8] transition-colors duration-100 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-medium ${scoreColor(section.score)}`}>{section.score}</span>
          <span className="text-xs font-body text-[#1A1A18]">{section.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16"><ScoreBar score={section.score} /></div>
          {onRescore && (
            <button
              onClick={e => { e.stopPropagation(); onRescore() }}
              disabled={isRescoring}
              className="w-5 h-5 flex items-center justify-center text-[#9D9C98] hover:text-[#E8A838] transition-colors disabled:opacity-40"
              title="Re-scorer cette section"
            >
              {isRescoring ? (
                <Loader2 size={11} className="animate-spin text-[#E8A838]" />
              ) : (
                <RotateCcw size={11} />
              )}
            </button>
          )}
          <ChevronDown size={12} className={`text-[#9D9C98] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {open && (
        <div className="px-3 pb-3 border-t border-[#F4F3F0]">
          <p className="text-[11px] font-body text-[#6B6A66] mt-2 leading-snug">{section.comment}</p>
          {section.suggestions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {section.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] font-body text-[#1A1A18]">
                  <span className="text-[#E8A838] mt-0.5 shrink-0">→</span>{s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
