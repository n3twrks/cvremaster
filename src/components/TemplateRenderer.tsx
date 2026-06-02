import { CVData } from '@/types/cv'
import ClassicTemplate from '@/templates/ClassicTemplate'
import SidebarDarkTemplate from '@/templates/SidebarDarkTemplate'
import TealHorizontalTemplate from '@/templates/TealHorizontalTemplate'
import TealSidebarTemplate from '@/templates/TealSidebarTemplate'
import NavyDarkTemplate from '@/templates/NavyDarkTemplate'
import PastelSidebarTemplate from '@/templates/PastelSidebarTemplate'

interface Props {
  cvData: CVData
  templateId: string
  language?: string
  spacingScale?: number
}

export default function TemplateRenderer({ cvData, templateId, language, spacingScale = 1 }: Props) {
  switch (templateId) {
    case 'sidebar-dark':     return <SidebarDarkTemplate cvData={cvData} language={language} spacingScale={spacingScale} />
    case 'teal-horizontal':  return <TealHorizontalTemplate cvData={cvData} language={language} spacingScale={spacingScale} />
    case 'teal-sidebar':     return <TealSidebarTemplate cvData={cvData} language={language} spacingScale={spacingScale} />
    case 'navy-dark':        return <NavyDarkTemplate cvData={cvData} language={language} spacingScale={spacingScale} />
    case 'pastel-sidebar':   return <PastelSidebarTemplate cvData={cvData} language={language} spacingScale={spacingScale} />
    default:                 return <ClassicTemplate cvData={cvData} language={language} spacingScale={spacingScale} />
  }
}
