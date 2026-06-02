import { CVData } from '@/types/cv'
import { getSectionLabels } from '@/lib/sectionLabels'
import { ContactItem } from './utils'

interface Props { cvData: CVData; language?: string; spacingScale?: number }

const NAVY = '#2B3547'
const NAVY_TEXT = '#FFFFFF'
const NAVY_MUTED = '#94A3B8'

export default function NavyDarkTemplate({ cvData, language, spacingScale = 1 }: Props) {
  const L = getSectionLabels(language)
  const S = spacingScale
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: 'Georgia, serif' }}
    >
      <div style={{ width: '30%', background: NAVY, color: NAVY_TEXT, padding: `${28 * S}px 18px`, flexShrink: 0 }}>
        {/* Circular photo — hidden entirely when not set */}
        {cvData.photo && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <img
              src={cvData.photo}
              alt="Photo"
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${NAVY_MUTED}` }}
            />
          </div>
        )}

        {/* Contact */}
        {cvData.contact.length > 0 && (
          <SideSection title={L.contact} navy={NAVY} muted={NAVY_MUTED} scale={S}>
            {cvData.contact.map((c, i) => (
              <ContactItem key={i} text={c} style={{ display: 'block', fontSize: 10, color: NAVY_MUTED, marginBottom: 5, lineHeight: 1.4 }} />
            ))}
          </SideSection>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <SideSection title={L.education} navy={NAVY} muted={NAVY_MUTED} scale={S}>
            {cvData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: NAVY_MUTED }}>{edu.date}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: NAVY_TEXT }}>{edu.degree}</div>
                <div style={{ fontSize: 10, color: NAVY_MUTED, fontStyle: 'italic' }}>{edu.school}</div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <SideSection title={L.expertise} navy={NAVY} muted={NAVY_MUTED} scale={S}>
            {cvData.skills.map((s, i) => (
              s.startsWith('## ') ? (
                <div key={i} style={{ fontSize: 9, fontWeight: 700, color: NAVY_TEXT, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6, marginBottom: 2 }}>{s.slice(3)}</div>
              ) : (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: NAVY_MUTED, fontSize: 8 }}>•</span>
                  <span style={{ fontSize: 10, color: NAVY_MUTED }}>{s}</span>
                </div>
              )
            ))}
          </SideSection>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <SideSection title={L.languages} navy={NAVY} muted={NAVY_MUTED} scale={S}>
            {cvData.languages.map((l, i) => (
              <div key={i} style={{ fontSize: 10, color: NAVY_MUTED, marginBottom: 4 }}>
                {l.name}{l.level ? ` — ${l.level}` : ''}
              </div>
            ))}
          </SideSection>
        )}

        {/* Hobbies */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <SideSection title={L.hobbies} navy={NAVY} muted={NAVY_MUTED} scale={S}>
            {cvData.hobbies.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ color: NAVY_MUTED, fontSize: 8 }}>•</span>
                <span style={{ fontSize: 10, color: NAVY_MUTED }}>{h}</span>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      <div style={{ flex: 1, background: '#FFFFFF', padding: `${28 * S}px 28px` }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 8 }}>{cvData.name}</h1>
        {cvData.tagline && (
          <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 12 * S }}>{cvData.tagline}</p>
        )}

        {cvData.summary && (
          <div style={{ marginBottom: 20 * S }}>
            <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>{cvData.summary}</p>
            <div style={{ height: 1, background: '#DDD', marginTop: 14 * S }} />
          </div>
        )}

        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 20 * S }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: NAVY, marginBottom: 12 * S }}>
              {L.experience}
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ display: 'flex', gap: 12, marginBottom: 14 * S }}>
                {/* Timeline dot */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px solid ${NAVY}`, flexShrink: 0 }} />
                  {i < cvData.experience.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: '#DDD', marginTop: 4 }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>{exp.title}</div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>
                    {exp.company}{exp.location && ` | ${exp.location}`} · {exp.date}
                  </div>
                  {exp.bullets.map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <span style={{ color: NAVY, fontSize: 10, marginTop: 2, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SideSection({ title, navy: _navy, muted: _muted, scale = 1, children }: { title: string; navy: string; muted: string; scale?: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 * scale }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#FFFFFF', borderBottom: `1px solid #3D4F68`, paddingBottom: 4, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
