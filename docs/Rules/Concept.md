# CVRemaster — Concept & Vision produit

## Genèse du projet

CVRemaster est né d'un besoin personnel. Après une expérience chez NAVER Labs Europe (levée de 40M€, 500K€ de revenus, 4000 unités gérées), une année de voyage en Asie du Sud-Est couplée à un apprentissage intensif du développement IA (vibe-coding, Cursor, Claude), puis le lancement de Roampads (marketplace de logements mensuels en Asie pour remote workers et expats) — le besoin s'est imposé : avoir un outil simple, rapide, IA-natif pour créer et maintenir un CV qui reflète un parcours atypique sans que les "gaps" ressemblent à des trous.

L'idée est aussi un projet portfolio / contenu TikTok : **build in public**, partagé en temps réel pendant sa construction.

---

## Problèmes que CVRemaster résout

1. **Le gap year mal présenté** — Une période de voyage + apprentissage IA devient un atout si bien formulée, pas un trou. L'IA aide à transformer ces périodes en compétences narratives.
2. **Le CV PDF, rigide et douloureux à maintenir** — Un CV HTML est vivant, facile à modifier, itérable en quelques secondes avec de l'IA.
3. **Les outils CV existants sont lents et génériques** — CVRemaster cible les profils tech, fondateurs, builders qui veulent aller vite et avoir un rendu pro sans friction.
4. **Le partage** — Un lien plutôt qu'une pièce jointe, pour les contextes startup/VC/fondateur.

---

## Vision produit

> Import ton CV → l'IA le comprend → tu l'édites par le chat → tu partages un lien ou tu exportes en PDF.

CVRemaster est un **éditeur de CV IA-first** :
- On importe un PDF existant
- L'IA parse et structure les données
- On modifie par instructions en langage naturel ("reformule mon expérience NAVER", "comble le gap 2024-2025", "rends ça plus impactant")
- On exporte en PDF propre ou on partage un lien

---

## Utilisateurs cibles

- Profils tech, fondateurs, builders, freelances
- Personnes avec des parcours atypiques (gap years, pivots, side projects)
- Remote workers, expats, digital nomads
- Créateurs de contenu tech (build in public)

---

## Fonctionnalités MVP

### Import
- Upload d'un CV au format PDF
- Extraction du texte via **pdf.js**
- Parsing et structuration par **Gemini** → JSON typé

### Éditeur IA
- Chat intégré dans la sidebar
- Instructions en langage naturel → mise à jour du CV en temps réel
- Deux modes de réponse Gemini :
  - `JSON_UPDATE:` + JSON complet → mise à jour du rendu
  - Texte libre → réponse conversationnelle

### Rendu CV
- Aperçu live dans le panneau droit
- Design épuré, print-friendly
- Structure : nom, tagline, contact, résumé, expériences, formations, compétences, langues

### Export & Partage
- **Export PDF** via `window.print()` avec `@media print` (sidebar et toolbar masqués)
- **Lien de partage** : données CV encodées en base64 dans l'URL (`?cv=...`)
- Pas de backend requis pour le partage MVP

### Persistance
- Toutes les données en **localStorage**
- Restauration automatique au rechargement
- Priorité de chargement : URL param > localStorage

---

## Fonctionnalités hors MVP (V2+)

- Templates multiples (les données sont séparées du rendu)
- Upload d'images / photo dans le CV
- Authentification utilisateur
- Backend + Supabase pour la persistance cloud
- Paiement à l'export (Stripe)
- Rate limiting / crédits IA
- Suggestions proactives de l'IA ("tu as un gap ici, voici comment le présenter")
- Mode "bring your own key" (Gemini/Claude)

---

## Modèle économique (réfléchi, pas implémenté)

