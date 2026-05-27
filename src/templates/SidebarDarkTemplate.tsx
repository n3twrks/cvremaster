import { CVData } from '@/types/cv'
import { langScore, SegmentBar } from './utils'

interface Props { cvData: CVData }

const SIDEBAR = '#3C3C3C'
const SIDEBAR_TEXT = '#FFFFFF'
const SIDEBAR_MUTED = '#B0AFA9'

export default function SidebarDarkTemplate({ cvData }: Props) {
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Left sidebar */}
      <div style={{ width: '30%', background: SIDEBAR, color: SIDEBAR_TEXT, padding: '0 0 32px 0', flexShrink: 0 }}>
        {/* Photo */}
        {cvData.photo ? (
          <img
            src={cvData.photo}
            alt="Photo"
            style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="10" stroke="#888" strokeWidth="2" />
              <path d="M6 42c0-10 8-16 18-16s18 6 18 16" stroke="#888" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        <div style={{ padding: '20px 20px 0' }}>
          {/* Contact */}
          {cvData.contact.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {cvData.contact.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: SIDEBAR_MUTED, fontSize: 10, marginTop: 2 }}>◆</span>
                  <span style={{ fontSize: 11, color: SIDEBAR_TEXT, lineHeight: 1.4 }}>{c}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderBottom: '1px solid #555', marginBottom: 16 }} />

          {/* Summary */}
          {cvData.summary && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 8 }}>
                Personal Summary
              </div>
              <p style={{ fontSize: 11, color: SIDEBAR_MUTED, lineHeight: 1.6 }}>{cvData.summary}</p>
            </div>
          )}

          <div style={{ borderBottom: '1px solid #555', marginBottom: 16 }} />

          {/* Skills */}
          {cvData.skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 8 }}>
                Skills
              </div>
              {cvData.skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span style={{ color: SIDEBAR_MUTED, fontSize: 8 }}>•</span>
                  <span style={{ fontSize: 11, color: SIDEBAR_MUTED }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hobbies */}
          {cvData.hobbies && cvData.hobbies.length > 0 && (
            <>
              <div style={{ borderBottom: '1px solid #555', marginBottom: 16 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: SIDEBAR_TEXT, marginBottom: 8 }}>
                  Hobbies
                </div>
                {cvData.hobbies.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
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
      <div style={{ flex: 1, background: '#FFFFFF', padding: '32px 28px' }}>
        {/* Name */}
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#444', lineHeight: 1.1, marginBottom: 4 }}>
          {cvData.name}
        </h1>
        {cvData.tagline && (
          <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>{cvData.tagline}</p>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: '1.5px solid #ddd', paddingBottom: 4, marginBottom: 12 }}>
              Work Experience
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{exp.date}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>
                  {exp.title}
                  <span style={{ fontWeight: 400, color: '#666' }}> | {exp.company}</span>
                  {exp.location && <span style={{ color: '#aaa' }}> | {exp.location}</span>}
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: 16, marginTop: 6 }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ fontSize: 11, color: '#555', lineHeight: 1.6, marginBottom: 2 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: '1.5px solid #ddd', paddingBottom: 4, marginBottom: 12 }}>
              Education
            </div>
            {cvData.education.map((edu, i) => (
              <div key={i} className="entry" style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#888' }}>{edu.date}</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#333' }}>{edu.degree}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{edu.school}</div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: '1.5px solid #ddd', paddingBottom: 4, marginBottom: 12 }}>
              Languages
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
              {cvData.languages.map((lang, i) => {
                const parts = lang.split(/[\-–—]/).map(s => s.trim())
                const name = parts[0]
                const level = parts[1] ?? ''
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#444' }}>{name}:</span>
                      <span style={{ fontSize: 11, color: '#888' }}>{level}</span>
                    </div>
                    <SegmentBar score={langScore(lang)} filled="#3C3C3C" empty="#DDD" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
