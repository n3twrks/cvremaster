'use client'

import { useState, useEffect } from 'react'
import { CVData, Message } from '@/types/cv'
import { saveCV, loadCV, decodeCVFromURL, saveTemplate, loadTemplate, savePhoto, loadPhoto } from '@/lib/cvStorage'
import { normaliseCVData } from '@/lib/parseAIResponse'

export function useCVStore() {
  const [cvData, setCVData] = useState<CVData | null>(null)
  const [photo, setPhotoState] = useState<string | null>(null)
  const [activeTemplateId, setActiveTemplateId] = useState<string>('classic')
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Uploadez votre CV PDF pour commencer, ou décrivez votre parcours.' },
  ])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setActiveTemplateId(loadTemplate())
    const savedPhoto = loadPhoto()
    if (savedPhoto) setPhotoState(savedPhoto)

    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('cv')
    if (encoded) {
      const decoded = decodeCVFromURL(encoded)
      if (decoded) {
        setCVData(normaliseCVData(decoded as unknown as Record<string, unknown>))
        return
      }
    }
    const saved = loadCV()
    if (saved) {
      setCVData(normaliseCVData(saved as unknown as Record<string, unknown>))
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

  function setTemplate(id: string) {
    setActiveTemplateId(id)
    saveTemplate(id)
  }

  function setPhoto(dataUrl: string | null) {
    setPhotoState(dataUrl)
    savePhoto(dataUrl)
  }

  const cvWithPhoto: CVData | null = cvData
    ? { ...cvData, photo: photo ?? undefined }
    : null

  return {
    cvData: cvWithPhoto,
    photo,
    activeTemplateId,
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    updateCV,
    setTemplate,
    setPhoto,
  }
}
