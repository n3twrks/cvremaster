# Feature — Multi-CV : Gestion de Projets de CV

**Statut :** À implémenter  
**Priorité :** Haute  
**Estimation :** 3–4h  
**Stack :** localStorage uniquement (pas de backend)

---

## Contexte & Motivation

Aujourd'hui, CVRemaster ne gère qu'un seul CV à la fois dans `localStorage`. Si l'utilisateur importe un nouveau PDF, il écrase son CV en cours. Il est impossible de travailler sur plusieurs CVs en parallèle (son propre CV, celui d'un proche, une version espagnole vs anglaise, etc.).

L'objectif est d'introduire un système de **projets CV** : chaque CV est un projet indépendant avec ses propres données, photo, versions, analyse IA et template. Un dashboard liste tous les projets et permet d'en créer, ouvrir, dupliquer et supprimer.

---

## User Stories

| # | En tant que... | Je veux... | Pour... |
|---|----------------|------------|---------|
| 1 | Utilisateur | Voir la liste de tous mes CVs sur un dashboard | Naviguer entre plusieurs projets |
| 2 | Utilisateur | Créer un nouveau projet CV vide | Commencer un nouveau CV from scratch |
| 3 | Utilisateur | Ouvrir un projet existant dans l'éditeur | Reprendre le travail là où je l'avais laissé |
| 4 | Utilisateur | Dupliquer un projet existant | Créer une variante (version EN, version Marketing...) |
| 5 | Utilisateur | Renommer un projet | Garder des noms lisibles ("CV Edwin", "CV Sœur", "CV EN") |
| 6 | Utilisateur | Supprimer un projet | Nettoyer les projets obsolètes |
| 7 | Utilisateur | Importer un PDF directement dans un nouveau projet | Bootstrapper un CV depuis un fichier existant |

---

## Architecture Technique

### Modèle de données

```typescript
// Entrée dans l'index des projets
interface CVProject {
  id: string          // ex: "cv_1748694000000"
  name: string        // ex: "CV Edwin — FR", "CV Sœur"
  createdAt: string   // ISO date
  lastModified: string // ISO date
  templateId: string  // template actif au moment de la dernière sauvegarde
  language: string    // langue active ("fr", "en"...)
  tagline?: string    // copié depuis cvData pour l'aperçu dans la card
}
```

### Clés localStorage par projet

Toutes les clés existantes deviennent scopées par `projectId` :

| Clé actuelle | Nouvelle clé |
|---|---|
| `cvremaster_data` | `cvremaster_data_${id}` |
| `cvremaster_photo` | `cvremaster_photo_${id}` |
| `cvremaster_template` | `cvremaster_template_${id}` |
| `cvremaster_show_photo` | `cvremaster_show_photo_${id}` |
| `cvremaster_versions` | `cvremaster_versions_${id}` |
| `cvremaster_language` | `cvremaster_language_${id}` |
| `cvremaster_analysis` | `cvremaster_analysis_${id}` |

**Nouvelle clé globale :**
- `cvremaster_projects` → `CVProject[]` (index de tous les projets)

### Fonctions à ajouter dans `cvStorage.ts`

```typescript
loadProjects(): CVProject[]
saveProjects(projects: CVProject[]): void
createProject(name: string): CVProject          // génère un id unique
updateProjectMeta(id, patch: Partial<CVProject>): void
deleteProject(id: string): void                 // supprime le projet + toutes ses clés
duplicateProject(id: string, newName: string): CVProject
```

### Modifications de `useCVStore.ts`

- Lire `projectId` depuis l'URL (`?project=xxx`) au montage
- Si aucun `projectId` dans l'URL → rediriger vers `/dashboard`
- Toutes les fonctions de storage (`saveCV`, `savePhoto`, etc.) utilisent les clés scopées
- Exposer `activeProjectId` dans le store

### Modifications de `cvStorage.ts` (fonctions existantes)

Chaque fonction existante reçoit un `projectId` optionnel :

```typescript
saveCV(data: CVData, projectId?: string): void
loadCV(projectId?: string): CVData | null
savePhoto(dataUrl, projectId?: string): void
// etc.
```

---

## Routes

| Route | Rôle |
|---|---|
| `/dashboard` | Page principale — liste des projets |
| `/cv?project=xxx` | Éditeur — charge le projet `xxx` |
| `/cv?project=new` | Crée un projet vide et redirige vers son éditeur |

**Redirection :**  
- `/` ou `/cv` sans `?project` → redirect vers `/dashboard`  
- Dashboard → clic "Ouvrir" → `/cv?project=${id}`  
- Dashboard → "Nouveau CV" → crée le projet → `/cv?project=${newId}`

