'use client'

import { useReducer, useEffect } from 'react'
import { CVData, Message } from '@/types/cv'
import {
  saveCV, loadCV,
  saveTemplate, loadTemplate,
  savePhoto, loadPhoto,
  saveShowPhoto, loadShowPhoto,
  saveShowHobbies, loadShowHobbies,
  saveShowSummary, loadShowSummary,
  saveHiddenBullets, loadHiddenBullets,
  saveSpacingScale, loadSpacingScale,
  CVVersion, loadVersions, saveVersion, upsertVersion as upsertVersionStorage, deleteVersion,
} from '@/lib/cvStorage'
import { normaliseCVData } from '@/lib/parseAIResponse'
import { updateProjectMeta } from '@/lib/projectStorage'

function detectCVLanguage(cv: CVData): string {
  const text = `${cv.tagline} ${cv.summary}`.toLowerCase()
  const frWords = /\b(je|un|une|les|des|est|dans|pour|avec|sur|par|mon|ma|mes|et|ou|en|au|du|qui|que|nous|vous|être|avoir|faire|notre|votre|leurs|cette|ces)\b/g
  return ((text.match(frWords) ?? []).length >= 3) ? 'fr' : 'en'
}

const WELCOME_MSG = 'Bonjour ! Uploadez votre CV PDF pour commencer, ou décrivez votre parcours.'
const INITIAL_MESSAGES: Message[] = [{ role: 'assistant', content: WELCOME_MSG }]

interface StoreState {
  cvData: CVData | null
  photo: string | null
  showPhoto: boolean
  showSummary: boolean
  showHobbies: boolean
  hiddenBullets: string[]
  spacingScale: number
  activeTemplateId: string
  activeLanguage: string
  labelLanguage: string
  versions: CVVersion[]
  messages: Message[]
  isLoading: boolean
}

type StoreAction =
  | { type: 'INIT'; payload: StoreState }
  | { type: 'SET_CV'; data: CVData }
  | { type: 'SET_PHOTO'; photo: string | null }
  | { type: 'SET_SHOW_PHOTO'; show: boolean }
  | { type: 'SET_SHOW_SUMMARY'; show: boolean }
  | { type: 'SET_SHOW_HOBBIES'; show: boolean }
  | { type: 'SET_HIDDEN_BULLETS'; hidden: string[] }
  | { type: 'SET_SPACING_SCALE'; scale: number }
  | { type: 'SET_TEMPLATE'; id: string }
  | { type: 'SET_LANGUAGE'; lang: string }
  | { type: 'SET_LABEL_LANGUAGE'; lang: string }
  | { type: 'SET_VERSIONS'; versions: CVVersion[] }
  | { type: 'PREPEND_VERSION'; version: CVVersion }
  | { type: 'REMOVE_VERSION'; id: string }
  | { type: 'ADD_MESSAGE'; role: Message['role']; content: string }
  | { type: 'SET_LOADING'; loading: boolean }

const DEFAULT_STATE: StoreState = {
  cvData: null,
  photo: null,
  showPhoto: true,
  showSummary: true,
  showHobbies: true,
  hiddenBullets: [],
  spacingScale: 1,
  activeTemplateId: 'classic',
  activeLanguage: 'fr',
  labelLanguage: 'fr',
  versions: [],
  messages: INITIAL_MESSAGES,
  isLoading: false,
}

function reducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'INIT': return action.payload
    case 'SET_CV': return { ...state, cvData: action.data }
    case 'SET_PHOTO': return { ...state, photo: action.photo }
    case 'SET_SHOW_PHOTO': return { ...state, showPhoto: action.show }
    case 'SET_SHOW_SUMMARY': return { ...state, showSummary: action.show }
    case 'SET_SHOW_HOBBIES': return { ...state, showHobbies: action.show }
    case 'SET_HIDDEN_BULLETS': return { ...state, hiddenBullets: action.hidden }
    case 'SET_SPACING_SCALE': return { ...state, spacingScale: action.scale }
    case 'SET_TEMPLATE': return { ...state, activeTemplateId: action.id }
    case 'SET_LANGUAGE': return { ...state, activeLanguage: action.lang }
    case 'SET_LABEL_LANGUAGE': return { ...state, labelLanguage: action.lang }
    case 'SET_VERSIONS': return { ...state, versions: action.versions }
    case 'PREPEND_VERSION': return { ...state, versions: [action.version, ...state.versions].slice(0, 20) }
    case 'REMOVE_VERSION': return { ...state, versions: state.versions.filter(v => v.id !== action.id) }
    case 'ADD_MESSAGE': return { ...state, messages: [...state.messages, { role: action.role, content: action.content }] }
    case 'SET_LOADING': return { ...state, isLoading: action.loading }
  }
}

function loadProjectState(projectId: string): StoreState {
  const savedPhoto = loadPhoto(projectId)
  const saved = loadCV(projectId)

  let cvData: CVData | null = null
  let language = 'fr'
  let messages = INITIAL_MESSAGES

  if (saved) {
    cvData = normaliseCVData(saved as unknown as Record<string, unknown>)
    try {
      const savedLang = localStorage.getItem(`cvremaster_language_${projectId}`)
      language = savedLang ?? detectCVLanguage(cvData)
    } catch {}
    messages = [
      ...INITIAL_MESSAGES,
      { role: 'assistant' as Message['role'], content: 'CV précédent restauré. Uploadez un nouveau PDF ou continuez à éditer.' },
    ]
  } else {
    try {
      const lang = localStorage.getItem(`cvremaster_language_${projectId}`)
      if (lang) language = lang
    } catch {}
  }

  let labelLanguage = language
  try {
    const savedLabelLang = localStorage.getItem(`cvremaster_label_language_${projectId}`)
    if (savedLabelLang) labelLanguage = savedLabelLang
  } catch {}

  return {
    cvData,
    photo: savedPhoto,
    showPhoto: loadShowPhoto(projectId),
    showSummary: loadShowSummary(projectId),
    showHobbies: loadShowHobbies(projectId),
    hiddenBullets: loadHiddenBullets(projectId),
    spacingScale: loadSpacingScale(projectId),
    activeTemplateId: loadTemplate(projectId),
    activeLanguage: language,
    labelLanguage,
    versions: loadVersions(projectId),
    messages,
    isLoading: false,
  }
}

