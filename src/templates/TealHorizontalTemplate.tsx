import { CVData } from '@/types/cv'
import { getSectionLabels } from '@/lib/sectionLabels'
import { langScore, SegmentBar, ContactItem } from './utils'

interface Props { cvData: CVData; language?: string }

const TEAL = '#3DBDB3'
const TEAL_DARK = '#2A9D94'

export default function TealHorizontalTemplate({ cvData, language }: Props) {
  const L = getSectionLabels(language)
  return (
    <div
      id="cv-content"
      className="max-w-[780px] mx-auto bg-white shadow-sm print:shadow-none print:max-w-full"
      style={{ fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}
    >
      {/* Teal triangle decoration top-right */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 0, height: 0,
        borderStyle: 'solid',
        borderWidth: '0 80px 80px 0',
        borderColor: `transparent ${TEAL} transparent transparent`,
        zIndex: 1,
      }} />

      {/* Header area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '24px 28px 16px', borderBottom: `2px solid ${TEAL}` }}>
        {cvData.photo && (
          <img
            src={cvData.photo}
            alt="Photo"
            style={{ width: 90, height: 90, objectFit: 'cover', flexShrink: 0, border: `2px solid ${TEAL}` }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#333', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
            {cvData.name}
          </h1>
          {cvData.tagline && (
            <p style={{ fontSize: 13, color: TEAL_DARK, fontWeight: 600, marginBottom: 8 }}>{cvData.tagline}</p>
          )}
          {cvData.contact.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
              {cvData.contact.map((c, i) => (
                <span key={i} style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: TEAL, fontSize: 8 }}>◆</span>
                  <ContactItem text={c} style={{ color: '#666' }} />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body: sections laid out as label-left + content-right */}
      <div style={{ padding: '0 28px 28px' }}>

        {/* Summary */}
        {cvData.summary && (
          <Row label={L.summary} teal={TEAL}>
            <p style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>{cvData.summary}</p>
          </Row>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <Row label={L.experience} teal={TEAL}>
            {cvData.experience.map((exp, i) => (
              <div key={i} className="entry">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 12, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {exp.title}
                    </span>
                    <span style={{ fontSize: 11, color: '#888' }}>, {exp.date}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: '#555', marginBottom: 4 }}>
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {exp.bullets.length > 0 && (
                  <ul style={{ paddingLeft: 14, marginBottom: 4 }}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} style={{ fontSize: 11, color: '#555', lineHeight: 1.6 }}>{b}</li>
                    ))}
                  </ul>
                )}
                {i < cvData.experience.length - 1 && (
                  <div style={{ borderTop: '1px dashed #CCC', margin: '10px 0' }} />
                )}
              </div>
            ))}
          </Row>
        )}

        {/* Education */}
        {cvData.education.length > 0 && (
          <Row label={L.education} teal={TEAL}>
            {cvData.education.map((edu, i) => (
              <div key={i} className="entry" style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: '#555' }}>
                  <em>{edu.school}</em>{edu.school && `, ${edu.date}`}
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: '#333' }}>{edu.degree}</div>
              </div>
            ))}
          </Row>
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <Row label={L.skills} teal={TEAL}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
              {cvData.skills.map((s, i) => (
                s.startsWith('## ') ? (
                  <div key={i} style={{ gridColumn: '1 / -1', fontSize: 10, fontWeight: 700, color: TEAL, textTransform: 'uppercase', letterSpacing: 1, marginTop: 6 }}>{s.slice(3)}</div>
                ) : (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: TEAL, fontSize: 8 }}>•</span>
                    <span style={{ fontSize: 11, color: '#555' }}>{s}</span>
                  </div>
                )
              ))}
            </div>
          </Row>
        )}

        {/* Languages */}
        {cvData.languages.length > 0 && (
          <Row label={L.languages} teal={TEAL}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
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
                    <SegmentBar score={langScore(lang)} filled={TEAL} empty="#DDD" />
                  </div>
                )
              })}
            </div>
          </Row>
        )}

        {/* Hobbies */}
        {cvData.hobbies && cvData.hobbies.length > 0 && (
          <Row label={L.hobbies} teal={TEAL}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
              {cvData.hobbies.map((h, i) => (
                <span key={i} style={{ fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: TEAL, fontSize: 8 }}>•</span> {h}
                </span>
              ))}
            </div>
          </Row>
        )}
      </div>
    </div>
  )
}

function Row({ label, teal, children }: { label: string; teal: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #EEE', padding: '14px 0' }}>
      <div style={{ width: 130, flexShrink: 0, paddingTop: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: teal }}>
          {label}
        </span>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}
