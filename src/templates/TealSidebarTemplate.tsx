import { CVData } from '@/types/cv'
import { getSectionLabels } from '@/lib/sectionLabels'
import { SegmentBar, ContactItem } from './utils'

interface Props { cvData: CVData; language?: string; spacingScale?: number }

const TEAL = '#3DBDB3'

export default function TealSidebarTemplate({ cvData, language, spacingScale = 1 }: Props) {
  const L = getSectionLabels(language)
  const S = spacingScale
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto bg-white shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Left sidebar */}
      <div style={{ width: '30%', background: '#FAFAFA', borderRight: `3px solid ${TEAL}`, padding: `${20 * S}px 16px`, flexShrink: 0 }}>
        {/* Photo — hidden entirely when not set */}
        {cvData.photo && (
          <img
            src={cvData.photo}
            alt="Photo"
            style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', marginBottom: 16, display: 'block', border: `2px solid ${TEAL}` }}
          />
        )}

        {cvData.contact.length > 0 && (
          <div style={{ marginBottom: 14 * S, paddingBottom: 14 * S, borderBottom: `1px solid ${TEAL}` }}>
            {cvData.contact.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                <span style={{ color: TEAL, fontSize: 10, marginTop: 2, flexShrink: 0 }}>◆</span>
                <ContactItem text={c} style={{ fontSize: 10, color: '#555', lineHeight: 1.4, wordBreak: 'break-word' }} />
              </div>
            ))}
          </div>
        )}

        {cvData.skills.length > 0 && (
          <div style={{ marginBottom: 14 * S, paddingBottom: 14 * S, borderBottom: `1px solid ${TEAL}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
              {L.skills}
            </div>
            {cvData.skills.map((s, i) => (
              s.startsWith('## ') ? (
                <div key={i} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: TEAL, marginTop: 6, marginBottom: 2 }}>{s.slice(3)}</div>
              ) : (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <span style={{ color: TEAL, fontSize: 8 }}>•</span>
                  <span style={{ fontSize: 10, color: '#555' }}>{s}</span>
                </div>
              )
            ))}
          </div>
        )}

        {cvData.languages.length > 0 && (
          <div style={{ marginBottom: 14 * S }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
              {L.languages}
            </div>
            {cvData.languages.map((lang, i) => (
              <div key={i} style={{ marginBottom: 8 * S }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>{lang.name}</span>
                  <span style={{ fontSize: 9, color: '#888' }}>{lang.level}</span>
                </div>
                <SegmentBar score={lang.score} filled={TEAL} empty="#DDD" />
              </div>
            ))}
          </div>
        )}

        {/* Hobbies */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <div style={{ paddingTop: 16, borderTop: `1px solid ${TEAL}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
              {L.hobbies}
            </div>
            {cvData.hobbies.map((h, i) => (
              <div key={i} style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>{h}</div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: `${22 * S}px 24px` }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#333', marginBottom: 6 }}>{cvData.name}</h1>
        {cvData.tagline && (
          <p style={{ fontSize: 12, color: TEAL, fontWeight: 600, marginBottom: 12 * S }}>{cvData.tagline}</p>
        )}

        {cvData.summary && (
          <div style={{ background: '#F8FFFE', borderLeft: `3px solid ${TEAL}`, padding: '10px 12px', marginBottom: 16 * S, fontSize: 11, color: '#555', lineHeight: 1.5 }}>
            {cvData.summary}
          </div>
        )}

        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 16 * S }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: `2px solid ${TEAL}`, paddingBottom: 4, marginBottom: 10 * S }}>
              {L.experience}
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ display: 'flex', gap: 10, marginBottom: 14 * S }}>
                {/* Rotated date */}
                <div style={{ flexShrink: 0, width: 40, display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>
                  <span style={{
                    fontSize: 8,
                    color: TEAL,
                    fontWeight: 700,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                  }}>
                    {exp.date}
                  </span>
                </div>
                <div style={{ flex: 1, borderLeft: `1px solid #EEE`, paddingLeft: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: '#333', marginBottom: 1 }}>{exp.title}</div>
                  <div style={{ fontSize: 11, fontStyle: 'italic', color: '#666', marginBottom: 6 }}>
                    {exp.company}{exp.location && ` — ${exp.location}`}
                  </div>
                  {exp.bullets.map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                      <span style={{ color: TEAL, fontSize: 10, marginTop: 1, flexShrink: 0 }}>◆</span>
                      <span style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {cvData.education.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: `2px solid ${TEAL}`, paddingBottom: 4, marginBottom: 10 * S }}>
              {L.education}
            </div>
            {cvData.education.map((edu, i) => (
              <div key={i} className="entry" style={{ marginBottom: 8 * S }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 1 }}>{edu.date}</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#333' }}>{edu.degree}</div>
                <div style={{ fontSize: 11, fontStyle: 'italic', color: '#666' }}>{edu.school}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
