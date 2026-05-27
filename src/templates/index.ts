export interface TemplateInfo {
  id: string
  name: string
  description: string
  thumbnail: string
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Épuré, typographie sobre, sections séparées par lignes',
    thumbnail: 'classic',
  },
  {
    id: 'sidebar-dark',
    name: 'Sidebar Dark',
    description: 'Barre latérale sombre, photo en haut, barres de langues',
    thumbnail: 'sidebar-dark',
  },
  {
    id: 'teal-horizontal',
    name: 'Teal Horizontal',
    description: 'Accent teal, sections en lignes, labels à gauche',
    thumbnail: 'teal-horizontal',
  },
  {
    id: 'teal-sidebar',
    name: 'Teal Sidebar',
    description: 'Barre latérale claire, dates verticales, accents teal',
    thumbnail: 'teal-sidebar',
  },
  {
    id: 'navy-dark',
    name: 'Navy Dark',
    description: 'Sidebar navy foncé, timeline, photo circulaire',
    thumbnail: 'navy-dark',
  },
  {
    id: 'pastel-sidebar',
    name: 'Pastel',
    description: 'Photo circulaire pêche, bande colorée titre, très aéré',
    thumbnail: 'pastel-sidebar',
  },
]
