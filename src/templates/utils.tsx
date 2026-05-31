/** Return an href for a contact string, or null if it's plain text */
export function contactHref(c: string): string | null {
  const t = c.trim()
  if (/^https?:\/\//i.test(t)) return t
  if (/^[\w.%+\-]+@[\w.\-]+\.[a-z]{2,}$/i.test(t)) return `mailto:${t}`
  if (/linkedin\.com/i.test(t)) return `https://${t.replace(/^https?:\/\//i, '')}`
  if (/github\.com/i.test(t)) return `https://${t.replace(/^https?:\/\//i, '')}`
  return null
}

/** Render a contact item as a link if it looks like a URL/email, otherwise plain */
export function ContactItem({
  text,
  style,
  className,
}: {
  text: string
  style?: React.CSSProperties
  className?: string
}) {
  const href = contactHref(text)
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', ...style }} className={className}>
      {text}
    </a>
  ) : (
    <span style={style} className={className}>{text}</span>
  )
}

/** Map a language string containing a CEFR level or keyword to a 0–5 score */
export function langScore(lang: string): number {
  const l = lang.toLowerCase()
  if (l.match(/native|natif|maternelle?|c2/)) return 5
  if (l.match(/fluent|courant|c1/)) return 4
  if (l.match(/b2|upper.?intermediate|avancé/)) return 3.5
  if (l.match(/b1|intermediate|intermédiaire/)) return 3
  if (l.match(/a2|elementary|élémentaire/)) return 2
  if (l.match(/a1|beginner|débutant/)) return 1
  return 3
}

/** Render 5 block segments filled according to score */
export function SegmentBar({ score, filled, empty }: { score: number; filled: string; empty: string }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: 16,
            height: 5,
            borderRadius: 2,
            background: i <= Math.round(score) ? filled : empty,
          }}
        />
      ))}
    </div>
  )
}
