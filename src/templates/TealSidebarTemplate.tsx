import { CVData } from '@/types/cv'
import { langScore, SegmentBar } from './utils'

interface Props { cvData: CVData }

const TEAL = '#3DBDB3'

export default function TealSidebarTemplate({ cvData }: Props) {
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto bg-white shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Left sidebar */}
      <div style={{ width: '30%', background: '#FAFAFA', borderRight: `3px solid ${TEAL}`, padding: '24px 16px', flexShrink: 0 }}>
        {/* Photo */}
        {cvData.photo ? (
          <img
            src={cvData.photo}
            alt="Photo"
            style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', marginBottom: 16, display: 'block', border: `2px solid ${TEAL}` }}
          />
        ) : (
          <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#EEE', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${TEAL}` }}>
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="10" stroke="#AAA" strokeWidth="2" />
              <path d="M6 42c0-10 8-16 18-16s18 6 18 16" stroke="#AAA" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Contact */}
        {cvData.contact.length > 0 && (
          <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${TEAL}` }}>
            {cvData.contact.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                <span style={{ color: TEAL, fontSize: 10, marginTop: 2, flexShrink: 0 }}>◆</span>
                <span style={{ fontSize: 10, color: '#555', lineHeight: 1.4, wordBreak: 'break-word' }}>{c}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${TEAL}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
              Skills
            </div>
            {cvData.skills.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <span style={{ color: TEAL, fontSize: 8 }}>•</span>
                <span style={{ fontSize: 10, color: '#555' }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
              Languages
            </div>
            {cvData.languages.map((lang, i) => {
              const parts = lang.split(/[\-–—]/).map(s => s.trim())
              const name = parts[0]
              const level = parts[1] ?? ''
              return (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#333' }}>{name}</span>
                    <span style={{ fontSize: 9, color: '#888' }}>{level}</span>
                  </div>
                  <SegmentBar score={langScore(lang)} filled={TEAL} empty="#DDD" />
                </div>
              )
            })}
          </div>
        )}

        {/* Hobbies */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <div style={{ paddingTop: 16, borderTop: `1px solid ${TEAL}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', marginBottom: 8 }}>
              Hobbies
            </div>
            {cvData.hobbies.map((h, i) => (
              <div key={i} style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>{h}</div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: '24px 24px' }}>
        {/* Name + tagline at top */}
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#333', marginBottom: 2 }}>{cvData.name}</h1>
        {cvData.tagline && (
          <p style={{ fontSize: 12, color: TEAL, fontWeight: 600, marginBottom: 12 }}>{cvData.tagline}</p>
        )}

        {/* Summary */}
        {cvData.summary && (
          <div style={{ background: '#F8FFFE', borderLeft: `3px solid ${TEAL}`, padding: '10px 12px', marginBottom: 20, fontSize: 11, color: '#555', lineHeight: 1.6 }}>
            {cvData.summary}
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: `2px solid ${TEAL}`, paddingBottom: 4, marginBottom: 12 }}>
              Work Experience
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
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

        {/* Education */}
        {cvData.education.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#333', borderBottom: `2px solid ${TEAL}`, paddingBottom: 4, marginBottom: 12 }}>
              Education
            </div>
            {cvData.education.map((edu, i) => (
              <div key={i} className="entry" style={{ marginBottom: 8 }}>
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
