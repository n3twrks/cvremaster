'use client'

import { CVData } from '@/types/cv'

interface Props {
  cvData: CVData | null
}

export default function CVPreview({ cvData }: Props) {
  if (!cvData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAF8] overflow-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-lg bg-[#F4F3F0] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[#9D9C98]">
              <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10" y1="14" x2="22" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10" y1="18" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[#6B6A66] text-sm font-body">Importez votre CV PDF ou commencez à chatter</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-[#F4F3F0] p-6 print:p-0 print:bg-white">
      <div
        id="cv-content"
        className="max-w-[780px] mx-auto bg-white border border-[#E5E4E0] shadow-sm p-10 print:shadow-none print:border-none print:max-w-full print:p-0"
      >
        {/* Header */}
        <div className="mb-6 pb-6 border-b border-[#E5E4E0]">
          <h1 className="font-display text-4xl text-[#1A1A18] leading-tight tracking-tight mb-1">
            {cvData.name}
          </h1>
          {cvData.tagline && (
            <p className="text-[#6B6A66] text-lg font-body mt-1">{cvData.tagline}</p>
          )}
          {cvData.contact.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {cvData.contact.map((c, i) => (
                <span key={i} className="text-sm font-mono text-[#6B6A66]">{c}</span>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {cvData.summary && (
          <section className="mb-6">
            <h2 className="font-display text-lg text-[#1B4332] mb-2 uppercase tracking-widest text-xs font-body font-medium">
              Résumé
            </h2>
            <p className="text-[#1A1A18] text-sm font-body leading-relaxed">{cvData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-3">
              Expérience
            </h2>
            <div className="space-y-5">
              {cvData.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <span className="font-body font-medium text-[#1A1A18] text-sm">{exp.title}</span>
                      <span className="text-[#6B6A66] text-sm font-body"> · {exp.company}</span>
                      {exp.location && (
                        <span className="text-[#9D9C98] text-sm font-body"> · {exp.location}</span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-[#9D9C98] whitespace-nowrap shrink-0">{exp.date}</span>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="text-sm text-[#1A1A18] font-body leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <section className="mb-6">
            <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-3">
              Formation
            </h2>
            <div className="space-y-3">
              {cvData.education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-body font-medium text-[#1A1A18] text-sm">{edu.degree}</span>
                    <span className="text-[#6B6A66] text-sm font-body"> · {edu.school}</span>
                  </div>
                  <span className="font-mono text-xs text-[#9D9C98] whitespace-nowrap shrink-0">{edu.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Languages */}
        {(cvData.skills.length > 0 || cvData.languages.length > 0) && (
          <section className="grid grid-cols-2 gap-6 mb-6">
            {cvData.skills.length > 0 && (
              <div>
                <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-2">
                  Compétences
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {cvData.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#F4F3F0] border border-[#E5E4E0] text-[#1A1A18] text-xs font-body rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {cvData.languages.length > 0 && (
              <div>
                <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-2">
                  Langues
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {cvData.languages.map((l, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#D8EDDF] border border-[#A7D9B8] text-[#1B4332] text-xs font-body rounded">
                      {l.name}{l.level ? ` — ${l.level}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Hobbies & Passions */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <section>
            <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-2">
              Hobbies & Passions
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {cvData.hobbies.map((h, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#FDF3DC] border border-[#E8A838] text-[#B45309] text-xs font-body rounded">
                  {h}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
