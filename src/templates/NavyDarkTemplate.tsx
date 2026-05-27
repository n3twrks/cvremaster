import { CVData } from '@/types/cv'

interface Props { cvData: CVData }

const NAVY = '#2B3547'
const NAVY_TEXT = '#FFFFFF'
const NAVY_MUTED = '#94A3B8'

export default function NavyDarkTemplate({ cvData }: Props) {
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: 'Georgia, serif' }}
    >
      {/* Left sidebar */}
      <div style={{ width: '30%', background: NAVY, color: NAVY_TEXT, padding: '32px 18px', flexShrink: 0 }}>
        {/* Circular photo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          {cvData.photo ? (
            <img
              src={cvData.photo}
              alt="Photo"
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${NAVY_MUTED}` }}
            />
          ) : (
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#3D4F68', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${NAVY_MUTED}` }}>
              <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="18" r="10" stroke={NAVY_MUTED} strokeWidth="2" />
                <path d="M6 42c0-10 8-16 18-16s18 6 18 16" stroke={NAVY_MUTED} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Contact */}
        {cvData.contact.length > 0 && (
          <SideSection title="Contact" navy={NAVY} muted={NAVY_MUTED}>
            {cvData.contact.map((c, i) => (
              <div key={i} style={{ fontSize: 10, color: NAVY_MUTED, marginBottom: 5, lineHeight: 1.4 }}>{c}</div>
            ))}
          </SideSection>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <SideSection title="Education" navy={NAVY} muted={NAVY_MUTED}>
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
          <SideSection title="Expertise" navy={NAVY} muted={NAVY_MUTED}>
            {cvData.skills.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ color: NAVY_MUTED, fontSize: 8 }}>•</span>
                <span style={{ fontSize: 10, color: NAVY_MUTED }}>{s}</span>
              </div>
            ))}
          </SideSection>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <SideSection title="Language" navy={NAVY} muted={NAVY_MUTED}>
            {cvData.languages.map((l, i) => (
              <div key={i} style={{ fontSize: 10, color: NAVY_MUTED, marginBottom: 4 }}>{l}</div>
            ))}
          </SideSection>
        )}

        {/* Hobbies */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <SideSection title="Interests" navy={NAVY} muted={NAVY_MUTED}>
            {cvData.hobbies.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ color: NAVY_MUTED, fontSize: 8 }}>•</span>
                <span style={{ fontSize: 10, color: NAVY_MUTED }}>{h}</span>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, background: '#FFFFFF', padding: '32px 28px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 4 }}>{cvData.name}</h1>
        {cvData.tagline && (
          <p style={{ fontSize: 13, color: '#666', fontStyle: 'italic', marginBottom: 12 }}>{cvData.tagline}</p>
        )}

        {/* Summary */}
        {cvData.summary && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{cvData.summary}</p>
            <div style={{ height: 1, background: '#DDD', marginTop: 16 }} />
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: NAVY, marginBottom: 14 }}>
              Experience
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
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

function SideSection({ title, navy: _navy, muted, children }: { title: string; navy: string; muted: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#FFFFFF', borderBottom: `1px solid #3D4F68`, paddingBottom: 4, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