### Court terme (MVP public)
- Clé API en dur côté serveur (variable d'environnement)
- Gratuit pour les premiers utilisateurs, pas de rate limit
- Objectif : valider l'intérêt, créer du contenu TikTok

### Moyen terme
- **Paiement à l'export** : X crédits gratuits, puis Stripe
- Modèle freemium : N exports gratuits/mois → abonnement

### Long terme
- Abonnement mensuel
- Option "bring your own key" pour les power users

### Ce qu'on ne fera PAS
- Pub dans l'app
- Revente de données

---

## Stack technique

| Couche | Choix | Raison |
|--------|-------|--------|
| Framework | Next.js 15 (App Router) | Stack principale du fondateur |
| Langage | TypeScript strict | Autocomplétion, robustesse |
| Styles | Tailwind CSS | Rapidité, cohérence |
| IA | Google Gemini 2.0 Flash | Clé Gemini disponible, rapide, bon parsing |
| PDF | pdfjs-dist | Extraction texte côté client |
| State | useState/useReducer + localStorage | Pas de lib externe, migration Supabase facile |
| Auth | Aucune (MVP) | — |
| DB | Aucune / localStorage (MVP) | Migration Supabase prévue en V2 |
| Paiement | Aucun (MVP) | Stripe en V2 |
| Déploiement | Vercel (prévu) | Natif Next.js |

---

## Architecture technique

### Sécurité de la clé API
La clé `GEMINI_API_KEY` est stockée dans `.env.local` et n'est **jamais exposée côté client**. Tous les appels Gemini passent par une **Route API Next.js** (`/api/ai`) qui fait office de proxy.

```
Client (browser)
    ↓ fetch POST /api/ai { system, user }
Next.js Route API (serveur)
    ↓ fetch Gemini API avec GEMINI_API_KEY
Google Gemini
    ↓ { result: string }
Client → parse → updateCV() ou addMessage()
```

### Structure des fichiers

```
cvremaster/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              ← assemblage principal
│   │   ├── globals.css           ← Tailwind + @media print
│   │   └── api/
│   │       └── ai/
│   │           └── route.ts      ← proxy Gemini (clé API sécurisée)
│   ├── components/
│   │   ├── ApiKeyBanner.tsx      ← statut connexion API
│   │   ├── Sidebar.tsx           ← chat IA + historique messages
│   │   ├── Toolbar.tsx           ← import PDF / export / partage
│   │   └── CVPreview.tsx         ← rendu live du CV
│   ├── hooks/
│   │   └── useCVStore.ts         ← state global (cvData, messages)
│   ├── lib/
│   │   ├── ai.ts                 ← appel /api/ai
│   │   ├── pdfParser.ts          ← extraction texte PDF
│   │   └── cvStorage.ts          ← localStorage helpers + encode/decode URL
│   └── types/
│       └── cv.ts                 ← interfaces TypeScript
├── .env.local                    ← GEMINI_API_KEY (jamais committé)
├── .gitignore                    ← .env.local inclus
└── package.json
```

### Types de données centraux

```typescript
// CVData — structure principale persistée en localStorage et partagée via URL
interface CVData {
  name: string
  tagline: string
  contact: string[]
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages: string[]
}

// Message — historique du chat IA
interface Message {
  role: 'user' | 'assistant' | 'thinking'
  content: string
}
```

### Flux de données

```
Upload PDF
  → pdfParser.ts (extraction texte)
  → /api/ai (prompt parsing)
  → Gemini retourne JSON
  → useCVStore.updateCV()
  → CVPreview re-render
  → cvStorage.saveCV() (localStorage)

Chat utilisateur
  → /api/ai (prompt modification)
  → Gemini retourne JSON_UPDATE: {...} ou texte
  → Si JSON_UPDATE → useCVStore.updateCV() → CVPreview re-render
  → Si texte → addMessage('assistant', ...)

Export PDF
  → window.print()
  → @media print masque sidebar + toolbar

Partage lien
  → cvStorage.encodeCVToURL()
  → URL copiée dans presse-papier
  → À l'ouverture : decodeCVFromURL() → updateCV()
```

---

## Prompts Gemini

### Parsing PDF
```
system: Tu es un expert en parsing de CV. Analyse le texte et retourne UNIQUEMENT
        un objet JSON valide, sans texte avant ou après, sans backticks markdown.
        Structure : { name, tagline, contact[], summary,
        experience[{title, company, location, date, bullets[]}],
        education[{school, degree, date}], skills[], languages[] }

user:   Voici le texte extrait du CV : [texte PDF]
```

### Chat / modification
```
system: Tu es un expert en rédaction de CV. Pour une modification, commence ta
        réponse par JSON_UPDATE: suivi du JSON complet mis à jour.
        Pour une question générale, réponds en texte normal.
        Structure JSON : { name, tagline, contact[], summary,
        experience[{title, company, location, date, bullets[]}],
        education[{school, degree, date}], skills[], languages[] }

user:   CV actuel : [JSON stringifié]
        Demande : [message utilisateur]
```

---

## Contenu TikTok / Build in Public

CVRemaster est conçu pour être construit et partagé publiquement :
- Chaque feature = une vidéo
- L'outil lui-même démontre les capacités du vibe-coding
- Le fondateur est le premier utilisateur (son propre CV)
- Objectif : valider l'intérêt avant d'investir dans la V2

---

## Prochaines étapes après le MVP

1. Mettre en ligne sur Vercel (`cvremaster.com`)
2. Premier contenu TikTok : "J'ai construit un CV builder IA en une journée"
3. Collecter les retours des premiers utilisateurs
4. Décider si on ajoute Supabase pour la persistance cloud
5. Implémenter le paiement à l'export (Stripe)
6. Templates multiples