'use client'

import { useRef, useState } from 'react'
import { CVData, Experience, Education } from '@/types/cv'

interface Props {
  cvData: CVData | null
  onUpdateCV: (data: CVData) => void
  photo: string | null
  onSetPhoto: (dataUrl: string | null) => void
}

export default function DataEditor({ cvData, onUpdateCV, photo, onSetPhoto }: Props) {
  const photoRef = useRef<HTMLInputElement>(null)
  const [expandedExp, setExpandedExp] = useState<number | null>(null)
  const [expandedEdu, setExpandedEdu] = useState<number | null>(null)
  const [newSkill, setNewSkill] = useState('')
  const [newLang, setNewLang] = useState('')
  const [newHobby, setNewHobby] = useState('')
  const [newContact, setNewContact] = useState('')

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

  /* ── Education helpers ── */
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
  function addContact(val: string) {
    if (!val.trim()) return
    update({ contact: [...cvData!.contact, val.trim()] })
    setNewContact('')
  }
  function removeContact(i: number) {
    update({ contact: cvData!.contact.filter((_, idx) => idx !== i) })
  }

  return (
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
        <textarea
          value={cvData.summary}
          onChange={e => update({ summary: e.target.value })}
          rows={4}
          className={`${inputCls} w-full resize-none`}
          placeholder="Décrivez votre profil en quelques phrases…"
        />
      </Section>

      {/* ── Expériences ── */}
      <Section title="Expériences" onAdd={addExp}>
        {cvData.experience.length === 0 && (
          <p className="text-xs text-[#9D9C98] font-body italic">Aucune expérience. Cliquez sur + pour en ajouter.</p>
        )}
        {cvData.experience.map((exp, i) => (
          <div key={i} className="border border-[#E5E4E0] rounded-md bg-white overflow-hidden mb-2">
            <button
              onClick={() => setExpandedExp(expandedExp === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#FAFAF8] transition-colors text-left"
            >
              <div className="min-w-0">
                <span className="text-sm font-body font-medium text-[#1A1A18] truncate block">
                  {exp.title || <span className="text-[#9D9C98] italic">Sans titre</span>}
                </span>
                <span className="text-xs font-body text-[#6B6A66]">{exp.company}{exp.date ? ` · ${exp.date}` : ''}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-[#9D9C98] shrink-0 ml-2 transition-transform ${expandedExp === i ? 'rotate-180' : ''}`}>
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
                    <div key={j} className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={b}
                        onChange={e => updateBullet(i, j, e.target.value)}
                        className={`${inputCls} flex-1`}
                        placeholder="Ex: Développé une feature X réduisant Y de 30%"
                      />
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
          <div key={i} className="border border-[#E5E4E0] rounded-md bg-white overflow-hidden mb-2">
            <button
              onClick={() => setExpandedEdu(expandedEdu === i ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#FAFAF8] transition-colors text-left"
            >
              <div className="min-w-0">
                <span className="text-sm font-body font-medium text-[#1A1A18] truncate block">
                  {edu.degree || <span className="text-[#9D9C98] italic">Sans titre</span>}
                </span>
                <span className="text-xs font-body text-[#6B6A66]">{edu.school}{edu.date ? ` · ${edu.date}` : ''}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-[#9D9C98] shrink-0 ml-2 transition-transform ${expandedEdu === i ? 'rotate-180' : ''}`}>
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
        <TagList
          tags={cvData.skills}
          onRemove={i => removeTag('skills', i)}
          color="bg-[#F4F3F0] text-[#1A1A18] border-[#E5E4E0]"
        />
        <TagInput value={newSkill} onChange={setNewSkill} onAdd={() => addTag('skills', newSkill, setNewSkill)} placeholder="Ex: React, Python…" />
      </Section>

      {/* ── Langues ── */}
      <Section title="Langues">
        <TagList
          tags={cvData.languages}
          onRemove={i => removeTag('languages', i)}
          color="bg-[#D8EDDF] text-[#1B4332] border-[#A7D9B8]"
        />
        <TagInput value={newLang} onChange={setNewLang} onAdd={() => addTag('languages', newLang, setNewLang)} placeholder="Ex: Français — Natif" />
      </Section>

      {/* ── Hobbies ── */}
      <Section title="Hobbies & Passions">
        <TagList
          tags={cvData.hobbies ?? []}
          onRemove={i => removeTag('hobbies', i)}
          color="bg-[#FDF3DC] text-[#B45309] border-[#E8A838]"
        />
        <TagInput value={newHobby} onChange={setNewHobby} onAdd={() => addTag('hobbies', newHobby, setNewHobby)} placeholder="Ex: Photographie, Running…" />
      </Section>
    </div>
  )
}

/* ── Shared sub-components ── */

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

function TagList({ tags, onRemove, color }: { tags: string[]; onRemove: (i: number) => void; color: string }) {
  if (tags.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mb-2">
      {tags.map((t, i) => (
        <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded text-xs font-body ${color}`}>
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
