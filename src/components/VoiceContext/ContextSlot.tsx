'use client'

import { useState, useRef } from 'react'
import { Mic, Upload, Pencil, RefreshCw, Loader2, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'
import { ContextEntry } from '@/lib/contextStorage'
import { transcribeAudio } from '@/lib/gladiaAPI'
import AudioRecorder from './AudioRecorder'
import TranscriptEditor from './TranscriptEditor'

interface Props {
  entry: ContextEntry
  onUpdate: (updated: ContextEntry) => void
  onSendToChat: (entry: ContextEntry) => void
}

type SlotState = 'idle' | 'recording' | 'transcribing' | 'done' | 'editing' | 'confirming-rerecord'

function getPrompt(type: ContextEntry['type'], label: string): string {
  switch (type) {
    case 'profile':
      return 'Décrivez-vous en quelques minutes : qui vous êtes, ce que vous faites, vos forces, ce que vous recherchez.'
    case 'skills':
      return 'Quelles sont vos compétences clés ? Dans quels domaines excellez-vous ?'
    case 'aspirations':
      return "Qu'est-ce que vous recherchez dans votre prochain poste ? Qu'aimez-vous dans votre travail ?"
    case 'qualities':
      return 'Quelles sont vos qualités principales ? Comment les personnes qui vous connaissent bien vous décrivent-elles ?'
    case 'flaws':
      return 'Quels sont vos défauts ou axes d\'amélioration ? Comment travaillez-vous pour les surmonter ?'
    case 'education': {
      const school = label.includes('@') ? label.split('@').pop()?.trim() : label
      return `Parlez de cette formation chez ${school} : contenu, ce que vous en avez retenu, compétences acquises.`
    }
    case 'experience': {
      const company = label.includes('@') ? label.split('@').pop()?.trim().split('·')[0].trim() : label
      return `Parlez de votre expérience chez ${company} : missions, réalisations, contexte, difficultés surmontées.`
    }
  }
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m > 0) return s > 0 ? `${m} min ${s}s` : `${m} min`
  return `${s}s`
}

