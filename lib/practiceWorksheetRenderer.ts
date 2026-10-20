import { PRACTICE_LETTERS } from '@/data/practiceLetters'
import { drawUrduGuide } from './urduTracing'
import type { WorksheetLayout, WorksheetRenderOptions, WorksheetRenderResult } from './worksheetRenderer'

const WIDTH = 1000
const HEIGHT = 1414
const MARGIN = 70
const GRID_WIDTH = WIDTH - MARGIN * 2
const ROWS_PER_PAGE = 5
const imageCache = new Map<string, Promise<HTMLImageElement>>()

export function getWorksheetPageCount(layout: WorksheetLayout, itemCount: number) {
  if (layout === 'matching' || layout === 'tracing') return 1
  return Math.max(1, Math.ceil(itemCount / (layout === 'letter-focus' ? 1 : ROWS_PER_PAGE)))
}

function imageFor(src: string) {
  if (!imageCache.has(src)) {
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => { imageCache.delete(src); reject(new Error('Could not load a worksheet picture. Please try again.')) }
      image.src = src
    })
    imageCache.set(src, promise)
  }
  return imageCache.get(src)!
}

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius = 14) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 18, color = '#526171', align: CanvasTextAlign = 'left') {
  ctx.direction = 'ltr'
  ctx.textAlign = align
  ctx.fillStyle = color
  ctx.font = `${size}px Arial, sans-serif`
  ctx.fillText(text, x, y)
}

function urdu(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 28, maxWidth = 820) {
  ctx.direction = 'rtl'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#182230'
  ctx.font = `${size}px "Noto Nastaliq Urdu", serif`
  const measuredWidth = ctx.measureText(text).width
  if (measuredWidth > maxWidth) ctx.font = `${size * maxWidth / measuredWidth}px "Noto Nastaliq Urdu", serif`
  ctx.fillText(text, x, y)
  ctx.direction = 'ltr'
}

function writingLines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, scale = 1) {
  ctx.save()
  for (const [position, dashed, strong] of [[20, false, false], [50, true, false], [80, false, true], [112, false, false]] as const) {
    ctx.strokeStyle = strong ? '#98a5b1' : '#d7dfe5'
    ctx.lineWidth = strong ? 1.4 : 1
    ctx.setLineDash(dashed ? [5, 5] : [])
    ctx.beginPath()
    ctx.moveTo(x, y + position * scale)
    ctx.lineTo(x + w, y + position * scale)
    ctx.stroke()
  }
  ctx.restore()
}

async function picture(ctx: CanvasRenderingContext2D, src: string, x: number, y: number, w: number, h: number, bw: boolean) {
  const image = await imageFor(src)
  const ratio = Math.min(w / image.naturalWidth, h / image.naturalHeight)
  const iw = image.naturalWidth * ratio
  const ih = image.naturalHeight * ratio
  ctx.save()
  if (bw) ctx.filter = 'grayscale(1)'
  ctx.drawImage(image, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih)
  ctx.restore()
}

/** Stable puzzles keep the preview and downloaded page identical. */
export function getLetterChoices(target: string, seed: number, row: number) {
  let state = ((seed || 1) ^ (row * 2654435761) ^ target.codePointAt(0)!) >>> 0
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296 }
  const pool = PRACTICE_LETTERS.map((letter) => letter.char).filter((char) => char !== target)
  const choices = [target, target]
  for (let i = 0; i < 4; i++) choices.push(pool.splice(Math.floor(random() * pool.length), 1)[0])
  for (let i = choices.length - 1; i > 0; i--) {
    const next = Math.floor(random() * (i + 1))
    ;[choices[i], choices[next]] = [choices[next], choices[i]]
  }
  return choices
}

