# CVRemaster

**CVRemaster** is a local-first, AI-powered CV editor. Import your existing CV as a PDF, edit every section visually, chat with an AI assistant to rewrite and improve your content, pick a template, and export a polished PDF — all in the browser, with no account required.

---

## Features

### AI Assistant
- **Chat to edit** — describe what you want ("rewrite my summary", "improve the bullets for my last job") and the AI applies changes directly to your CV
- **Section analysis** — get an AI score (0–100) per section with specific recommendations
- **One-click translation** — translate the entire CV to another language while preserving names, companies and cities
- **Voice context** — record spoken context about your experience so the AI can enrich your CV with real details

### Visual editor
- Edit every field inline: name, tagline, contact info, summary, experience, education, skills, languages, hobbies
- **Drag & drop** to reorder experiences, education entries, and skills
- **Hide/show sections** without deleting — toggle profile summary, hobbies, and individual bullet points with an eye icon
- **Language entries** with name, free-text level (Natif, C1, Bilingue…) and a 1–5 score bar
- **Spacing control** — slider to compress or expand the whole CV layout (useful to fit one page)
- **Photo upload** with show/hide toggle

### Templates
6 ready-to-use templates:

| Template | Style |
|---|---|
| Classic | Clean single-column, minimal |
| Sidebar Dark | Dark sidebar with photo, two-column |
| Teal Sidebar | Coloured sidebar accent |
| Teal Horizontal | Label-left layout with teal accents |
| Navy Dark | Dark navy sidebar, timeline experience |
| Pastel Sidebar | Soft pastel sidebar, rounded photo |

### Version management
- Save named snapshots of your CV at any point
- Each language version is stored separately (FR, EN, ES…)
- Restore any previous snapshot instantly

### Export
- **PDF** — high-fidelity export via html2canvas + jsPDF with smart page-break detection
- **HTML** — standalone single-file HTML export
- **Print** — browser print dialog (Cmd+P → Save as PDF)
- **Share link** — encoded URL that embeds the CV data (no server needed)

### Data & privacy
- **100% local** — all data lives in your browser's `localStorage`, nothing is sent to any server except the AI API calls
- No login, no account, no tracking
- Multiple independent projects supported from the dashboard

---

## Quick start

```bash
git clone <repo-url>
cd cvremaster
npm install
cp .env.example .env.local
# edit .env.local and add your GEMINI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

→ Full setup instructions: [SETUP.md](./SETUP.md)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| AI | Google Gemini API (via REST) |
| PDF export | html2canvas + jsPDF |
| Storage | Browser localStorage (no backend) |
| Language | TypeScript |

---

## How it works

1. **Import** — paste your existing PDF or start from scratch via the chat
2. **Edit** — use the left panel to edit data directly, or ask the AI chat to make changes
3. **Design** — switch templates and adjust spacing to fit your content
4. **Export** — download as PDF or HTML, or copy a shareable link

The AI receives your current CV as JSON on each message, applies targeted patches (for small edits) or rewrites the full structure (for large changes), and the UI updates instantly.

---

## Project structure

```
src/
├── app/
│   ├── (app)/cv/          # Main CV editor page
│   ├── (app)/dashboard/   # Project list
│   └── api/ai/            # Gemini API proxy route
├── components/
│   ├── DataEditor.tsx      # Left sidebar — edit all CV fields
│   ├── CenterPanel.tsx     # Live CV preview
│   ├── Sidebar.tsx         # Right sidebar — AI chat, analysis, voice
│   └── Toolbar.tsx         # Top bar — import, export, versions, language
├── templates/              # 6 visual CV templates
├── hooks/
│   └── useCVStore.ts       # Central state — CV data, photo, visibility, versions
├── lib/
│   ├── cvStorage.ts        # localStorage read/write helpers
│   ├── exportPDF.ts        # PDF generation logic
│   └── parseAIResponse.ts  # JSON/patch parser for AI responses
└── types/
    └── cv.ts               # CVData, Language, Experience… TypeScript types
```

---

## Configuration

The only required environment variable is your Gemini API key:

```env
GEMINI_API_KEY=your_key_here
```

Optionally override the AI model:

```env
AI_MODEL_PRIMARY=gemini-2.5-flash-lite
AI_MODEL_FALLBACK=gemini-flash-lite-latest
```

See [SETUP.md](./SETUP.md) for full details and deployment instructions.

---

## License

MIT — use it, fork it, build on it.
