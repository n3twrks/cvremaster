import { CVData } from '@/types/cv'

const PAGE_W_MM = 210
const PAGE_H_MM = 297
const SCALE = 2

// Must match A4_W_PX in CenterPanel so break positions align with the preview.
export const RENDER_WIDTH = 794

// Compute the CSS-pixel page height for the given render width.
export const SCREEN_PAGE_H = Math.round(PAGE_H_MM * RENDER_WIDTH / PAGE_W_MM)  // ≈ 1123

// ─── Break detection (CSS pixels, shared logic with CenterPanel) ──────────────

interface EntryBound { top: number; bottom: number }

/**
 * Given a list of .entry bounding boxes (in CSS px, relative to the container
 * top) and an ideal cut position, return the best cut that avoids slicing
 * through an experience / education block.
 *
 * Priority 1 – break just BEFORE an entry whose start is within SCAN of idealY
 *              and whose end is past idealY (the entry would be split).
 * Priority 2 – break just AFTER the entry whose end is closest to idealY.
 * Fallback   – idealY as-is.
 */
export function findEntryBreak(bounds: EntryBound[], idealY: number): number {
  const SCAN = 200  // CSS px

  // Priority 1: avoid cutting a straddling entry
  for (const { top, bottom } of bounds) {
    if (top < idealY && bottom > idealY && idealY - top <= SCAN) {
      return Math.max(top - 2, idealY - SCAN)
    }
  }

  // Priority 2: break right after the closest preceding entry end
  let bestEnd: number | null = null
  let bestDist = SCAN
  for (const { bottom } of bounds) {
    const dist = idealY - bottom
    if (dist > 0 && dist < bestDist) {
      bestDist = dist
      bestEnd = bottom
    }
  }
  return bestEnd ?? idealY
}

// ─── Per-column background color fill ────────────────────────────────────────

/**
 * Fill the entire page canvas with the background colors sampled from a
 * "guaranteed empty" row of the full document canvas.  The canvas is then
 * drawn on top, so only the empty/margin areas retain these background colors.
 */
function fillPageBackground(
  ctx: CanvasRenderingContext2D,
  fullCanvas: HTMLCanvasElement,
  sampleY: number,
  destW: number,
  destH: number,
): void {
  const fullCtx = fullCanvas.getContext('2d')!
  const { data } = fullCtx.getImageData(0, sampleY, destW, 1)

  // Group consecutive columns of the same color into a single fillRect.
  let runStart = 0
  for (let x = 1; x <= destW; x++) {
    const isEnd = x === destW
    if (!isEnd) {
      const i0 = runStart * 4
      const i1 = x * 4
      if (
        Math.abs(data[i1] - data[i0]) < 8 &&
        Math.abs(data[i1 + 1] - data[i0 + 1]) < 8 &&
        Math.abs(data[i1 + 2] - data[i0 + 2]) < 8
      ) continue
    }
    const i = runStart * 4
    ctx.fillStyle = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`
    ctx.fillRect(runStart, 0, x - runStart, destH)
    runStart = x
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function downloadPDF(cv: CVData): Promise<void> {
  const el = document.getElementById('cv-content')
  if (!el) return

  const html2canvas = (await import('html2canvas')).default
  const { jsPDF } = await import('jspdf')

  // Save original styles
  const prevMaxWidth = el.style.maxWidth
  const prevWidth = el.style.width
  const prevMinHeight = el.style.minHeight
  const prevBoxShadow = el.style.boxShadow

  el.style.setProperty('max-width', 'none', 'important')
  el.style.setProperty('width', `${RENDER_WIDTH}px`, 'important')
  el.style.setProperty('box-shadow', 'none', 'important')

  try {
    // ── Step 1: measure natural content height, then force the element to be
    //    exactly N full pages tall.  The sidebar (flexbox stretch) will fill
    //    the entire height in pure CSS — no pixel guessing needed.
    const naturalH = el.scrollHeight  // CSS px
    const totalPages = Math.ceil(naturalH / SCREEN_PAGE_H)
    // +24 px buffer so the last row is always in the empty background zone.
    const targetH = totalPages * SCREEN_PAGE_H + 24
    el.style.setProperty('min-height', `${targetH}px`, 'important')
    void el.scrollHeight  // force reflow

    // ── Step 2: capture entry bounds while the DOM is in its final layout.
    const elRect = el.getBoundingClientRect()
    const entryBoundsCss: EntryBound[] = Array.from(
      el.querySelectorAll<HTMLElement>('.entry')
    ).map(e => {
      const r = e.getBoundingClientRect()
      return { top: r.top - elRect.top, bottom: r.bottom - elRect.top }
    })

    // ── Step 3: render
    const canvas = await html2canvas(el, {
      scale: SCALE,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: RENDER_WIDTH,
      windowWidth: RENDER_WIDTH + 40,
    })

    const imgW = canvas.width                                           // = 1588
    const imgH = canvas.height
    const pxPerMm = imgW / PAGE_W_MM
    const pageHeightPx = Math.round(PAGE_H_MM * pxPerMm)               // ≈ 2246

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // ── Step 4: build smart break points (CSS px → canvas px)
    const breakPoints: number[] = [0]
    for (let p = 1; p < totalPages; p++) {
      const idealCss = p * SCREEN_PAGE_H
      const safeCss = findEntryBreak(entryBoundsCss, idealCss)
      breakPoints.push(Math.round(safeCss * SCALE))
    }
    breakPoints.push(imgH)

    // Sample the background from the very last row of the canvas (guaranteed
    // to be in the empty extension zone we added with the +24 px buffer).
    const bgSampleY = imgH - 2

    // ── Step 5: slice into pages
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage()

      const srcY = breakPoints[page]
      const sliceH = Math.min(breakPoints[page + 1] - srcY, pageHeightPx)

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = imgW
      pageCanvas.height = pageHeightPx   // always full A4

      const ctx = pageCanvas.getContext('2d')!

      // Pre-fill with the real background colors (sidebar color + white), then
      // draw the content on top.  Areas below the content retain the bg colors,
      // so the sidebar band always reaches the page bottom.
      fillPageBackground(ctx, canvas, bgSampleY, imgW, pageHeightPx)
      ctx.drawImage(canvas, 0, srcY, imgW, sliceH, 0, 0, imgW, sliceH)

      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, PAGE_W_MM, PAGE_H_MM)
    }

    pdf.save(`${cv.name.replace(/\s+/g, '_')}_CV.pdf`)
  } finally {
    el.style.maxWidth = prevMaxWidth
    el.style.width = prevWidth
    el.style.minHeight = prevMinHeight
    el.style.boxShadow = prevBoxShadow
  }
}
