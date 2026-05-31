import { CVData } from '@/types/cv'
import { getSectionLabels } from '@/lib/sectionLabels'
import { ContactItem } from './utils'

interface Props { cvData: CVData; language?: string }

export default function ClassicTemplate({ cvData, language }: Props) {
  const L = getSectionLabels(language)
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto bg-white border border-[#E5E4E0] shadow-sm p-10 print:shadow-none print:border-none print:max-w-full print:p-0"
    >
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-[#E5E4E0]">
        <div className="flex items-start gap-6">
          {cvData.photo && (
            <img
              src={cvData.photo}
              alt="Photo"
              className="w-20 h-20 object-cover rounded-sm shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="font-display text-4xl text-[#1A1A18] leading-tight tracking-tight mb-1">
              {cvData.name}
            </h1>
            {cvData.tagline && (
              <p className="text-[#6B6A66] text-lg font-body mt-1">{cvData.tagline}</p>
            )}
            {cvData.contact.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                {cvData.contact.map((c, i) => (
                  <ContactItem key={i} text={c} className="text-sm font-mono text-[#6B6A66]" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {cvData.summary && (
        <section className="mb-6">
          <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-2">
            {L.summary}
          </h2>
          <p className="text-[#1A1A18] text-sm font-body leading-relaxed">{cvData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-3">
            {L.experience}
          </h2>
          <div className="space-y-5">
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry">
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
            {L.education}
          </h2>
          <div className="space-y-3">
            {cvData.education.map((edu, i) => (
              <div key={i} className="entry flex items-start justify-between gap-4">
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
                {L.skills}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.map((s, i) => (
                  s.startsWith('## ') ? (
                    <div key={i} className="w-full mt-1 text-[11px] font-body font-medium text-[#1B4332]">{s.slice(3)}</div>
                  ) : (
                    <span key={i} className="px-2 py-0.5 bg-[#F4F3F0] border border-[#E5E4E0] text-[#1A1A18] text-xs font-body rounded">{s}</span>
                  )
                ))}
              </div>
            </div>
          )}
          {cvData.languages.length > 0 && (
            <div>
              <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-2">
                {L.languages}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cvData.languages.map((l, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#D8EDDF] border border-[#A7D9B8] text-[#1B4332] text-xs font-body rounded">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Hobbies */}
      {cvData.hobbies && cvData.hobbies.length > 0 && (
        <section>
          <h2 className="uppercase tracking-widest text-xs font-body font-medium text-[#1B4332] mb-2">
            {L.hobbies}
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
  )
}
