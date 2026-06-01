'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { CVProject } from '@/lib/projectStorage'

interface Props {
  project: CVProject
  onRename: (id: string, name: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

// Deterministic pastel color from project id
function projectColor(id: string): string {
  const PALETTE = [
    '#D8EDDF', '#DBEAFE', '#FDE8D8', '#F3E8FF',
    '#FEF3C7', '#FCE7F3', '#DCFCE7', '#E0F2FE',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

function projectTextColor(id: string): string {
  const PALETTE = [
    '#1B4332', '#1E40AF', '#92400E', '#6B21A8',
    '#B45309', '#9D174D', '#166534', '#0C4A6E',
  ]
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)

  if (diffMin < 2) return "À l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffH < 24) return `Il y a ${diffH}h`
  if (diffD === 1) return 'Hier'
  if (diffD < 7) return `Il y a ${diffD} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function ProjectCard({ project, onRename, onDuplicate, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(project.name)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const renameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [menuOpen])

  useEffect(() => {
    if (renaming) renameRef.current?.focus()
  }, [renaming])

  function submitRename() {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== project.name) onRename(project.id, trimmed)
    setRenaming(false)
  }

  const bg = projectColor(project.id)
  const fg = projectTextColor(project.id)

  return (
    <div className="group relative flex flex-col bg-white border border-[#E5E4E0] rounded-xl p-4 hover:border-[#CCCBC6] hover:shadow-sm transition-all duration-150">

      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3 text-base font-display font-semibold select-none"
        style={{ backgroundColor: bg, color: fg }}
      >
        {initials(project.name)}
      </div>

      {/* Name */}
      {renaming ? (
        <input
          ref={renameRef}
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
          onBlur={submitRename}
          onKeyDown={e => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setRenaming(false) }}
          className="text-sm font-body font-medium text-[#1A1A18] border-b border-[#1B4332] bg-transparent focus:outline-none mb-0.5 w-full"
        />
      ) : (
        <p
          className="text-sm font-body font-medium text-[#1A1A18] truncate mb-0.5 cursor-default"
          onDoubleClick={() => { setRenameValue(project.name); setRenaming(true) }}
          title={project.name}
        >
          {project.name}
        </p>
      )}

      {/* Tagline */}
      <p className="text-xs font-body text-[#9D9C98] truncate mb-3 min-h-[1rem]">
        {project.tagline || <span className="italic">Aucun contenu</span>}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] font-mono text-[#9D9C98]">{formatDate(project.lastModified)}</span>
        <Link
          href={`/cv?project=${project.id}`}
          className="px-3 py-1.5 rounded-md bg-[#1B4332] text-[#FAFAF8] text-xs font-body font-medium hover:bg-[#163A2B] transition-colors"
        >
          Ouvrir
        </Link>
      </div>

      {/* Context menu button */}
      <div ref={menuRef} className="absolute top-3 right-3">
        <button
          onClick={() => { setMenuOpen(v => !v); setConfirmDelete(false) }}
          className="w-6 h-6 flex items-center justify-center rounded text-[#9D9C98] hover:text-[#1A1A18] hover:bg-[#F4F3F0] transition-colors opacity-0 group-hover:opacity-100"
          title="Options"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="2" r="1.2" />
            <circle cx="7" cy="7" r="1.2" />
            <circle cx="7" cy="12" r="1.2" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-[#E5E4E0] rounded-lg shadow-lg z-50 py-1">
            <button
              onClick={() => { setMenuOpen(false); setRenameValue(project.name); setRenaming(true) }}
              className="w-full text-left px-3 py-2 text-xs font-body text-[#1A1A18] hover:bg-[#F4F3F0] transition-colors"
            >
              Renommer
            </button>
            <button
              onClick={() => { setMenuOpen(false); onDuplicate(project.id) }}
              className="w-full text-left px-3 py-2 text-xs font-body text-[#1A1A18] hover:bg-[#F4F3F0] transition-colors"
            >
              Dupliquer
            </button>
            <div className="border-t border-[#F4F3F0] my-1" />
            {confirmDelete ? (
              <div className="px-3 py-2">
                <p className="text-[11px] font-body text-[#9B1C1C] mb-2">Supprimer définitivement ?</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => { setMenuOpen(false); setConfirmDelete(false); onDelete(project.id) }}
                    className="flex-1 py-1 rounded bg-red-500 text-white text-[11px] font-body hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-1 rounded bg-[#F4F3F0] text-[#1A1A18] text-[11px] font-body hover:bg-[#E5E4E0] transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full text-left px-3 py-2 text-xs font-body text-red-500 hover:bg-red-50 transition-colors"
              >
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
