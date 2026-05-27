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
