'use client'

import { useState, useEffect } from 'react'
import { CVData, CVAnalysis, SectionAnalysis } from '@/types/cv'
import { saveAnalysis, loadAnalysis } from '@/lib/analysisStorage'
import { Sparkles, Loader2, Link2, Bookmark, BookmarkCheck, ChevronDown, X } from 'lucide-react'

interface Props {
  cvData: CVData | null
  onClose: () => void
}

const SCORE_LABELS: Record<keyof CVAnalysis['scores'], string> = {
  wording: 'Wording',
  length: 'Longueur',
  impact: 'Impact',
  coherence: 'Cohérence',
}

export default function AnalysisPanel({ cvData, onClose }: Props) {
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openSection, setOpenSection] = useState<string | null>(null)

  useEffect(() => {
    const saved = loadAnalysis()
    if (saved) setAnalysis(saved)
  }, [])

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

Critères de scoring (0-100) :
- wording : qualité du langage, verbes d'action forts, précision, absence de jargon vide
- length : sections ni trop courtes ni trop longues, bullets concis (1-2 lignes max)
- impact : résultats quantifiés, achievements mesurables, verbes d'action en début de bullet
- coherence : progression logique du parcours, cohérence entre compétences et expériences, gaps expliqués

Pour "sections", analyse chaque section majeure (Résumé, Expériences, Formation, Compétences…).
Pour "skills.missing", suggère des compétences pertinentes absentes du CV mais attendues pour ce type de profil.
Pour "skills.toHighlight", liste les compétences déjà présentes qui méritent d'être mieux mises en valeur.
Réponds en français.`,
          user: `CV à analyser :\n\n${JSON.stringify(cvData, null, 2)}`,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur API')

      let raw = data.result.trim()
      if (raw.startsWith('```')) {
        raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
      }
      const parsed = JSON.parse(raw)
      const result: CVAnalysis = {
        ...parsed,
        savedRecommendations: analysis?.savedRecommendations ?? [],
        savedAt: new Date().toISOString(),
      }
      setAnalysis(result)
      saveAnalysis(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  function toggleSaveRecommendation(rec: string) {
    if (!analysis) return
    const saved = analysis.savedRecommendations.includes(rec)
      ? analysis.savedRecommendations.filter(r => r !== rec)
      : [...analysis.savedRecommendations, rec]
    const updated = { ...analysis, savedRecommendations: saved }
    setAnalysis(updated)
    saveAnalysis(updated)
  }

  return (
    <aside className="w-[320px] shrink-0 flex flex-col bg-[#FAFAF8] border-l border-[#E5E4E0] h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#E5E4E0]">
        <span className="font-display text-base text-[#1A1A18]">Analyse IA</span>
        <div className="flex items-center gap-2">
          <button
            onClick={runAnalysis}
            disabled={!cvData || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E8A838] text-[#1A1A18] text-xs font-body font-medium hover:bg-[#D4962E] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Analyse…
              </>
            ) : (
              <>
                <Sparkles size={12} />
                Analyser
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F4F3F0] text-[#6B6A66] transition-colors duration-150"
            aria-label="Fermer l'analyse"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Empty state */}
        {!analysis && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#FDF3DC] flex items-center justify-center">
              <Link2 size={24} className="text-[#E8A838]" />
            </div>
            <p className="text-sm text-[#6B6A66] font-body">Cliquez sur Analyser pour obtenir un scoring et des recommandations IA.</p>
          </div>
        )}

        {error && (
          <div className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 font-body">
            {error}
          </div>
        )}

        {analysis && (
          <>
            {/* Global score */}
            <div className="flex flex-col items-center gap-1 py-3">
              <ScoreRing score={analysis.globalScore} size={72} />
              <span className="text-xs font-body text-[#6B6A66] mt-1">Score global</span>
              {analysis.savedAt && (
                <span className="text-[10px] font-mono text-[#9D9C98]">
                  {new Date(analysis.savedAt).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {/* Sub-scores */}
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

            {/* Sections */}
            {analysis.sections.length > 0 && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#9D9C98] mb-2">Analyse par section</h3>
                <div className="space-y-1">
                  {analysis.sections.map((s) => (
                    <SectionCard
                      key={s.name}
                      section={s}
                      open={openSection === s.name}
                      onToggle={() => setOpenSection(openSection === s.name ? null : s.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {(analysis.skills.toHighlight.length > 0 || analysis.skills.missing.length > 0) && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#9D9C98] mb-2">Compétences</h3>
                {analysis.skills.toHighlight.length > 0 && (
                  <div className="mb-2">
                    <p className="text-[11px] text-[#1B4332] font-body font-medium mb-1">À mettre en avant</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skills.toHighlight.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#D8EDDF] border border-[#A7D9B8] text-[#1B4332] text-[11px] font-body rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.skills.missing.length > 0 && (
                  <div>
                    <p className="text-[11px] text-[#B45309] font-body font-medium mb-1">Manquantes / à ajouter</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.skills.missing.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#FDF3DC] border border-[#E8A838] text-[#B45309] text-[11px] font-body rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#9D9C98] mb-2">Recommandations</h3>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, i) => {
                    const saved = analysis.savedRecommendations.includes(rec)
                    return (
                      <div key={i} className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-xs font-body leading-snug transition-colors duration-150 ${saved ? 'bg-[#D8EDDF] border-[#A7D9B8] text-[#1B4332]' : 'bg-white border-[#E5E4E0] text-[#1A1A18]'}`}>
                        <span className="flex-1">{rec}</span>
                        <button
                          onClick={() => toggleSaveRecommendation(rec)}
                          className={`shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors duration-150 ${saved ? 'text-[#1B4332]' : 'text-[#9D9C98] hover:text-[#1B4332]'}`}
                          title={saved ? 'Retirer' : 'Enregistrer'}
                        >
                          {saved ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Saved recommendations highlight */}
            {analysis.savedRecommendations.length > 0 && (
              <div>
                <h3 className="uppercase tracking-widest text-[10px] font-body font-medium text-[#1B4332] mb-2">
                  ✓ Axes enregistrés ({analysis.savedRecommendations.length})
                </h3>
                <div className="space-y-1.5">
                  {analysis.savedRecommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-[#D8EDDF] border border-[#A7D9B8] text-xs font-body text-[#1B4332] leading-snug">
                      <span className="flex-1">{rec}</span>
                      <button
                        onClick={() => toggleSaveRecommendation(rec)}
                        className="shrink-0 text-[#1B4332] hover:text-[#9B1C1C] transition-colors duration-150"
                        title="Retirer"
                      >
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
    </aside>
  )
}

/* ── Sub-components ── */

function ScoreRing({ score, size }: { score: number; size: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 75 ? '#1B4332' : score >= 50 ? '#E8A838' : '#9B1C1C'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F4F3F0" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fontWeight="500" fill={color} fontFamily="DM Mono, monospace">
        {score}
      </text>
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

function SectionCard({ section, open, onToggle }: { section: SectionAnalysis; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#E5E4E0] rounded-lg bg-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#FAFAF8] transition-colors duration-100"
      >
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-medium ${scoreColor(section.score)}`}>{section.score}</span>
          <span className="text-xs font-body text-[#1A1A18]">{section.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <ScoreBar score={section.score} />
          <ChevronDown size={12} className={`text-[#9D9C98] transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-[#F4F3F0]">
          <p className="text-[11px] font-body text-[#6B6A66] mt-2 leading-snug">{section.comment}</p>
          {section.suggestions.length > 0 && (
            <ul className="mt-2 space-y-1">
              {section.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] font-body text-[#1A1A18]">
                  <span className="text-[#E8A838] mt-0.5 shrink-0">→</span>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
