import { CVData } from '@/types/cv'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const DPI = 2 // retina quality

export async function downloadPDF(cv: CVData): Promise<void> {
  const el = document.getElementById('cv-content')
  if (!el) return

  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')

  const canvas = await html2canvas(el, {
    scale: DPI,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  const imgData = canvas.toDataURL('image/jpeg', 0.97)
  const imgWidth = canvas.width
  const imgHeight = canvas.height

  // Scale image to A4 width, split into pages if needed
  const pxPerMm = imgWidth / A4_WIDTH_MM
  const pageHeightPx = A4_HEIGHT_MM * pxPerMm
  const totalPages = Math.ceil(imgHeight / pageHeightPx)

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage()

    // Create a page-sized canvas slice
    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = imgWidth
    pageCanvas.height = Math.min(pageHeightPx, imgHeight - page * pageHeightPx)

    const ctx = pageCanvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
    ctx.drawImage(canvas, 0, -page * pageHeightPx)

    const pageImg = pageCanvas.toDataURL('image/jpeg', 0.97)
    const sliceHeightMm = (pageCanvas.height / pxPerMm)
    pdf.addImage(pageImg, 'JPEG', 0, 0, A4_WIDTH_MM, sliceHeightMm)
  }

  pdf.save(`${cv.name.replace(/\s+/g, '_')}_CV.pdf`)
}