export async function buildPracticeWorksheetCanvas({
  left: items,
  title = 'Urdu Letter Tracing / اردو حروف کی مشق',
  bgType = 'bw',
  scaleFactor = 1,
  colorBackgroundIndex = 0,
  layout = 'tracing',
  pageIndex = 0,
  seed = 1,
}: WorksheetRenderOptions): Promise<WorksheetRenderResult> {
  const pageCount = getWorksheetPageCount(layout, items.length)
  const currentPage = Math.min(Math.max(0, pageIndex), pageCount - 1)
  const perPage = layout === 'letter-focus' ? 1 : ROWS_PER_PAGE
  const pageItems = layout === 'tracing' ? items : items.slice(currentPage * perPage, (currentPage + 1) * perPage)
  // The writing guides are vector pen paths. Fonts are only used for captions.
  await document.fonts.load('30px "Noto Nastaliq Urdu"', title + pageItems.map((item) => item.word || '').join('')).catch(() => [])
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(WIDTH * scaleFactor)
  canvas.height = Math.round(HEIGHT * scaleFactor)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')
  ctx.scale(scaleFactor, scaleFactor)
  const color = bgType === 'color'
  const accent = color ? ['#6d28d9', '#0f766e', '#be185d', '#1d4ed8'][Math.abs(colorBackgroundIndex) % 4] : '#243243'
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.strokeStyle = color ? '#ddd6ef' : '#d3dae0'
  ctx.lineWidth = 1.4
  box(ctx, 33, 30, WIDTH - 66, HEIGHT - 60, 20)
  ctx.stroke()
  ctx.fillStyle = accent
  box(ctx, 70, 38, 88, 5, 2)
  ctx.fill()

  label(ctx, 'Name:', 70, 86, 20, '#243243')
  label(ctx, 'Date:', 638, 86, 20, '#243243')
  ctx.strokeStyle = '#9aa6b1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(140, 90); ctx.lineTo(560, 90)
  ctx.moveTo(698, 90); ctx.lineTo(930, 90)
  ctx.stroke()
  const [englishTitle, urduTitle] = title.split(' / ')
  ctx.textAlign = 'center'
  ctx.fillStyle = accent
  ctx.font = 'bold 35px Arial, sans-serif'
  ctx.fillText(englishTitle, WIDTH / 2, 153, 850)
  urdu(ctx, urduTitle || 'اردو حروف کی مشق', WIDTH / 2, 202, 29)

  const instructions: Partial<Record<WorksheetLayout, string>> = {
    tracing: 'Trace each letter along its dotted line. Remember its dots.',
    'writing-rows': 'Look at the model. Trace the dots, then write on your own.',
    'picture-rows': 'Say the picture word. Trace its first letter, then try writing it.',
    'letter-focus': 'Look, say, trace, and write. Start at the right of each row.',
    'letter-find': 'Look at the letter on the right. Circle every matching letter.',
  }
  label(ctx, instructions[layout] || '', WIDTH / 2, 254, 19, '#526171', 'center')
  ctx.strokeStyle = '#e2e7ec'
  ctx.beginPath(); ctx.moveTo(MARGIN, 276); ctx.lineTo(WIDTH - MARGIN, 276); ctx.stroke()

  if (layout === 'tracing') {
    const columns = Math.min(5, Math.max(1, pageItems.length))
    const rows = Math.max(1, Math.ceil(pageItems.length / columns))
    const cellWidth = GRID_WIDTH / columns
    const cellHeight = Math.min(185, 980 / rows)
    pageItems.forEach((item, index) => {
      const column = columns - 1 - (index % columns)
      const row = Math.floor(index / columns)
      drawUrduGuide(ctx, item.label!, MARGIN + column * cellWidth + 18, 302 + row * cellHeight, cellWidth - 36, cellHeight - 13)
    })
  } else if (layout === 'writing-rows' || layout === 'picture-rows') {
    const withPictures = layout === 'picture-rows'
    const columns = withPictures ? 7 : 6
    const cellWidth = GRID_WIDTH / columns
    label(ctx, withPictures ? 'PICTURE' : 'LOOK', WIDTH - MARGIN - cellWidth / 2, 305, 13, '#64748b', 'center')
    label(ctx, 'TRACE', 530, 305, 13, '#64748b', 'center')
    label(ctx, 'TRY', 160, 305, 13, '#64748b', 'center')
    for (const [row, item] of pageItems.entries()) {
      const y = 326 + row * 188
      writingLines(ctx, MARGIN, y + 7, GRID_WIDTH - (withPictures ? cellWidth : 0))
      if (withPictures && item.src) {
        await picture(ctx, item.src, WIDTH - MARGIN - cellWidth + 17, y + 8, cellWidth - 34, 96, !color)
        urdu(ctx, item.word || '', WIDTH - MARGIN - cellWidth / 2, y + 143, 22, cellWidth - 10)
      }
      for (let column = withPictures ? 1 : 0; column < columns; column++) {
        const modelColumn = withPictures ? 1 : 0
        if (column > modelColumn + 3) continue
        drawUrduGuide(ctx, item.label!, WIDTH - MARGIN - (column + 1) * cellWidth + 8, y + 7, cellWidth - 16, 120, {
          dotted: column !== modelColumn,
          color: column === modelColumn ? accent : '#637080',
        })
      }
      label(ctx, 'Start here', WIDTH - MARGIN - (withPictures ? cellWidth * 1.5 : cellWidth / 2), y + 160, 12, '#6b7785', 'center')
    }
  } else if (layout === 'letter-focus' && pageItems[0]) {
    const item = pageItems[0]
    ctx.fillStyle = color ? '#faf7ff' : '#f8fafb'
    box(ctx, MARGIN, 304, GRID_WIDTH, 245, 18)
    ctx.fill()
    drawUrduGuide(ctx, item.label!, 132, 318, 180, 216, { dotted: false, color: accent })
    if (item.src) await picture(ctx, item.src, 720, 320, 160, 160, !color)
    urdu(ctx, `${item.label} سے ${item.word || ''}`, 505, 401, 32, 330)
    label(ctx, item.name || '', 505, 470, 18, '#64748b', 'center')
    if (item.word) urdu(ctx, item.word, 800, 516, 25, 175)
    const cellWidth = GRID_WIDTH / 6
    for (let row = 0; row < 5; row++) {
      const y = 586 + row * 137
      writingLines(ctx, MARGIN, y, GRID_WIDTH, 0.92)
      const guided = [6, 3, 1, 0, 0][row]
      for (let column = 0; column < guided; column++) {
        drawUrduGuide(ctx, item.label!, WIDTH - MARGIN - (column + 1) * cellWidth + 22, y, cellWidth - 44, 110.4, {
          dotted: !(row === 0 && column === 0),
          color: row === 0 && column === 0 ? accent : '#637080',
        })
      }
    }
  } else if (layout === 'letter-find') {
    const cellWidth = GRID_WIDTH / 7
    label(ctx, 'FIND', WIDTH - MARGIN - cellWidth / 2, 305, 13, '#64748b', 'center')
    pageItems.forEach((item, row) => {
      const y = 326 + row * 188
      ctx.fillStyle = color ? '#f5f0ff' : '#f3f5f7'
      box(ctx, WIDTH - MARGIN - cellWidth + 7, y, cellWidth - 14, 138)
      ctx.fill()
      drawUrduGuide(ctx, item.label!, WIDTH - MARGIN - cellWidth + 16, y + 7, cellWidth - 32, 120, { dotted: false, color: accent })
      getLetterChoices(item.label!, seed, currentPage * ROWS_PER_PAGE + row).forEach((char, column) => {
        drawUrduGuide(ctx, char, MARGIN + column * cellWidth + 21, y + 7, cellWidth - 42, 120, { dotted: false, color: '#243243' })
      })
      ctx.strokeStyle = '#e2e7ec'
      ctx.beginPath(); ctx.moveTo(MARGIN, y + 162); ctx.lineTo(WIDTH - MARGIN, y + 162); ctx.stroke()
    })
  }

  label(ctx, 'AIEarlyEdge · Urdu Learning', MARGIN, HEIGHT - 58, 15)
  label(ctx, `Page ${currentPage + 1} of ${pageCount}`, WIDTH - MARGIN, HEIGHT - 58, 15, '#526171', 'right')
  label(ctx, 'A little practice, every day.', WIDTH / 2, HEIGHT - 58, 14, '#6b7785', 'center')
  if (!color) {
    ctx.save()
    ctx.resetTransform()
    ctx.filter = 'grayscale(1)'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }
  return { canvas, pageWidth: WIDTH, pageHeight: HEIGHT }
}
