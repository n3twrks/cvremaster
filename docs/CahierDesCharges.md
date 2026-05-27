Voilà le cahier des charges complet, prêt à copier-coller dans Claude (VS Code) :

---

# CVRemaster — Cahier des charges MVP

## Contexte

Application web de création et d'édition de CV assistée par IA. Stack : **Next.js 15 + TypeScript + Tailwind CSS**. Pas de backend ni de base de données pour le MVP — tout passe par **localStorage**. L'IA utilisée est **Google Gemini** via l'API REST (`GEMINI_API_KEY` dans `.env.local`).

---

## Stack & contraintes techniques

- **Next.js 15** App Router, TypeScript strict
- **Tailwind CSS** pour tous les styles
- **pdfjs-dist** pour l'extraction de texte PDF (déjà installé)
- **Gemini API** (`gemini-2.0-flash`) via fetch REST — pas de SDK
- **localStorage** pour la persistance (clé API + données CV)
- **window.print()** pour l'export PDF avec `@media print`
- Pas de Supabase, pas de auth, pas de base de données
- Pas de librairie de state management (useState/useReducer uniquement)

---

## Variables d'environnement

Fichier `.env.local` à la racine :

```
GEMINI_API_KEY=ta_clef_ici
```

La clef est exposée côté serveur uniquement via une **Route API Next.js** — elle ne doit jamais apparaître dans le code client.

---

## Architecture des fichiers à créer

```
src/
├── app/
│   ├── layout.tsx                  (modifier)
│   ├── page.tsx                    (créer)
│   ├── globals.css                 (modifier)
│   └── api/
│       └── ai/
│           └── route.ts            (créer) ← proxy Gemini
├── components/
│   ├── ApiKeyBanner.tsx            (créer)
│   ├── Sidebar.tsx                 (créer)
│   ├── Toolbar.tsx                 (créer)
│   └── CVPreview.tsx               (créer)
├── hooks/
│   └── useCVStore.ts               (créer)
├── lib/
│   ├── pdfParser.ts                (créer)
│   └── cvStorage.ts                (créer)
└── types/
    └── cv.ts                       (créer)
```

---

## Types TypeScript — `src/types/cv.ts`

```typescript
export interface Experience {
  title: string
  company: string
  location?: string
  date: string
  bullets: string[]
}

export interface Education {
  school: string
  degree: string
  date: string
}

export interface CVData {
  name: string
  tagline: string
  contact: string[]
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages: string[]
}

export interface Message {
  role: 'user' | 'assistant' | 'thinking'
  content: string
}
```

---

## Route API Gemini — `src/app/api/ai/route.ts`

Cette route est le **seul endroit** où `GEMINI_API_KEY` est utilisée. Elle reçoit `{ system, user }` et retourne `{ result: string }`.

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { system, user } = await req.json()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY manquante' }, { status: 500 })
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message || 'Erreur Gemini' }, { status: response.status })
  }

  const result = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return NextResponse.json({ result })
}
```

---

## localStorage helpers — `src/lib/cvStorage.ts`

```typescript
import { CVData } from '@/types/cv'

const CV_KEY = 'cvremaster_data'

export function saveCV(data: CVData): void {
  try {
    localStorage.setItem(CV_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('localStorage save error', e)
  }
}

export function loadCV(): CVData | null {
  try {
    const raw = localStorage.getItem(CV_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearCV(): void {
  localStorage.removeItem(CV_KEY)
}

export function encodeCVToURL(data: CVData): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
}

export function decodeCVFromURL(encoded: string): CVData | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))))
  } catch {
    return null
  }
}
```

---

## PDF Parser — `src/lib/pdfParser.ts`

```typescript
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item: any) => item.str).join(' ') + '\n'
  }

  return text
}
```

---

## State global — `src/hooks/useCVStore.ts`

Hook central qui gère tout le state de l'application.

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CVData, Message } from '@/types/cv'
import { saveCV, loadCV, decodeCVFromURL } from '@/lib/cvStorage'

export function useCVStore() {
  const [cvData, setCVData] = useState<CVData | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Uploadez votre CV PDF pour commencer, ou décrivez votre parcours.' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  // Chargement initial : URL param > localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('cv')
    if (encoded) {
      const decoded = decodeCVFromURL(encoded)
      if (decoded) { setCVData(decoded); return }
    }
    const saved = loadCV()
    if (saved) {
      setCVData(saved)
      addMessage('assistant', 'CV précédent restauré. Uploadez un nouveau PDF ou continuez à éditer.')
    }
  }, [])

  function addMessage(role: Message['role'], content: string) {
    setMessages(prev => [...prev, { role, content }])
  }

  function updateCV(data: CVData) {
    setCVData(data)
    saveCV(data)
  }

  return {
    cvData,
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    updateCV,
  }
}
```

---

## Route API IA — logique des prompts

### Prompt parsing PDF

