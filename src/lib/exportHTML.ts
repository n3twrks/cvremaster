import { CVData } from '@/types/cv'

export function generateCVHTML(cv: CVData): string {
  const escHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const contactRow = cv.contact.length
    ? `<div class="contact">${cv.contact.map(c => `<span>${escHtml(c)}</span>`).join('')}</div>`
    : ''

  const summary = cv.summary
    ? `<section><h2>Résumé</h2><p>${escHtml(cv.summary)}</p></section>`
    : ''

  const experience =
    cv.experience.length
      ? `<section>
          <h2>Expérience</h2>
          ${cv.experience
            .map(
              exp => `<div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${escHtml(exp.title)} · ${escHtml(exp.company)}${exp.location ? ` · ${escHtml(exp.location)}` : ''}</span>
                  <span class="entry-date">${escHtml(exp.date)}</span>
                </div>
                ${exp.bullets.length ? `<ul>${exp.bullets.map(b => `<li>${escHtml(b)}</li>`).join('')}</ul>` : ''}
              </div>`
            )
            .join('')}
        </section>`
      : ''

  const education =
    cv.education.length
      ? `<section>
          <h2>Formation</h2>
          ${cv.education
            .map(
              edu => `<div class="entry">
                <div class="entry-header">
                  <span class="entry-title">${escHtml(edu.degree)} · ${escHtml(edu.school)}</span>
                  <span class="entry-date">${escHtml(edu.date)}</span>
                </div>
              </div>`
            )
            .join('')}
        </section>`
      : ''

  const skills = cv.skills.length
    ? `<div class="col"><h2>Compétences</h2><div class="tags">${cv.skills.map(s => `<span>${escHtml(s)}</span>`).join('')}</div></div>`
    : ''

  const languages = cv.languages.length
    ? `<div class="col"><h2>Langues</h2><div class="tags lang">${cv.languages.map(l => `<span>${escHtml(l.name)}${l.level ? ` — ${escHtml(l.level)}` : ''}</span>`).join('')}</div></div>`
    : ''

  const hobbies =
    cv.hobbies && cv.hobbies.length
      ? `<section><h2>Hobbies &amp; Passions</h2><div class="tags hobby">${cv.hobbies.map(h => `<span>${escHtml(h)}</span>`).join('')}</div></section>`
      : ''

  const footer =
    skills || languages
      ? `<section><div class="two-col">${skills}${languages}</div></section>`
      : ''

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escHtml(cv.name)} — CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: #fff; color: #1A1A18; line-height: 1.5; }
    .page { max-width: 780px; margin: 40px auto; padding: 48px; border: 1px solid #E5E4E0; }
    @media print { .page { max-width: 100%; margin: 0; padding: 32px; border: none; } }

    /* Header */
    .header { padding-bottom: 24px; border-bottom: 1px solid #E5E4E0; margin-bottom: 24px; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.25rem; font-weight: 500; line-height: 1.2; letter-spacing: -0.02em; color: #1A1A18; }
    .tagline { color: #6B6A66; font-size: 1.125rem; margin-top: 4px; }
    .contact { display: flex; flex-wrap: wrap; gap: 0 16px; margin-top: 12px; }
    .contact span { font-family: 'DM Mono', monospace; font-size: 0.875rem; color: #6B6A66; }

    /* Sections */
    section { margin-bottom: 24px; }
    h2 { font-family: 'DM Sans', system-ui, sans-serif; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; color: #1B4332; margin-bottom: 12px; }
    section > p { font-size: 0.875rem; line-height: 1.6; color: #1A1A18; }

    /* Entries */
    .entry { margin-bottom: 16px; }
    .entry-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 4px; }
    .entry-title { font-size: 0.875rem; font-weight: 500; color: #1A1A18; }
    .entry-date { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: #9D9C98; white-space: nowrap; flex-shrink: 0; }
    ul { list-style: disc; list-style-position: inside; }
    li { font-size: 0.875rem; color: #1A1A18; line-height: 1.5; margin-top: 2px; }

    /* Two-col footer */
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tags span { display: inline-block; padding: 2px 8px; font-size: 0.75rem; border-radius: 4px; background: #F4F3F0; border: 1px solid #E5E4E0; color: #1A1A18; }
    .tags.lang span { background: #D8EDDF; border-color: #A7D9B8; color: #1B4332; }
    .tags.hobby span { background: #FDF3DC; border-color: #E8A838; color: #B45309; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <h1>${escHtml(cv.name)}</h1>
      ${cv.tagline ? `<p class="tagline">${escHtml(cv.tagline)}</p>` : ''}
      ${contactRow}
    </div>
    ${summary}
    ${experience}
    ${education}
    ${footer}
    ${hobbies}
  </div>
</body>
</html>`
}

export function downloadHTML(cv: CVData): void {
  const el = document.getElementById('cv-content')
  if (!el) return

  const linkTags = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .map(l => l.outerHTML)
    .join('\n  ')

  const styleTags = Array.from(document.querySelectorAll('style'))
    .map(s => s.outerHTML)
    .join('\n  ')

  const safeName = cv.name
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeName} — CV</title>
  ${linkTags}
  ${styleTags}
  <style>html,body{margin:0;padding:0;background:#fff;}</style>
</head>
<body>
  ${el.outerHTML}
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${cv.name.replace(/\s+/g, '_')}_CV.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