export default function ContextSlot({ entry, onUpdate, onSendToChat }: Props) {
  const [state, setState] = useState<SlotState>(entry.transcript ? 'done' : 'idle')
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(!entry.transcript)
  const fileRef = useRef<HTMLInputElement>(null)

  const hasContent = !!entry.transcript
  const prompt = getPrompt(entry.type, entry.label)

  async function handleAudioBlob(blob: Blob, durationSec: number) {
    setState('transcribing')
    setError(null)
    try {
      const transcript = await transcribeAudio(blob)
      onUpdate({ ...entry, transcript, transcribedAt: new Date().toISOString(), durationSec, isEdited: false })
      setState('done')
      setExpanded(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Transcription échouée')
      setState(entry.transcript ? 'done' : 'idle')
    }
  }

  function handleFileUpload(file: File) {
    const supported = /\.(mp3|wav|m4a|webm|ogg)$/i
    if (!supported.test(file.name)) {
      setError('Format non supporté (MP3, WAV, M4A, WebM, OGG)')
      return
    }
    handleAudioBlob(file, 0)
  }

  function saveEdit(text: string) {
    onUpdate({ ...entry, transcript: text, isEdited: text !== entry.transcript || entry.isEdited })
    setState('done')
  }

  const showTranscript = (state === 'done' || (state === 'idle' && hasContent)) && hasContent

  return (
    <div className="border border-[#E5E4E0] rounded-lg bg-white overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
        onClick={() => setExpanded(e => !e)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 ${hasContent ? 'bg-[#1B4332]' : 'bg-[#CCCBC6]'}`}
          />
          <span className="text-xs font-body font-medium text-[#1A1A18] truncate">{entry.label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {hasContent && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setState('editing') }}
                className="w-6 h-6 flex items-center justify-center rounded text-[#9D9C98] hover:text-[#1B4332] hover:bg-[#F4F3F0] transition-colors"
                title="Éditer la transcription"
              >
                <Pencil size={11} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setState('confirming-rerecord') }}
                className="w-6 h-6 flex items-center justify-center rounded text-[#9D9C98] hover:text-[#1B4332] hover:bg-[#F4F3F0] transition-colors"
                title="Re-enregistrer"
              >
                <RefreshCw size={11} />
              </button>
            </>
          )}
          {expanded
            ? <ChevronDown size={12} className="text-[#9D9C98]" />
            : <ChevronRight size={12} className="text-[#9D9C98]" />
          }
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-[#F4F3F0]">
          <p className="text-[11px] italic text-[#9D9C98] font-body mt-2 mb-2 leading-snug">
            &ldquo;{prompt}&rdquo;
          </p>

          {error && (
            <div className="mb-2 px-2 py-1.5 rounded bg-red-50 border border-red-200 text-[11px] text-red-700 font-body">
              {error}
            </div>
          )}

          {/* Empty — record / upload */}
          {state === 'idle' && !hasContent && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { setError(null); setState('recording') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-body font-medium hover:bg-red-100 transition-colors"
              >
                <Mic size={12} />
                Enregistrer
              </button>
              <button
                onClick={() => { setError(null); fileRef.current?.click() }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CCCBC6] text-[#6B6A66] text-xs font-body font-medium hover:bg-[#F4F3F0] transition-colors"
              >
                <Upload size={12} />
                Uploader
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".mp3,.wav,.m4a,.webm,.ogg,audio/*"
                className="hidden"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) { e.target.value = ''; handleFileUpload(f) }
                }}
              />
            </div>
          )}

          {/* Recording */}
          {state === 'recording' && (
            <AudioRecorder
              onStop={handleAudioBlob}
              onCancel={() => {
                setState(hasContent ? 'done' : 'idle')
                setError('Accès micro refusé — uploadez un fichier à la place.')
              }}
            />
          )}

          {/* Transcribing */}
          {state === 'transcribing' && (
            <div className="flex items-center gap-2 py-1.5 text-xs font-body text-[#6B6A66]">
              <Loader2 size={12} className="animate-spin text-[#E8A838]" />
              Transcription en cours…
            </div>
          )}

          {/* Confirm re-record */}
          {state === 'confirming-rerecord' && (
            <div className="flex flex-col gap-2 py-1">
              <p className="text-xs font-body text-[#6B6A66]">
                Êtes-vous sûr ? Le contexte actuel sera écrasé.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setError(null); setState('recording') }}
                  className="px-3 py-1.5 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs font-body font-medium hover:bg-red-100 transition-colors"
                >
                  Oui, re-enregistrer
                </button>
                <button
                  onClick={() => setState('done')}
                  className="px-3 py-1.5 rounded-md border border-[#CCCBC6] text-[#6B6A66] text-xs font-body font-medium hover:bg-[#F4F3F0] transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Has transcript */}
          {showTranscript && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-[10px] font-body text-[#9D9C98] flex-wrap">
                {entry.durationSec ? <span>{formatDuration(entry.durationSec)}</span> : null}
                {entry.transcribedAt ? (
                  <span>
                    •{' '}
                    {new Date(entry.transcribedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                ) : null}
                {entry.isEdited && <span className="text-[#B45309]">• modifié</span>}
              </div>
              <p className="text-[11px] font-body text-[#1A1A18] leading-snug bg-[#F4F3F0] rounded p-2 line-clamp-3">
                &ldquo;{entry.transcript.slice(0, 220)}{entry.transcript.length > 220 ? '…' : ''}&rdquo;
              </p>
              <button
                onClick={() => onSendToChat(entry)}
                className="flex items-center gap-1.5 self-start px-3 py-1.5 rounded-md bg-[#1B4332] text-white text-xs font-body font-medium hover:bg-[#163A2B] transition-colors"
              >
                Utiliser dans le chat
                <ArrowRight size={11} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit modal — rendered outside expanded body so it works regardless */}
      {state === 'editing' && (
        <TranscriptEditor
          label={entry.label}
          transcript={entry.transcript}
          isEdited={entry.isEdited}
          onSave={saveEdit}
          onClose={() => setState('done')}
        />
      )}
    </div>
  )
}