```
system: "Tu es un expert en parsing de CV. Analyse le texte et retourne UNIQUEMENT un objet JSON valide sans aucun texte avant ou après, sans backticks markdown. Structure : { name, tagline, contact[], summary, experience[{title, company, location, date, bullets[]}], education[{school, degree, date}], skills[], languages[] }"

user: "Voici le texte extrait du CV :\n\n[texte]"
```

### Prompt chat/modification

```
system: "Tu es un expert en rédaction de CV. Tu as accès aux données actuelles en JSON. Pour une modification, commence ta réponse par JSON_UPDATE: suivi du JSON complet mis à jour. Pour une question générale, réponds normalement en texte. Structure JSON : { name, tagline, contact[], summary, experience[{title, company, location, date, bullets[]}], education[{school, degree, date}], skills[], languages[] }"

user: "CV actuel : [JSON]\n\nDemande : [message utilisateur]"
```

---

## Composants UI

### `ApiKeyBanner.tsx`
- Bandeau en haut de page
- Champ password pour saisir la clé (pour usage futur — **pour le MVP la clé est dans .env.local, donc ce composant peut afficher un simple statut vert "API connectée"**)
- État : vert si `GEMINI_API_KEY` est configurée côté serveur

### `Sidebar.tsx`
- Colonne gauche, largeur fixe 280px
- Logo CVRemaster en haut
- Liste des messages (user / assistant / thinking)
- Textarea + bouton envoyer en bas
- Enter pour envoyer, Shift+Enter pour saut de ligne
- Appel à `/api/ai` pour le chat
- Si la réponse commence par `JSON_UPDATE:` → parser le JSON et appeler `updateCV()`

### `Toolbar.tsx`
- Barre horizontale en haut du panneau droit
- Bouton **Importer PDF** → `<input type="file" accept=".pdf" />` caché + label
- Bouton **Export PDF** → `window.print()`
- Bouton **Copier lien** → encode le CV en URL et copie dans le presse-papier
- Upload déclenche : extraction PDF → appel `/api/ai` → `updateCV()`

### `CVPreview.tsx`
- Panneau droit, scrollable
- Reçoit `cvData: CVData | null` en prop
- Si null : placeholder centré "Importez votre CV PDF ou commencez à chatter"
- Si data : rendu HTML du CV avec styles inline ou classes Tailwind print-friendly
- Structure : nom + tagline, contact, résumé, expériences, formations, compétences/langues en 2 colonnes

---

## Page principale — `src/app/page.tsx`

```tsx
'use client'

import { useCVStore } from '@/hooks/useCVStore'
import Sidebar from '@/components/Sidebar'
import Toolbar from '@/components/Toolbar'
import CVPreview from '@/components/CVPreview'

export default function Home() {
  const store = useCVStore()

  return (
    <main className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        messages={store.messages}
        isLoading={store.isLoading}
        cvData={store.cvData}
        onUpdateCV={store.updateCV}
        addMessage={store.addMessage}
        setIsLoading={store.setIsLoading}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Toolbar
          cvData={store.cvData}
          onUpdateCV={store.updateCV}
          addMessage={store.addMessage}
          setIsLoading={store.setIsLoading}
        />
        <CVPreview cvData={store.cvData} />
      </div>
    </main>
  )
}
```

---

## CSS print — à ajouter dans `globals.css`

```css
@media print {
  #sidebar,
  #toolbar {
    display: none !important;
  }
  body {
    background: white !important;
  }
  #cv-content {
    box-shadow: none !important;
    border: none !important;
    max-width: 100% !important;
    padding: 0 !important;
  }
}
```

---

## `layout.tsx` — à modifier

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CVRemaster — AI CV Builder',
  description: 'Créez et optimisez votre CV avec l\'IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
```

---

## Checklist de test MVP

Une fois tous les fichiers créés, vérifier dans l'ordre :

- [ ] `npm run dev` démarre sans erreur TypeScript
- [ ] `localhost:3000` affiche l'interface (sidebar gauche + panneau droit)
- [ ] Uploader un PDF → le CV s'affiche dans le panneau droit
- [ ] Taper dans le chat "reformule mon résumé" → le CV se met à jour
- [ ] Cliquer "Export PDF" → `window.print()` s'ouvre avec seulement le CV
- [ ] Cliquer "Copier lien" → URL avec paramètre `?cv=...` copiée
- [ ] Recharger la page → CV restauré depuis localStorage
- [ ] Ouvrir l'URL copiée → CV chargé depuis l'URL

---

## Ce qu'on ne fait PAS dans ce MVP

- Pas d'authentification
- Pas de templates multiples
- Pas de Supabase
- Pas de paiement
- Pas de rate limiting
- Pas d'upload d'images dans le CV

Ces features viendront dans une V2 une fois le MVP validé.

---

**Commence par créer les fichiers dans cet ordre :** `types/cv.ts` → `lib/cvStorage.ts` → `lib/pdfParser.ts` → `app/api/ai/route.ts` → `hooks/useCVStore.ts` → `components/ApiKeyBanner.tsx` → `components/CVPreview.tsx` → `components/Toolbar.tsx` → `components/Sidebar.tsx` → `app/page.tsx` → modifier `app/layout.tsx` → modifier `app/globals.css`.