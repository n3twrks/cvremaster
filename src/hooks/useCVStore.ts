'use client'

import { useState, useEffect } from 'react'
import { CVData, Message } from '@/types/cv'
import {
  saveCV, loadCV, decodeCVFromURL,
  saveTemplate, loadTemplate,
  savePhoto, loadPhoto,
  saveShowPhoto, loadShowPhoto,
  CVVersion, loadVersions, saveVersion, upsertVersion as upsertVersionStorage, deleteVersion,
} from '@/lib/cvStorage'
import { normaliseCVData } from '@/lib/parseAIResponse'

const LANGUAGE_KEY = 'cvremaster_language'

function detectCVLanguage(cv: CVData): string {
  const text = `${cv.tagline} ${cv.summary}`.toLowerCase()
  const frWords = /\b(je|un|une|les|des|est|dans|pour|avec|sur|par|mon|ma|mes|et|ou|en|au|du|qui|que|nous|vous|être|avoir|faire|notre|votre|leurs|cette|ces)\b/g
  return ((text.match(frWords) ?? []).length >= 3) ? 'fr' : 'en'
}

export function useCVStore() {
  const [cvData, setCVData] = useState<CVData | null>(null)
  const [photo, setPhotoState] = useState<string | null>(null)
  const [showPhoto, setShowPhotoState] = useState<boolean>(true)
  const [activeTemplateId, setActiveTemplateId] = useState<string>('classic')
  const [activeLanguage, setActiveLanguageState] = useState<string>('fr')
  const [versions, setVersions] = useState<CVVersion[]>([])
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Uploadez votre CV PDF pour commencer, ou décrivez votre parcours.' },
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setActiveTemplateId(loadTemplate())
    setShowPhotoState(loadShowPhoto())
    setVersions(loadVersions())

    const savedPhoto = loadPhoto()
    if (savedPhoto) setPhotoState(savedPhoto)

    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('cv')
    if (encoded) {
      const decoded = decodeCVFromURL(encoded)
      if (decoded) {
        const cv = normaliseCVData(decoded as unknown as Record<string, unknown>)
        setCVData(cv)
        // Auto-detect language only if user hasn't explicitly set one
        const savedLang = localStorage.getItem(LANGUAGE_KEY)
        setActiveLanguageState(savedLang ?? detectCVLanguage(cv))
        return
      }
    }
    const saved = loadCV()
    if (saved) {
      const cv = normaliseCVData(saved as unknown as Record<string, unknown>)
      setCVData(cv)
      // Auto-detect language only if user hasn't explicitly set one
      const savedLang = localStorage.getItem(LANGUAGE_KEY)
      setActiveLanguageState(savedLang ?? detectCVLanguage(cv))
      addMessage('assistant', 'CV précédent restauré. Uploadez un nouveau PDF ou continuez à éditer.')
    } else {
      try {
        const lang = localStorage.getItem(LANGUAGE_KEY)
        if (lang) setActiveLanguageState(lang)
      } catch {}
    }
  }, [])

  function addMessage(role: Message['role'], content: string) {
    setMessages(prev => [...prev, { role, content }])
  }

  function updateCV(data: CVData) {
    setCVData(data)
    saveCV(data)
  }

  function setTemplate(id: string) {
    setActiveTemplateId(id)
    saveTemplate(id)
  }

  function setPhoto(dataUrl: string | null) {
    setPhotoState(dataUrl)
    savePhoto(dataUrl)
  }

  function setShowPhoto(val: boolean) {
    setShowPhotoState(val)
    saveShowPhoto(val)
  }

  function setActiveLanguage(lang: string) {
    setActiveLanguageState(lang)
    try { localStorage.setItem(LANGUAGE_KEY, lang) } catch {}
  }

  function createVersion(name: string, language?: string) {
    if (!cvData) return
    const v = saveVersion(name, cvData, activeTemplateId, language)
    setVersions(prev => [v, ...prev].slice(0, 20))
  }

  function upsertVersion(name: string, language?: string) {
    if (!cvData) return
    upsertVersionStorage(name, cvData, activeTemplateId, language)
    setVersions(loadVersions())
  }

  function restoreVersion(v: CVVersion) {
    updateCV(v.data)
    if (v.templateId) setTemplate(v.templateId)
    if (v.language) setActiveLanguage(v.language)
    addMessage('assistant', `Version "${v.name}" restaurée.`)
  }

  function removeVersion(id: string) {
    deleteVersion(id)
    setVersions(prev => prev.filter(v => v.id !== id))
  }

  // Merge photo into cvData for template rendering
  const cvWithPhoto: CVData | null = cvData
    ? { ...cvData, photo: (showPhoto && photo) ? photo : undefined }
    : null

  return {
    cvData: cvWithPhoto,
    photo,
    showPhoto,
    activeTemplateId,
    activeLanguage,
    setActiveLanguage,
    versions,
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    updateCV,
    setTemplate,
    setPhoto,
    setShowPhoto,
    createVersion,
    upsertVersion,
    restoreVersion,
    removeVersion,
  }
}
