# Feature — VocalXP : Contexte Vocal par Projet

**Statut :** À implémenter  
**Priorité :** Haute  
**Estimation :** 4–6h  
**Stack :** localStorage · Web Audio API · Gladia API (transcription)

---

## Contexte & Motivation

Le CV contient des informations factuelles, mais il manque de **profondeur humaine** : les nuances d'une expérience, les compétences non listées, la personnalité, les aspirations. Ces éléments sont difficiles à écrire mais faciles à *dire*.

L'idée : permettre à l'utilisateur de **parler librement** — sur son parcours, ses postes, ses compétences — et de transformer cet oral en un **fichier de contexte structuré** réutilisable. Ce contexte devient le carburant de l'IA pour enrichir le CV, le résumé, et plus tard les lettres de motivation.

---

## User Stories

| # | En tant que... | Je veux... | Pour... |
|---|----------------|------------|---------|
| 1 | Utilisateur | Enregistrer un audio depuis l'interface | Parler librement de mon expérience sans écrire |
| 2 | Utilisateur | Uploader un fichier audio existant | Réutiliser une note vocale déjà enregistrée |
| 3 | Utilisateur | Voir la transcription de mon audio | Vérifier et corriger le résultat |
| 4 | Utilisateur | Avoir des slots de contexte thématiques | Organiser mon discours par catégorie |
| 5 | Utilisateur | Injecter un contexte dans le chat IA | Enrichir mon CV avec ce que j'ai dit |
| 6 | Utilisateur | Que le contexte soit persistant par projet | Retrouver mes notes vocales à chaque session |
| 7 | Utilisateur | Supprimer ou re-enregistrer un slot | Mettre à jour une entrée obsolète |

---

## Slots de Contexte

L'interface propose **des slots pré-définis** basés sur les sections du CV actif, plus des slots fixes :

### Slots fixes (toujours présents)

| Slot | Invite vocale | Exemple d'utilisation |
|------|--------------|----------------------|
| **Profil global** | *"Décrivez-vous en quelques minutes : qui vous êtes, ce que vous faites, vos forces, ce que vous recherchez."* | Résumé CV, accroche lettre de motivation |
| **Compétences & expertise** | *"Quelles sont vos compétences clés ? Dans quels domaines excellez-vous ?"* | Section compétences, bullet points |
| **Aspirations** | *"Qu'est-ce que vous recherchez dans votre prochain poste ? Qu'aimez-vous dans votre travail ?"* | Lettre de motivation, objectif de carrière |

### Slots dynamiques (générés depuis le CV actif)

| Slot | Invite vocale |
|------|--------------|
| **Parcours scolaire** | *"Parlez de votre parcours scolaire : établissements, formations, ce que vous en avez retenu."* |
| **[Titre poste] chez [Entreprise]** (un par expérience) | *"Parlez de votre expérience chez [Entreprise] : missions, réalisations, contexte, difficultés surmontées."* |

> Les slots d'expérience sont générés automatiquement depuis `cvData.experience[]`. Si le CV est vide, seuls les slots fixes sont affichés.

---

## Architecture Technique

### Modèle de données

```typescript
// Un slot de contexte vocal
interface ContextEntry {
  id: string               // ex: "ctx_education", "ctx_exp_0", "ctx_profile"
  type: 'profile' | 'education' | 'experience' | 'skills' | 'aspirations'
  label: string            // "Profil global", "Chez Accenture (2019–2022)"
  transcript: string       // texte transcrit (éditable)
  transcribedAt?: string   // ISO date de la dernière transcription
  durationSec?: number     // durée de l'audio transcrit
  isEdited?: boolean       // l'utilisateur a modifié manuellement la transcription
}

// Pack de contexte complet pour un projet
interface ContextPack {
  entries: ContextEntry[]
  updatedAt: string
}
```

> **Note :** L'audio brut n'est **pas** stocké en localStorage (trop lourd). Seule la transcription est persistée.

### Clés localStorage

```
cvremaster_context_${projectId}  →  ContextPack (JSON)
cvremaster_gladia_key            →  string (clé API Gladia, globale)
```

### Fichier à créer : `src/lib/contextStorage.ts`

