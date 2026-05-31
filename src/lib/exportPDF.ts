import { CVData } from '@/types/cv'

const PAGE_W_MM = 210
const PAGE_H_MM = 297
const SCAN_WINDOW_PX = 120

function findSafeBreakY(canvas: HTMLCanvasElement, idealY: number): number {
  const ctx = canvas.getContext('2d')
  if (!ctx) return idealY

  const w = canvas.width
  const scanStart = Math.max(0, idealY - SCAN_WINDOW_PX)
  const windowH = idealY - scanStart
  if (windowH <= 0) return idealY

  // Skip left 35% (sidebar region in sidebar templates) — only check main content area
  const contentX = Math.floor(w * 0.35)
  const contentW = w - contentX

  const { data } = ctx.getImageData(contentX, scanStart, contentW, windowH)
  const sampleStride = 4
  const sampleCols = Math.ceil(contentW / sampleStride)
  const LUM_MIN = 242
  const MAX_DARK_RATIO = 0.025

  // Scan from the row closest to idealY upward — first safe row wins
  for (let row = windowH - 1; row >= 0; row--) {
    let darkCount = 0
    for (let col = 0; col < contentW; col += sampleStride) {
      const i = (row * contentW + col) * 4
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (lum < LUM_MIN) darkCount++
    }
    if (darkCount / sampleCols <= MAX_DARK_RATIO) {
      return scanStart + row
    }
  }

  return idealY
}

export async function downloadPDF(cv: CVData): Promise<void> {
  const el = document.getElementById('cv-content')
  if (!el) return

  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')

  const RENDER_WIDTH = 780
  const prevMaxWidth = el.style.maxWidth
  const prevWidth = el.style.width
  const prevBoxShadow = el.style.boxShadow

  el.style.setProperty('max-width', 'none', 'important')
  el.style.setProperty('width', `${RENDER_WIDTH}px`, 'important')
  el.style.setProperty('box-shadow', 'none', 'important')

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: RENDER_WIDTH,
      windowWidth: RENDER_WIDTH + 40,
    })

    const imgW = canvas.width
    const imgH = canvas.height
    const pxPerMm = imgW / PAGE_W_MM
    const pageHeightPx = Math.round(PAGE_H_MM * pxPerMm)
    const totalPages = Math.ceil(imgH / pageHeightPx)

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // Build smart break points — shift each boundary up to the nearest empty row
    const breakPoints: number[] = [0]
    for (let p = 1; p < totalPages; p++) {
      const idealY = Math.min(p * pageHeightPx, imgH)
      breakPoints.push(findSafeBreakY(canvas, idealY))
    }
    breakPoints.push(imgH)

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage()

      const srcY = breakPoints[page]
      // Cap at pageHeightPx so content never overflows the PDF page dimensions
      const sliceH = Math.min(breakPoints[page + 1] - srcY, pageHeightPx)

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = imgW
      pageCanvas.height = sliceH

      const ctx = pageCanvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, imgW, sliceH)
      ctx.drawImage(canvas, 0, srcY, imgW, sliceH, 0, 0, imgW, sliceH)

      const sliceHeightMm = sliceH / pxPerMm
      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, PAGE_W_MM, sliceHeightMm)
    }

    pdf.save(`${cv.name.replace(/\s+/g, '_')}_CV.pdf`)
  } finally {
    el.style.maxWidth = prevMaxWidth
    el.style.width = prevWidth
    el.style.boxShadow = prevBoxShadow
  }
}