---

## UI — Dashboard (`/dashboard`)

### Structure de la page

```
┌─────────────────────────────────────────────────────┐
│  CVRemaster                          [+ Nouveau CV]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Mes CVs (3)                                        │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  [EM]    │  │  [SC]    │  │  [EM]    │          │
│  │          │  │          │  │          │          │
│  │ CV Edwin │  │ CV Sœur  │  │ CV EN    │          │
│  │ — FR     │  │          │  │          │          │
│  │          │  │          │  │          │          │
│  │ 31 mai   │  │ 31 mai   │  │ 31 mai   │          │
│  │ [Ouvrir] │  │ [Ouvrir] │  │ [Ouvrir] │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Project Card

- **Initiales** de la personne (ex: "EM", "SC") en grand dans un cercle coloré (couleur générée depuis l'id)
- **Nom du projet** (éditable au double-clic)
- **Tagline** du CV tronquée (aperçu du contenu)
- **Date** de dernière modification (`il y a 2h`, `hier`, `31 mai`)
- **Bouton "Ouvrir"** → navigue vers `/cv?project=${id}`
- **Menu contextuel** (3 points `···`) :
  - Renommer
  - Dupliquer
  - Supprimer (avec confirmation)

### Bouton "Nouveau CV"

Ouvre une modale avec :
- Champ texte : "Nom du projet" (placeholder: "Mon CV")
- Option : importer un PDF directement (déclenche le PDF picker)
- Bouton "Créer"

---

## UI — Éditeur (`/cv?project=xxx`)

### Changements vs l'actuel

- **Breadcrumb** dans le header : `CVRemaster > CV Edwin` avec lien retour `← Dashboard`
- Toutes les opérations (save, version, analyse...) scopées au projet actif
- Pas d'autre changement visuel — l'éditeur reste identique

### Toolbar — Import PDF dans un projet existant

Le bouton "Importer PDF" existant **remplace** le CV du projet actif (avec confirmation) plutôt que de créer un nouveau projet.

---

## Compatibilité avec l'existant

### Migration des données

Au premier chargement après la mise à jour, si des données existent sous les anciennes clés non-scopées (`cvremaster_data`, `cvremaster_photo`, etc.) :

1. Créer automatiquement un projet "Mon CV" avec un id généré
2. Migrer les données vers les clés scopées
3. Supprimer les anciennes clés
4. Rediriger vers le dashboard

### Feature "Lien" (partage URL)

Le lien partageable (`?cv=xxx`) continue de fonctionner comme avant — il encode le CVData directement dans l'URL. À l'ouverture, on propose de **"Créer un projet"** depuis ce CV partagé au lieu de juste le charger en mémoire.

---

## Fichiers à créer / modifier

### Créer
- `src/app/(app)/dashboard/page.tsx` — page dashboard (existe déjà, à réécrire)
- `src/components/dashboard/ProjectCard.tsx`
- `src/components/dashboard/NewProjectModal.tsx`
- `src/lib/projectStorage.ts` — fonctions CRUD projets

### Modifier
- `src/lib/cvStorage.ts` — toutes les fonctions scopées par projectId
- `src/lib/analysisStorage.ts` — scopé par projectId
- `src/hooks/useCVStore.ts` — lecture projectId depuis URL, clés scopées
- `src/app/(app)/cv/page.tsx` — lire `?project=` depuis l'URL
- `src/components/Toolbar.tsx` — breadcrumb / retour dashboard
- `src/app/(app)/layout.tsx` ou header — lien retour dashboard

---

## Contraintes & Edge Cases

| Cas | Comportement attendu |
|---|---|
| URL `/cv` sans `?project` | Redirect vers `/dashboard` |
| `?project=xxx` inexistant | Redirect vers `/dashboard` avec toast "Projet introuvable" |
| Suppression du projet actif | Redirect vers `/dashboard` |
| localStorage plein | Toast d'erreur "Stockage insuffisant", suggestion de supprimer des projets |
| Dupliquer un projet avec photo | La photo (base64) est copiée dans la nouvelle clé scopée |
| Projet vide (pas encore de CV importé) | L'éditeur affiche l'état vide existant avec CTA "Importer un PDF" |

---

## Non-inclus dans cette version (future itération)

- Supabase / backend cloud (next step après validation locale)
- Partage d'un projet vers un autre utilisateur
- Collaboration temps réel
- Export / import d'un projet en JSON
- Dossiers / tags pour organiser les projets
