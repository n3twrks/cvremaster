'use client'

import { useState, useRef, useEffect } from 'react'
import { CVData } from '@/types/cv'
import TemplateRenderer from './TemplateRenderer'
import { findEntryBreak, RENDER_WIDTH, SCREEN_PAGE_H } from '@/lib/exportPDF'

const A4_H_PX = SCREEN_PAGE_H   // ≈ 1123 — must match PDF export page height
const A4_W_PX = RENDER_WIDTH     // 794 — must match PDF render width

interface Props {
  cvData: CVData | null
  templateId: string
  language?: string
}

export default function CenterPanel({ cvData, templateId, language }: Props) {
  const [viewMode, setViewMode] = useState<'continuous' | 'a4'>('continuous')
  const a4WrapRef = useRef<HTMLDivElement>(null)

  if (!cvData) {
    return (
      <div className="flex-1 overflow-auto bg-[#F4F3F0] p-6 flex items-center justify-center">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* View mode toggle */}
      <div className="flex items-center justify-center py-2 bg-[#EDEDE9] border-b border-[#E5E4E0] shrink-0">
        <div className="inline-flex rounded-full bg-[#E0DFDB] p-0.5 text-xs font-medium">
          <button
            onClick={() => setViewMode('continuous')}
            className={`px-3 py-1 rounded-full transition-all duration-150 ${
              viewMode === 'continuous'
                ? 'bg-white shadow-sm text-[#1A1A18]'
                : 'text-[#6B6A66] hover:text-[#1A1A18]'
            }`}
          >
            Continu
          </button>
          <button
            onClick={() => setViewMode('a4')}
            className={`px-3 py-1 rounded-full transition-all duration-150 ${
              viewMode === 'a4'
                ? 'bg-white shadow-sm text-[#1A1A18]'
                : 'text-[#6B6A66] hover:text-[#1A1A18]'
            }`}
          >
            Pages A4
          </button>
        </div>
      </div>

      {viewMode === 'continuous' ? (
        <div className="flex-1 overflow-auto bg-[#F4F3F0] p-6 print:p-0 print:bg-white">
          <TemplateRenderer cvData={cvData} templateId={templateId} language={language} />
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-[#6E6E6E] py-6 print:p-0 print:bg-white">
          {/*
            Single render at A4 width — no clipping, no pagination.
            Page breaks shown as dashed separator lines computed via element scanning.
            First in DOM → document.getElementById('cv-content') returns this for PDF export.
          */}
          <div
            ref={a4WrapRef}
            style={{ width: A4_W_PX, margin: '0 auto', position: 'relative' }}
          >
            <TemplateRenderer cvData={cvData} templateId={templateId} language={language} />
            <PageSeparators wrapperRef={a4WrapRef} />
          </div>
        </div>
      )}
    </div>
  )
}

// ---- Page separator overlay ----

function PageSeparators({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const [breaks, setBreaks] = useState<number[]>([])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    function compute() {
      const w = wrapperRef.current
      if (!w) return
      const total = w.scrollHeight
      const result: number[] = []
      let baseY = A4_H_PX
      while (baseY < total) {
        const safe = findSafeBreak(w, baseY)
        result.push(safe)
        baseY = safe + A4_H_PX
      }
      setBreaks(result)
    }

    const raf = requestAnimationFrame(compute)
    const ro = new ResizeObserver(compute)
    ro.observe(wrapper)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [wrapperRef])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {breaks.map((y, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: y,
            borderTop: '2px dashed rgba(220,40,40,0.45)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              right: -28,
              top: -9,
              fontSize: 9,
              fontFamily: 'system-ui, sans-serif',
              color: 'rgba(220,40,40,0.7)',
              fontWeight: 700,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {i + 2}
          </span>
        </div>
      ))}
    </div>
  )
}

function findSafeBreak(wrapper: HTMLElement, idealY: number): number {
  const wRect = wrapper.getBoundingClientRect()
  const bounds = Array.from(wrapper.querySelectorAll<HTMLElement>('.entry')).map(e => {
    const r = e.getBoundingClientRect()
    return { top: r.top - wRect.top, bottom: r.bottom - wRect.top }
  })
  return findEntryBreak(bounds, idealY)
}

function EmptyState() {
  return (
    <div className="text-center space-y-3">
      <div className="w-16 h-16 mx-auto rounded-lg bg-[#F4F3F0] border border-[#E5E4E0] flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[#9D9C98]">
          <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="18" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-[#6B6A66] text-sm font-body">Importez votre CV PDF ou commencez à chatter</p>
    </div>
  )
}