```typescript
loadContextPack(projectId: string): ContextPack
saveContextPack(projectId: string, pack: ContextPack): void
clearContextPack(projectId: string): void
```

---

## Intégration Gladia API

### Pourquoi Gladia

- **10h gratuites / mois** — largement suffisant pour le MVP
- Transcription multilingue (détection automatique FR/EN)
- Timestamps au mot — utile pour l'affichage
- Async API simple (upload fichier → polling résultat)
- Real-time via WebSocket (pour l'enregistrement direct)

### Clé API

- Stockée dans `localStorage` sous `cvremaster_gladia_key`
- Saisie dans `/settings` (champ similaire à la clé Claude)
- Affichée avec un bandeau d'avertissement si absente (comme `ApiKeyBanner`)

### Flow Async (upload de fichier ou fin d'enregistrement)

```
1. POST https://api.gladia.io/v2/upload
   Body: multipart/form-data { audio: File }
   → { audio_url: string }

2. POST https://api.gladia.io/v2/transcription
   Body: { audio_url, language_behaviour: "automatic single language",
           diarization: false }
   → { id: string, status: "queued" }

3. GET https://api.gladia.io/v2/transcription/{id}
   Poll toutes les 2s jusqu'à status === "done"
   → { result: { transcription: { full_transcript: string } } }
```

### Flow Real-time (enregistrement direct depuis le navigateur)

```
1. getUserMedia({ audio: true })
2. MediaRecorder → chunks audio (webm/opus ou wav)
3. WebSocket ws://api.gladia.io/audio/text/audio-transcription/
   Headers: { x-gladia-key: API_KEY }
4. Envoyer chunks → recevoir transcript partiel en temps réel
5. À l'arrêt : envoyer signal "stop" → transcript final
```

> Pour la v1, le **flow async est suffisant** (enregistrement → fin → transcription). Le real-time peut être un bonus ou v2.

---

## UI — Panel "Contexte Vocal"

### Emplacement dans l'éditeur

Nouveau 3ème tab dans le **Sidebar droit** (actuellement : Chat | Analyser) :

```
┌──────────────────────────────┐
│  [Chat]  [Analyser]  [Voix]  │
├──────────────────────────────┤
│  ...                         │
```

### Structure du panel

```
┌─────────────────────────────────────────┐
│  Contexte Vocal                    [?]  │
│  Parlez de votre expérience pour        │
│  enrichir votre CV et vos lettres.      │
├─────────────────────────────────────────┤
│                                         │
│  ▸ Profil global              [●] [↑]  │
│    Décrivez-vous en quelques…           │
│    ─────────────────────────────        │
│    [Aucun contexte — Enregistrer]       │
│                                         │
│  ▸ Compétences & expertise    [●] [↑]  │
│    …                                    │
│                                         │
│  ▸ Aspirations                [●] [↑]  │
│    …                                    │
│                                         │
│  ── Parcours scolaire ─────────────     │
│  ▸ Parcours scolaire          [●] [↑]  │
│    …                                    │
│                                         │
│  ── Expériences ───────────────────     │
│  ▸ Product Manager @ Accenture         │
│    ● 2 min 34s • 12 juin 2025  [✎][↺] │
│    "J'ai rejoint Accenture en 2019…"   │
│    [Utiliser dans le chat →]           │
│                                         │
└─────────────────────────────────────────┘
```

### Slot vide (pas encore de contexte)

- Invite vocale affichée en italique gris
- Bouton `● Enregistrer` (rouge pulsant pendant l'enregistrement)
- Bouton `↑ Uploader` (file picker, formats: mp3, wav, m4a, webm, ogg)

### Enregistrement en cours

```
┌─────────────────────────────┐
│  ● 01:23   [■ Arrêter]      │
│  ▓▒░▒▓░▒▓▓░░▒             │  ← waveform animée (AudioContext)
└─────────────────────────────┘
```

- Timer en temps réel
- Waveform visuelle (AnalyserNode → dessin canvas)
- Bouton "Arrêter" → déclenche la transcription

### Slot transcrit (contexte disponible)

- Durée de l'audio + date
- Extrait de la transcription (3 premières lignes tronquées)
- Bouton `✎` → modale d'édition du texte brut
- Bouton `↺` → re-enregistrer (confirmation requise)
- Bouton **"Utiliser dans le chat →"** → injecte dans le chat IA

### Modale d'édition de transcription

Simple textarea plein écran avec :
- Transcription brute éditable
- Indicateur `[modifié manuellement]` si édité
- Bouton "Sauvegarder"

---

## Injection dans le Chat IA

Quand l'utilisateur clique **"Utiliser dans le chat →"** sur un slot transcrit :

1. Le panel switche sur l'onglet **Chat**
2. Un message est automatiquement envoyé :

```
[Contexte vocal — Profil global]
"J'ai 8 ans d'expérience en product management…"

Sur la base de ce contexte, enrichis et améliore les sections 
pertinentes de mon CV (summary, compétences, expériences) en 
conservant un ton professionnel et en restant fidèle aux faits 
mentionnés.
```

3. L'IA répond avec un `PATCH_UPDATE` ou `JSON_UPDATE` ciblé

### Prompt système enrichi (à injecter dans le SYSTEM_PROMPT du chat)

Lorsqu'un contexte vocal existe, les informations sont ajoutées en fin de prompt système :

```
[CONTEXTE ADDITIONNEL FOURNI PAR L'UTILISATEUR]
Profil : "…"
Compétences : "…"
Expérience Accenture : "…"
Utilisez ces informations pour enrichir, préciser ou valider 
les modifications demandées. Ne les inventez pas, elles viennent 
directement de la bouche de l'utilisateur.
```

---

## Compatibilité Cover Letters (future itération)

Le `ContextPack` sera transmis à la génération de lettres de motivation :

```
Lettre de motivation = CV + ContextPack + Fiche de poste + Recherche web entreprise
```

Les slots les plus utiles pour la cover letter :
- **Profil global** → accroche
- **Aspirations** → pourquoi ce poste
- **Expériences** → preuves concrètes de compétences

---

## Fichiers à créer / modifier

### Créer
- `src/lib/contextStorage.ts` — CRUD ContextPack
- `src/lib/gladiaAPI.ts` — wrapper Gladia (upload, transcription, polling)
- `src/components/VoiceContext/VoiceContextPanel.tsx` — panel principal
- `src/components/VoiceContext/ContextSlot.tsx` — un slot individuel
- `src/components/VoiceContext/AudioRecorder.tsx` — enregistrement + waveform
- `src/components/VoiceContext/TranscriptEditor.tsx` — modale d'édition

### Modifier
- `src/components/Sidebar.tsx` — ajouter l'onglet "Voix" (3ème tab)
- `src/app/(app)/cv/page.tsx` — passer `cvData` pour les slots dynamiques
- `src/components/Sidebar.tsx` — enrichir `SYSTEM_PROMPT` avec le contexte si disponible
- `src/app/(app)/settings/page.tsx` — champ clé API Gladia
- `src/lib/projectStorage.ts` — `deleteProject()` doit aussi supprimer `cvremaster_context_${id}`

---

## Contraintes & Edge Cases

| Cas | Comportement attendu |
|-----|----------------------|
| Clé Gladia absente | Bandeau `GladiaKeyBanner` (comme `ApiKeyBanner`) |
| Enregistrement > 15 min | Avertissement à 10 min, arrêt auto à 15 min |
| Formats audio non supportés | Message d'erreur "Format non supporté (MP3, WAV, M4A, WebM)" |
| Transcription échouée | Message d'erreur + conserver l'audio pour réessayer |
| localStorage plein | Toast erreur, suggestion de supprimer des contextes |
| CV vide (pas d'expériences) | Seuls les 3 slots fixes sont affichés |
| Micro non autorisé | Message "Accès micro refusé — uploadez un fichier à la place" |
| Re-enregistrement d'un slot existant | Confirmation "Êtes-vous sûr ? Le contexte actuel sera écrasé." |

---

## Non-inclus dans cette version (futures itérations)

- Transcription real-time (affichage mot par mot pendant l'enregistrement)
- Résumé automatique du contexte par l'IA (après transcription)
- Contexte partageable entre projets
- Export du ContextPack en TXT/Markdown
- Synchronisation Supabase du ContextPack
- Détection automatique de la langue de l'audio