export function useCVStore(projectId: string) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)

  useEffect(() => {
    if (!projectId) return
    dispatch({ type: 'INIT', payload: loadProjectState(projectId) })
  }, [projectId])

  function addMessage(role: Message['role'], content: string) {
    dispatch({ type: 'ADD_MESSAGE', role, content })
  }

  function setIsLoading(loading: boolean) {
    dispatch({ type: 'SET_LOADING', loading })
  }

  function updateCV(data: CVData) {
    dispatch({ type: 'SET_CV', data })
    saveCV(data, projectId)
    if (projectId) updateProjectMeta(projectId, { tagline: data.tagline })
  }

  function setTemplate(id: string) {
    dispatch({ type: 'SET_TEMPLATE', id })
    saveTemplate(id, projectId)
    if (projectId) updateProjectMeta(projectId, { templateId: id })
  }

  function setPhoto(dataUrl: string | null) {
    dispatch({ type: 'SET_PHOTO', photo: dataUrl })
    savePhoto(dataUrl, projectId)
  }

  function setShowPhoto(val: boolean) {
    dispatch({ type: 'SET_SHOW_PHOTO', show: val })
    saveShowPhoto(val, projectId)
  }

  function setShowSummary(val: boolean) {
    dispatch({ type: 'SET_SHOW_SUMMARY', show: val })
    saveShowSummary(val, projectId)
  }

  function setShowHobbies(val: boolean) {
    dispatch({ type: 'SET_SHOW_HOBBIES', show: val })
    saveShowHobbies(val, projectId)
  }

  function setSpacingScale(scale: number) {
    dispatch({ type: 'SET_SPACING_SCALE', scale })
    saveSpacingScale(scale, projectId)
  }

  function toggleHiddenBullet(key: string) {
    const current = state.hiddenBullets
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key]
    dispatch({ type: 'SET_HIDDEN_BULLETS', hidden: next })
    saveHiddenBullets(next, projectId)
  }

  function setActiveLanguage(lang: string) {
    dispatch({ type: 'SET_LANGUAGE', lang })
    try { localStorage.setItem(`cvremaster_language_${projectId}`, lang) } catch {}
    if (projectId) updateProjectMeta(projectId, { language: lang })
    // Keep section-title language in sync by default when the content itself gets translated.
    setLabelLanguage(lang)
  }

  function setLabelLanguage(lang: string) {
    dispatch({ type: 'SET_LABEL_LANGUAGE', lang })
    try { localStorage.setItem(`cvremaster_label_language_${projectId}`, lang) } catch {}
  }

  function createVersion(name: string, language?: string) {
    if (!state.cvData) return
    const v = saveVersion(name, state.cvData, state.activeTemplateId, language, projectId)
    dispatch({ type: 'PREPEND_VERSION', version: v })
  }

  function upsertVersion(name: string, language?: string) {
    if (!state.cvData) return
    upsertVersionStorage(name, state.cvData, state.activeTemplateId, language, projectId)
    dispatch({ type: 'SET_VERSIONS', versions: loadVersions(projectId) })
  }

  function restoreVersion(v: CVVersion) {
    updateCV(v.data)
    if (v.templateId) setTemplate(v.templateId)
    if (v.language) setActiveLanguage(v.language)
    addMessage('assistant', `Version "${v.name}" restaurée.`)
  }

  function removeVersion(id: string) {
    deleteVersion(id, projectId)
    dispatch({ type: 'REMOVE_VERSION', id })
  }

  const cvForDisplay: CVData | null = state.cvData
    ? {
        ...state.cvData,
        photo: (state.showPhoto && state.photo) ? state.photo : undefined,
        summary: state.showSummary ? state.cvData.summary : '',
        hobbies: state.showHobbies ? state.cvData.hobbies : undefined,
        experience: state.cvData.experience.map((exp, ei) => ({
          ...exp,
          bullets: exp.bullets.filter((_, bi) => !state.hiddenBullets.includes(`${ei}_${bi}`)),
        })),
      }
    : null

  return {
    projectId,
    cvData: cvForDisplay,
    rawCvData: state.cvData,
    photo: state.photo,
    showPhoto: state.showPhoto,
    showSummary: state.showSummary,
    showHobbies: state.showHobbies,
    hiddenBullets: state.hiddenBullets,
    spacingScale: state.spacingScale,
    activeTemplateId: state.activeTemplateId,
    activeLanguage: state.activeLanguage,
    setActiveLanguage,
    labelLanguage: state.labelLanguage,
    setLabelLanguage,
    versions: state.versions,
    messages: state.messages,
    isLoading: state.isLoading,
    setIsLoading,
    addMessage,
    updateCV,
    setTemplate,
    setPhoto,
    setShowPhoto,
    setShowSummary,
    setShowHobbies,
    setSpacingScale,
    toggleHiddenBullet,
    createVersion,
    upsertVersion,
    restoreVersion,
    removeVersion,
  }
}
