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
  hobbies?: string[]
  photo?: string
}

export interface Message {
  role: 'user' | 'assistant' | 'thinking'
  content: string
}

export interface SectionAnalysis {
  name: string
  score: number
  comment: string
  suggestions: string[]
}

export interface CVAnalysis {
  globalScore: number
  scores: {
    wording: number
    length: number
    impact: number
    coherence: number
  }
  sections: SectionAnalysis[]
  skills: {
    present: string[]
    toHighlight: string[]
    missing: string[]
  }
  recommendations: string[]
  savedRecommendations: string[]
  savedAt: string
}
