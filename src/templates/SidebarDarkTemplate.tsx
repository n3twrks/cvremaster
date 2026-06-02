import { CVData } from '@/types/cv'
import { getSectionLabels } from '@/lib/sectionLabels'
import { SegmentBar, ContactItem } from './utils'

interface Props { cvData: CVData; language?: string; spacingScale?: number }

const SIDEBAR = '#3C3C3C'
const SIDEBAR_TEXT = '#FFFFFF'
const SIDEBAR_MUTED = '#B0AFA9'

export default function SidebarDarkTemplate({ cvData, language, spacingScale = 1 }: Props) {
  const L = getSectionLabels(language)
  const S = spacingScale
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Left sidebar */}
      <div style={{ width: '30%', background: SIDEBAR, color: SIDEBAR_TEXT, padding: '0 0 32px 0', flexShrink: 0 }}>
        {cvData.photo && (
          <img src={cvData.photo} alt="Photo" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
        )}

        <div style={{ padding: `${20 * S}px ${20 * S}px 0` }}>
          {cvData.contact.length > 0 && (
            <div style={{ marginBottom: 20 * S }}>
              {cvData.contact.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 * S }}>
                  <span style={{ color: SIDEBAR_MUTED, fontSize: 10, marginTop: 2 }}>◆</span>
                  <ContactItem text={c} style={{ fontSize: 11, color: SIDEBAR_TEXT, lineHeight: 1.4 }} />
                </div>
              ))}
            </div>
          )}

          {cvData.education.length > 0 && (
            <>
              <div style={{ borderBottom: '1px solid #555', marginBottom: 14 * S }} />
              <div style={{ marginBottom: 18 * S }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 7 * S }}>
                  {L.education}
                </div>
                {cvData.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 8 * S }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: SIDEBAR_TEXT, lineHeight: 1.3 }}>{edu.degree}</div>
                    <div style={{ fontSize: 10, color: SIDEBAR_MUTED }}>{edu.school}</div>
                    <div style={{ fontSize: 10, color: SIDEBAR_MUTED, fontStyle: 'italic' }}>{edu.date}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {cvData.summary && (
            <>
              <div style={{ borderBottom: '1px solid #555', marginBottom: 14 * S }} />
              <div style={{ marginBottom: 18 * S }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 7 * S }}>
                  {L.summary}
                </div>
                <p style={{ fontSize: 11, color: SIDEBAR_MUTED, lineHeight: 1.5 }}>{cvData.summary}</p>
              </div>
            </>
          )}

          <div style={{ borderBottom: '1px solid #555', marginBottom: 14 * S }} />

          {cvData.skills.length > 0 && (
            <div style={{ marginBottom: 18 * S }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 7 * S }}>
                {L.skills}
              </div>
              {cvData.skills.map((s, i) => (
                s.startsWith('## ') ? (
                  <div key={i} style={{ fontSize: 9, fontWeight: 700, color: SIDEBAR_TEXT, textTransform: 'uppercase', letterSpacing: 1, marginTop: 5 * S, marginBottom: 2 }}>{s.slice(3)}</div>
                ) : (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 * S }}>
                    <span style={{ color: SIDEBAR_MUTED, fontSize: 8 }}>•</span>
                    <span style={{ fontSize: 11, color: SIDEBAR_MUTED }}>{s}</span>
                  </div>
                )
              ))}
            </div>
          )}

          {cvData.languages.length > 0 && (
            <>
              <div style={{ borderBottom: '1px solid #555', marginBottom: 14 * S }} />
              <div style={{ marginBottom: 18 * S }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 7 * S }}>
                  {L.languages}
                </div>
                {cvData.languages.map((lang, i) => (
                  <div key={i} style={{ marginBottom: 8 * S }}>
                    {/* Fixed 5px gap between label row and bar — prevents PDF collapse */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: SIDEBAR_TEXT }}>{lang.name}</span>
                      <span style={{ fontSize: 10, color: SIDEBAR_MUTED }}>{lang.level}</span>
                    </div>
                    <SegmentBar score={lang.score} filled={SIDEBAR_TEXT} empty="#555" />
                  </div>
                ))}
              </div>
            </>
          )}

          {cvData.hobbies && cvData.hobbies.length > 0 && (
            <>
              <div style={{ borderBottom: '1px solid #555', marginBottom: 14 * S }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 7 * S }}>
                  {L.hobbies}
                </div>
                {cvData.hobbies.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 * S }}>
                    <span style={{ color: SIDEBAR_MUTED, fontSize: 8 }}>•</span>
                    <span style={{ fontSize: 11, color: SIDEBAR_MUTED }}>{h}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right content */}
      <div style={{ flex: 1, background: '#FFFFFF', padding: `${28 * S}px 28px` }}>
        {/* Fixed 8px gap between name and tagline — prevents PDF collapse */}
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#444', lineHeight: 1.1, marginBottom: 8 }}>
          {cvData.name}
        </h1>
        {cvData.tagline && (
          <p style={{ fontSize: 14, color: '#888', marginBottom: 20 * S }}>{cvData.tagline}</p>
        )}

        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 20 * S }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: '1.5px solid #ddd', paddingBottom: 4, marginBottom: 10 * S }}>
              {L.experience}
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ marginBottom: 14 * S }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{exp.date}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>
                  {exp.title}
                  <span style={{ fontWeight: 400, color: '#666' }}> | {exp.company}</span>
                  {exp.location && <span style={{ fontWeight: 300, color: '#aaa' }}> | {exp.location}</span>}
                </div>
                {exp.bullets.length > 0 && (
                  <div style={{ marginTop: 5 * S }}>
                    {exp.bullets.map((b, j) => (
                      <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 3 * S }}>
                        <span style={{ color: '#888', fontSize: 10, flexShrink: 0, marginTop: 2 }}>•</span>
                        <span style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
