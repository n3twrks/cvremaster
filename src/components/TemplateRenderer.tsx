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
}

export default function TemplateRenderer({ cvData, templateId }: Props) {
  switch (templateId) {
    case 'sidebar-dark':     return <SidebarDarkTemplate cvData={cvData} />
    case 'teal-horizontal':  return <TealHorizontalTemplate cvData={cvData} />
    case 'teal-sidebar':     return <TealSidebarTemplate cvData={cvData} />
    case 'navy-dark':        return <NavyDarkTemplate cvData={cvData} />
    case 'pastel-sidebar':   return <PastelSidebarTemplate cvData={cvData} />
    default:                 return <ClassicTemplate cvData={cvData} />
  }
}
