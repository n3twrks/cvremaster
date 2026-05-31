import { CVData } from '@/types/cv'
import { getSectionLabels } from '@/lib/sectionLabels'
import { ContactItem } from './utils'

interface Props { cvData: CVData; language?: string }

const PEACH = '#F2C4A0'
const PEACH_BAND = '#F9E4D0'
const ACCENT = '#C97D50'
const SIDEBAR_BG = '#F5F5F3'

export default function PastelSidebarTemplate({ cvData, language }: Props) {
  const L = getSectionLabels(language)
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto bg-white shadow-sm print:shadow-none print:max-w-full"
      style={{ display: 'flex', minHeight: 900, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Left sidebar */}
      <div style={{ width: '30%', background: SIDEBAR_BG, padding: '32px 16px', flexShrink: 0 }}>
        {/* Circular photo with peach bg — hidden entirely when not set */}
        {cvData.photo && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ position: 'relative', width: 96, height: 96 }}>
              <div style={{
                position: 'absolute', bottom: -6, right: -6,
                width: 88, height: 88, borderRadius: '50%', background: PEACH,
              }} />
              <img
                src={cvData.photo}
                alt="Photo"
                style={{ position: 'relative', width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', zIndex: 1 }}
              />
            </div>
          </div>
        )}

        {/* Contact */}
        {cvData.contact.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {cvData.contact.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 }}>
                <span style={{ color: ACCENT, fontSize: 9, marginTop: 2, flexShrink: 0 }}>◆</span>
                <ContactItem text={c} style={{ fontSize: 10, color: '#555', lineHeight: 1.4, wordBreak: 'break-word' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 1, background: '#DDD', margin: '12px 0' }} />

        {/* Education */}
        {cvData.education.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>
              {L.education}
            </div>
            {cvData.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{edu.degree}</div>
                <div style={{ fontSize: 10, color: '#666' }}>{edu.school}</div>
                <div style={{ fontSize: 10, color: '#999' }}>{edu.date}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 1, background: '#DDD', margin: '12px 0' }} />

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
              {L.skills}
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: ACCENT, marginBottom: 6 }}>// PROFESSIONAL</div>
            {cvData.skills.map((s, i) => (
              s.startsWith('## ') ? (
                <div key={i} style={{ fontSize: 9, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>{s.slice(3)}</div>
              ) : (
                <div key={i} style={{ fontSize: 10, color: '#555', marginBottom: 5, paddingBottom: 5, borderBottom: '1px solid #E8E8E4' }}>{s}</div>
              )
            ))}
          </div>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <div>
            <div style={{ height: 1, background: '#DDD', marginBottom: 12 }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#444', marginBottom: 8 }}>
              {L.languages}
            </div>
            {cvData.languages.map((l, i) => (
              <div key={i} style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>{l}</div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, background: '#FFFFFF', padding: '32px 28px' }}>
        {/* Name */}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#333', letterSpacing: -0.5, marginBottom: 0, lineHeight: 1.1 }}>
          {cvData.name}
        </h1>

        {/* Tagline with peach background band */}
        {cvData.tagline && (
          <div style={{ background: PEACH_BAND, padding: '6px 0 6px 0', marginTop: 4, marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {cvData.tagline}
            </span>
          </div>
        )}

        {/* Summary */}
        {cvData.summary && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{cvData.summary}</p>
            <div style={{ height: 1, background: '#EEE', marginTop: 14 }} />
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#333', marginBottom: 12 }}>
              {L.experience}
            </div>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry" style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>{exp.title}</div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
                  {exp.company}{exp.location && ` — ${exp.location}`}, {exp.date}
                </div>
                {exp.bullets.map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                    <span style={{ color: ACCENT, fontSize: 10, marginTop: 2, flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 11, color: '#555', lineHeight: 1.5 }}>{b}</span>
                  </div>
                ))}
                {i < cvData.experience.length - 1 && (
                  <div style={{ height: 1, background: '#EEE', marginTop: 12 }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hobbies */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <div>
            <div style={{ height: 1, background: '#EEE', marginBottom: 14 }} />
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#333', marginBottom: 8 }}>
              {L.hobbies}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
              {cvData.hobbies.map((h, i) => (
                <span key={i} style={{ fontSize: 11, color: '#666' }}>• {h}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
