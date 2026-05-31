export interface SectionLabels {
  summary: string
  experience: string
  education: string
  skills: string
  languages: string
  hobbies: string
  contact: string
  expertise: string
}

const LABELS: Record<string, SectionLabels> = {
  fr: {
    summary:    'Profil',
    experience: 'Expérience',
    education:  'Formation',
    skills:     'Compétences',
    languages:  'Langues',
    hobbies:    "Centres d'intérêt",
    contact:    'Contact',
    expertise:  'Expertise',
  },
  en: {
    summary:    'Personal Summary',
    experience: 'Work Experience',
    education:  'Education',
    skills:     'Skills',
    languages:  'Languages',
    hobbies:    'Hobbies & Interests',
    contact:    'Contact',
    expertise:  'Expertise',
  },
  es: {
    summary:    'Perfil personal',
    experience: 'Experiencia profesional',
    education:  'Formación',
    skills:     'Habilidades',
    languages:  'Idiomas',
    hobbies:    'Intereses',
    contact:    'Contacto',
    expertise:  'Competencias',
  },
  pt: {
    summary:    'Perfil pessoal',
    experience: 'Experiência profissional',
    education:  'Formação',
    skills:     'Competências',
    languages:  'Idiomas',
    hobbies:    'Interesses',
    contact:    'Contacto',
    expertise:  'Especialização',
  },
  de: {
    summary:    'Persönliches Profil',
    experience: 'Berufserfahrung',
    education:  'Ausbildung',
    skills:     'Fähigkeiten',
    languages:  'Sprachen',
    hobbies:    'Hobbys & Interessen',
    contact:    'Kontakt',
    expertise:  'Expertise',
  },
  it: {
    summary:    'Profilo personale',
    experience: 'Esperienza professionale',
    education:  'Istruzione',
    skills:     'Competenze',
    languages:  'Lingue',
    hobbies:    'Hobby e interessi',
    contact:    'Contatto',
    expertise:  'Competenze chiave',
  },
}

export function getSectionLabels(langCode?: string): SectionLabels {
  const code = (langCode ?? 'en').toLowerCase().slice(0, 2)
  return LABELS[code] ?? LABELS.en
}
