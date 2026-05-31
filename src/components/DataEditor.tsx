'use client'

import { useRef, useState } from 'react'
import { CVData, Experience, Education } from '@/types/cv'

interface Props {
  cvData: CVData | null
  onUpdateCV: (data: CVData) => void
  photo: string | null
  onSetPhoto: (dataUrl: string | null) => void
  showPhoto: boolean
  onSetShowPhoto: (v: boolean) => void
}

export default function DataEditor({ cvData, onUpdateCV, photo, onSetPhoto, showPhoto, onSetShowPhoto }: Props) {
  const photoRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogSaveRef = useRef<((val: string) => void) | null>(null)
  const dragExpIdx = useRef<number | null>(null)
  const dragEduIdx = useRef<number | null>(null)
  const skillDragIdx = useRef<number | null>(null)
  const [expandedExp, setExpandedExp] = useState<number | null>(null)
  const [expandedEdu, setExpandedEdu] = useState<number | null>(null)
  const [dragOverExp, setDragOverExp] = useState<number | null>(null)
  const [dragOverEdu, setDragOverEdu] = useState<number | null>(null)
  const [skillDragOver, setSkillDragOver] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const [newGroupName, setNewGroupName] = useState('')
  const [newLang, setNewLang] = useState('')
  const [newHobby, setNewHobby] = useState('')
  const [newContact, setNewContact] = useState('')
  const [dialogText, setDialogText] = useState('')

  if (!cvData) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#6B6A66] text-sm font-body text-center">
          Importez un CV ou commencez à chatter pour créer votre CV, puis éditez ici.
        </p>
      </div>
    )
  }

  function update(partial: Partial<CVData>) {
    onUpdateCV({ ...cvData!, ...partial })
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = ev => {
      if (typeof ev.target?.result === 'string') onSetPhoto(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function openDialog(initial: string, onSave: (val: string) => void) {
    setDialogText(initial)
    dialogSaveRef.current = onSave
    dialogRef.current?.showModal()
  }

  function closeDialog(save: boolean) {
    if (save && dialogSaveRef.current) dialogSaveRef.current(dialogText)
    dialogSaveRef.current = null
    dialogRef.current?.close()
  }

  /* ── Experience helpers ── */
  function updateExp(i: number, partial: Partial<Experience>) {
    const updated = cvData!.experience.map((e, idx) => idx === i ? { ...e, ...partial } : e)
    update({ experience: updated })
  }
  function deleteExp(i: number) {
    update({ experience: cvData!.experience.filter((_, idx) => idx !== i) })
    setExpandedExp(null)
  }
  function addExp() {
    const blank: Experience = { title: '', company: '', date: '', bullets: [] }
    update({ experience: [...cvData!.experience, blank] })
    setExpandedExp(cvData!.experience.length)
  }
  function updateBullet(expIdx: number, bIdx: number, val: string) {
    const bullets = cvData!.experience[expIdx].bullets.map((b, i) => i === bIdx ? val : b)
    updateExp(expIdx, { bullets })
  }
  function addBullet(expIdx: number) {
    updateExp(expIdx, { bullets: [...cvData!.experience[expIdx].bullets, ''] })
  }
  function deleteBullet(expIdx: number, bIdx: number) {
    updateExp(expIdx, { bullets: cvData!.experience[expIdx].bullets.filter((_, i) => i !== bIdx) })
  }
  function moveExp(from: number, to: number) {
    if (from === to) return
    const list = [...cvData!.experience]
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    update({ experience: list })
    if (expandedExp === from) setExpandedExp(to)
    else if (expandedExp !== null) {
      if (from < to && expandedExp > from && expandedExp <= to) setExpandedExp(expandedExp - 1)
      else if (from > to && expandedExp >= to && expandedExp < from) setExpandedExp(expandedExp + 1)
    }
  }

  /* ── Education helpers ── */
  function moveEdu(from: number, to: number) {
    if (from === to) return
    const list = [...cvData!.education]
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    update({ education: list })
    if (expandedEdu === from) setExpandedEdu(to)
    else if (expandedEdu !== null) {
      if (from < to && expandedEdu > from && expandedEdu <= to) setExpandedEdu(expandedEdu - 1)
      else if (from > to && expandedEdu >= to && expandedEdu < from) setExpandedEdu(expandedEdu + 1)
    }
  }
  function updateEdu(i: number, partial: Partial<Education>) {
    const updated = cvData!.education.map((e, idx) => idx === i ? { ...e, ...partial } : e)
    update({ education: updated })
  }
  function deleteEdu(i: number) {
    update({ education: cvData!.education.filter((_, idx) => idx !== i) })
    setExpandedEdu(null)
  }
  function addEdu() {
    update({ education: [...cvData!.education, { school: '', degree: '', date: '' }] })
    setExpandedEdu(cvData!.education.length)
  }

  /* ── Tag helpers ── */
  function addTag(field: 'skills' | 'languages' | 'hobbies', val: string, setter: (v: string) => void) {
    if (!val.trim()) return
    const current = (cvData![field] ?? []) as string[]
    update({ [field]: [...current, val.trim()] })
    setter('')
  }
  function removeTag(field: 'skills' | 'languages' | 'hobbies', i: number) {
    const current = (cvData![field] ?? []) as string[]
    update({ [field]: current.filter((_, idx) => idx !== i) })
  }
  function reorderTag(field: 'skills' | 'languages' | 'hobbies', from: number, to: number) {
    if (from === to) return
    const list = [...(cvData![field] ?? [])] as string[]
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    update({ [field]: list })
  }
  function addGroupHeader() {
    if (!newGroupName.trim()) return
    update({ skills: [...cvData!.skills, `## ${newGroupName.trim()}`] })
    setNewGroupName('')
  }
  function addContact(val: string) {
    if (!val.trim()) return
    update({ contact: [...cvData!.contact, val.trim()] })
    setNewContact('')
  }
  function removeContact(i: number) {
    update({ contact: cvData!.contact.filter((_, idx) => idx !== i) })
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-[#F4F3F0] p-6 space-y-4">

        {/* ── Identité ── */}
        <Section title="Identité">
          <div className="flex gap-4 items-start">
            {/* Photo */}
            <div className="shrink-0">
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              <div
                onClick={() => photoRef.current?.click()}
                className="w-20 h-20 rounded-md border-2 border-dashed border-[#CCCBC6] bg-[#FAFAF8] flex items-center justify-center cursor-pointer hover:border-[#1B4332] hover:bg-[#F0FAF3] transition-colors relative overflow-hidden"
              >
                {photo ? (
                  <img src={photo} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#9D9C98]">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M3 17c0-4 3-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    <span className="text-[10px] font-body leading-tight text-center">Photo</span>
                  </div>
                )}
              </div>
              {photo && (
                <button
                  onClick={() => onSetPhoto(null)}
                  className="mt-1 text-[10px] font-body text-[#9D9C98] hover:text-red-500 w-full text-center transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>
            {/* Name + tagline */}
            <div className="flex-1 space-y-2">
              <Field label="Nom complet">
                <input
                  type="text"
                  value={cvData.name}
                  onChange={e => update({ name: e.target.value })}
                  className={inputCls}
                  placeholder="Prénom Nom"
                />
              </Field>
              <Field label="Titre / Poste">
                <input
                  type="text"
                  value={cvData.tagline}
                  onChange={e => update({ tagline: e.target.value })}
                  className={inputCls}
                  placeholder="Ex: Développeur Full Stack"
                />
              </Field>
            </div>
          </div>
          {/* Show photo toggle */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F4F3F0]">
            <span className="text-[11px] font-body text-[#6B6A66]">Afficher la photo sur le CV</span>
            <button
              onClick={() => onSetShowPhoto(!showPhoto)}
              role="switch"
              aria-checked={showPhoto}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-1 ${showPhoto ? 'bg-[#1B4332]' : 'bg-[#CCCBC6]'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${showPhoto ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Section>

        {/* ── Contact ── */}
        <Section title="Contact">
          <div className="space-y-1.5 mb-2">
            {cvData.contact.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={c}
                  onChange={e => {
                    const updated = cvData.contact.map((x, idx) => idx === i ? e.target.value : x)
                    update({ contact: updated })
                  }}
                  className={`${inputCls} flex-1`}
                />
                <button onClick={() => removeContact(i)} className={deleteBtnCls}>×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newContact}
              onChange={e => setNewContact(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addContact(newContact)}
              className={`${inputCls} flex-1`}
              placeholder="Ex: email@exemple.com"
            />
            <button onClick={() => addContact(newContact)} className={addBtnCls}>+ Ajouter</button>
          </div>
        </Section>

        {/* ── Résumé ── */}
        <Section title="Résumé">
          <div className="relative">
            <textarea
              value={cvData.summary}
              onChange={e => update({ summary: e.target.value })}
              rows={4}
              className={`${inputCls} w-full resize-none pr-8`}
              placeholder="Décrivez votre profil en quelques phrases…"
            />
            <button
              onClick={() => openDialog(cvData.summary, val => update({ summary: val }))}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-[#9D9C98] hover:text-[#1B4332] transition-colors"
              title="Agrandir"
            >
              <ExpandIcon />
            </button>
          </div>
        </Section>

        {/* ── Expériences ── */}
        <Section title="Expériences" onAdd={addExp}>
          {cvData.experience.length === 0 && (
            <p className="text-xs text-[#9D9C98] font-body italic">Aucune expérience. Cliquez sur + pour en ajouter.</p>
          )}
          {cvData.experience.map((exp, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => { dragExpIdx.current = i }}
              onDragOver={e => { e.preventDefault(); if (dragExpIdx.current !== i) setDragOverExp(i) }}
              onDrop={() => { if (dragExpIdx.current !== null) moveExp(dragExpIdx.current, i); dragExpIdx.current = null; setDragOverExp(null) }}
              onDragEnd={() => { dragExpIdx.current = null; setDragOverExp(null) }}
              onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverExp(null) }}
              className={`group border rounded-md bg-white overflow-hidden mb-2 transition-colors ${dragOverExp === i ? 'border-[#1B4332] shadow-sm' : 'border-[#E5E4E0]'}`}
            >
              <button
                onClick={() => setExpandedExp(expandedExp === i ? null : i)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#FAFAF8] transition-colors text-left"
              >
                <span className="shrink-0 text-[#CCCBC6] group-hover:text-[#9D9C98] transition-colors cursor-grab active:cursor-grabbing select-none">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                    <circle cx="2.5" cy="2" r="1.2"/><circle cx="7.5" cy="2" r="1.2"/>
                    <circle cx="2.5" cy="7" r="1.2"/><circle cx="7.5" cy="7" r="1.2"/>
                    <circle cx="2.5" cy="12" r="1.2"/><circle cx="7.5" cy="12" r="1.2"/>
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-body font-medium text-[#1A1A18] truncate block">
                    {exp.title || <span className="text-[#9D9C98] italic">Sans titre</span>}
                  </span>
                  <span className="text-xs font-body text-[#6B6A66]">{exp.company}{exp.date ? ` · ${exp.date}` : ''}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-[#9D9C98] shrink-0 transition-transform ${expandedExp === i ? 'rotate-180' : ''}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {expandedExp === i && (
                <div className="px-3 pb-3 pt-1 border-t border-[#F4F3F0] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Poste">
                      <input type="text" value={exp.title} onChange={e => updateExp(i, { title: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Entreprise">
                      <input type="text" value={exp.company} onChange={e => updateExp(i, { company: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Lieu">
                      <input type="text" value={exp.location ?? ''} onChange={e => updateExp(i, { location: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Période">
                      <input type="text" value={exp.date} onChange={e => updateExp(i, { date: e.target.value })} className={inputCls} placeholder="Jan 2022 – Présent" />
                    </Field>
                  </div>
                  <Field label="Points clés">
                    {exp.bullets.map((b, j) => (
                      <div key={j} className="flex items-center gap-1.5 mb-1">
                        <input
                          type="text"
                          value={b}
                          onChange={e => updateBullet(i, j, e.target.value)}
                          className={`${inputCls} flex-1`}
                          placeholder="Ex: Développé une feature X réduisant Y de 30%"
                        />
                        <button
                          onClick={() => openDialog(b, val => updateBullet(i, j, val))}
                          className="w-6 h-6 shrink-0 flex items-center justify-center text-[#9D9C98] hover:text-[#1B4332] transition-colors"
                          title="Agrandir"
                        >
                          <ExpandIcon size={10} />
                        </button>
                        <button onClick={() => deleteBullet(i, j)} className={deleteBtnCls}>×</button>
                      </div>
                    ))}
                    <button onClick={() => addBullet(i)} className="text-xs font-body text-[#1B4332] hover:text-[#163A2B] mt-1">+ Ajouter un point</button>
                  </Field>
                  <div className="flex justify-end pt-1">
                    <button onClick={() => deleteExp(i)} className="text-xs font-body text-red-500 hover:text-red-700 transition-colors">
                      Supprimer cette expérience
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Section>

        {/* ── Formation ── */}
        <Section title="Formations" onAdd={addEdu}>
          {cvData.education.length === 0 && (
            <p className="text-xs text-[#9D9C98] font-body italic">Aucune formation. Cliquez sur + pour en ajouter.</p>
          )}
          {cvData.education.map((edu, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => { dragEduIdx.current = i }}
              onDragOver={e => { e.preventDefault(); if (dragEduIdx.current !== i) setDragOverEdu(i) }}
              onDrop={() => { if (dragEduIdx.current !== null) moveEdu(dragEduIdx.current, i); dragEduIdx.current = null; setDragOverEdu(null) }}
              onDragEnd={() => { dragEduIdx.current = null; setDragOverEdu(null) }}
              onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverEdu(null) }}
              className={`group border rounded-md bg-white overflow-hidden mb-2 transition-colors ${dragOverEdu === i ? 'border-[#1B4332] shadow-sm' : 'border-[#E5E4E0]'}`}
            >
              <button
                onClick={() => setExpandedEdu(expandedEdu === i ? null : i)}
                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-[#FAFAF8] transition-colors text-left"
              >
                <span className="shrink-0 text-[#CCCBC6] group-hover:text-[#9D9C98] transition-colors cursor-grab active:cursor-grabbing select-none">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                    <circle cx="2.5" cy="2" r="1.2"/><circle cx="7.5" cy="2" r="1.2"/>
                    <circle cx="2.5" cy="7" r="1.2"/><circle cx="7.5" cy="7" r="1.2"/>
                    <circle cx="2.5" cy="12" r="1.2"/><circle cx="7.5" cy="12" r="1.2"/>
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-body font-medium text-[#1A1A18] truncate block">
                    {edu.degree || <span className="text-[#9D9C98] italic">Sans titre</span>}
                  </span>
                  <span className="text-xs font-body text-[#6B6A66]">{edu.school}{edu.date ? ` · ${edu.date}` : ''}</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-[#9D9C98] shrink-0 transition-transform ${expandedEdu === i ? 'rotate-180' : ''}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {expandedEdu === i && (
                <div className="px-3 pb-3 pt-1 border-t border-[#F4F3F0] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Diplôme">
                      <input type="text" value={edu.degree} onChange={e => updateEdu(i, { degree: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="École / Université">
                      <input type="text" value={edu.school} onChange={e => updateEdu(i, { school: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Année">
                      <input type="text" value={edu.date} onChange={e => updateEdu(i, { date: e.target.value })} className={inputCls} placeholder="2020 – 2023" />
                    </Field>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button onClick={() => deleteEdu(i)} className="text-xs font-body text-red-500 hover:text-red-700 transition-colors">
                      Supprimer cette formation
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Section>

        {/* ── Compétences ── */}
        <Section title="Compétences">
          {/* Inline rendering: group headers + draggable skill chips */}
          {cvData.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {cvData.skills.map((s, i) =>
                s.startsWith('## ') ? (
                  <div key={i} className="w-full flex items-center gap-1.5 mt-1 mb-0.5 cursor-grab active:cursor-grabbing select-none"
                    draggable
                    onDragStart={() => { skillDragIdx.current = i }}
                    onDragOver={e => { e.preventDefault(); setSkillDragOver(i) }}
                    onDrop={() => { if (skillDragIdx.current !== null) reorderTag('skills', skillDragIdx.current, i); skillDragIdx.current = null; setSkillDragOver(null) }}
                    onDragEnd={() => { skillDragIdx.current = null; setSkillDragOver(null) }}
                  >
                    <svg width="8" height="11" viewBox="0 0 10 14" fill="#CCCBC6">
                      <circle cx="2.5" cy="2" r="1.2"/><circle cx="7.5" cy="2" r="1.2"/>
                      <circle cx="2.5" cy="7" r="1.2"/><circle cx="7.5" cy="7" r="1.2"/>
                      <circle cx="2.5" cy="12" r="1.2"/><circle cx="7.5" cy="12" r="1.2"/>
                    </svg>
                    <span className="text-[10px] font-body font-semibold text-[#1B4332] uppercase tracking-widest">{s.slice(3)}</span>
                    <button onClick={() => removeTag('skills', i)} className="text-[#9D9C98] hover:text-red-500 text-xs leading-none ml-0.5">×</button>
                  </div>
                ) : (
                  <span
                    key={i}
                    draggable
                    onDragStart={() => { skillDragIdx.current = i }}
                    onDragOver={e => { e.preventDefault(); setSkillDragOver(i) }}
                    onDrop={() => { if (skillDragIdx.current !== null) reorderTag('skills', skillDragIdx.current, i); skillDragIdx.current = null; setSkillDragOver(null) }}
                    onDragEnd={() => { skillDragIdx.current = null; setSkillDragOver(null) }}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs font-body cursor-grab active:cursor-grabbing bg-[#F4F3F0] text-[#1A1A18] border-[#E5E4E0] transition-shadow ${skillDragOver === i ? 'ring-1 ring-[#1B4332]' : ''}`}
                  >
                    {s}
                    <button onClick={() => removeTag('skills', i)} className="ml-0.5 opacity-60 hover:opacity-100 leading-none">×</button>
                  </span>
                )
              )}
            </div>
          )}
          <TagInput value={newSkill} onChange={setNewSkill} onAdd={() => addTag('skills', newSkill, setNewSkill)} placeholder="Ex: React, Python…" />
          {/* Add group separator */}
          <div className="flex gap-2 mt-1.5 pt-1.5 border-t border-[#F4F3F0]">
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGroupHeader()}
              className={`${inputCls} flex-1`}
              placeholder="Titre du groupe (ex: Technique, Design…)"
            />
            <button onClick={addGroupHeader} className={addBtnCls}>+ Groupe</button>
          </div>
        </Section>

        {/* ── Langues ── */}
        <Section title="Langues">
          <TagList
            tags={cvData.languages}
            onRemove={i => removeTag('languages', i)}
            onReorder={(from, to) => reorderTag('languages', from, to)}
            color="bg-[#D8EDDF] text-[#1B4332] border-[#A7D9B8]"
          />
          <TagInput value={newLang} onChange={setNewLang} onAdd={() => addTag('languages', newLang, setNewLang)} placeholder="Ex: Français — Natif" />
        </Section>

        {/* ── Hobbies ── */}
        <Section title="Hobbies & Passions">
          <TagList
            tags={cvData.hobbies ?? []}
            onRemove={i => removeTag('hobbies', i)}
            onReorder={(from, to) => reorderTag('hobbies', from, to)}
            color="bg-[#FDF3DC] text-[#B45309] border-[#E8A838]"
          />
          <TagInput value={newHobby} onChange={setNewHobby} onAdd={() => addTag('hobbies', newHobby, setNewHobby)} placeholder="Ex: Photographie, Running…" />
        </Section>
      </div>

      {/* ── Expandable field dialog ── */}
      <dialog
        ref={dialogRef}
        onClose={() => { dialogSaveRef.current = null }}
        className="w-[600px] max-w-[90vw] rounded-lg border border-[#E5E4E0] bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-body font-medium text-[#1A1A18]">Modifier le champ</h4>
          <button
            onClick={() => closeDialog(false)}
            className="w-7 h-7 flex items-center justify-center text-[#9D9C98] hover:text-[#1A1A18] hover:bg-[#F4F3F0] rounded-md transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <textarea
          value={dialogText}
          onChange={e => setDialogText(e.target.value)}
          rows={8}
          autoFocus
          className={`${inputCls} w-full resize-y mb-4`}
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => closeDialog(false)} className={addBtnCls}>Annuler</button>
          <button
            onClick={() => closeDialog(true)}
            className="px-4 py-1.5 rounded-md bg-[#1B4332] text-[#FAFAF8] text-sm font-body font-medium hover:bg-[#163A2B] transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </dialog>
    </>
  )
}

/* ── Shared sub-components ── */

function ExpandIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M7.5 1.5H10.5V4.5M4.5 10.5H1.5V7.5M10.5 1.5L7 5M1.5 10.5L5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Section({ title, onAdd, children }: { title: string; onAdd?: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E4E0] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="uppercase tracking-widest text-[11px] font-body font-semibold text-[#1B4332]">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="text-xs font-body text-[#1B4332] hover:text-[#163A2B] border border-[#1B4332] rounded px-2 py-0.5 transition-colors">
            + Ajouter
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-body text-[#6B6A66] mb-1">{label}</label>
      {children}
    </div>
  )
}

function TagList({ tags, onRemove, color, onReorder }: {
  tags: string[]
  onRemove: (i: number) => void
  color: string
  onReorder?: (from: number, to: number) => void
}) {
  const dragIdx = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {tags.map((t, i) => (
        <span
          key={i}
          draggable={!!onReorder}
          onDragStart={() => { if (onReorder) dragIdx.current = i }}
          onDragOver={e => { if (onReorder) { e.preventDefault(); setDragOver(i) } }}
          onDrop={() => { if (onReorder && dragIdx.current !== null) onReorder(dragIdx.current, i); dragIdx.current = null; setDragOver(null) }}
          onDragEnd={() => { dragIdx.current = null; setDragOver(null) }}
          className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs font-body ${color} ${onReorder ? 'cursor-grab active:cursor-grabbing' : ''} ${dragOver === i ? 'ring-1 ring-[#1B4332]' : ''}`}
        >
          {t}
          <button onClick={() => onRemove(i)} className="ml-0.5 opacity-60 hover:opacity-100 leading-none">×</button>
        </span>
      ))}
    </div>
  )
}

function TagInput({ value, onChange, onAdd, placeholder }: { value: string; onChange: (v: string) => void; onAdd: () => void; placeholder: string }) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onAdd()}
        className={`${inputCls} flex-1`}
        placeholder={placeholder}
      />
      <button onClick={onAdd} className={addBtnCls}>+</button>
    </div>
  )
}

const inputCls = 'rounded-md border border-[#CCCBC6] bg-white px-2.5 py-1.5 text-sm font-body text-[#1A1A18] placeholder-[#9D9C98] focus:outline-none focus:border-[#1B4332] transition-colors w-full'
const deleteBtnCls = 'w-6 h-6 shrink-0 flex items-center justify-center text-[#9D9C98] hover:text-red-500 hover:bg-red-50 rounded transition-colors text-base leading-none'
const addBtnCls = 'px-3 py-1.5 rounded-md border border-[#CCCBC6] bg-white text-sm font-body text-[#1A1A18] hover:bg-[#F4F3F0] transition-colors whitespace-nowrap shrink-0'
