// Render A4-size samples of the two most letter-dense worksheet layouts
// (tracing + letter-focus) using the shared Node glyph pipeline. The images
// are deliberately kept inside Node, not through puppeteer, so running them
// doesn't require a dev server.
//
// Output: public/images/worksheetsSample/practice/sample-tracing.png,
//         public/images/worksheetsSample/practice/sample-letter-focus.png

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'

const __filename = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(__filename), '..', '..')
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'urduGlyphs.json'), 'utf8'))
const FONT = path.join(ROOT, 'public', 'fonts', 'NotoNaskhArabic-Bold.ttf')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'worksheetsSample', 'practice')

GlobalFonts.registerFromPath(FONT, 'NotoNaskhArabicBold')

const WIDTH = 1000
const HEIGHT = 1414
const MARGIN = 70
const ACCENT = '#243243'

// Same drawUrduGuide / tracePath used by lib/urduTracing.ts, repeated here
// because that lives in TypeScript / browser land. Keeping the Node copy
// deliberately short.
function drawLetter(ctx, char, x, y, w, h, { dotted = true, color = '#637080' } = {}) {
  const glyph = DATA.letters[char]
  if (!glyph) return
  const [vx, vy, vw, vh] = glyph.viewBox
  const scale = Math.min(w / vw, h / vh)
  const offsetX = x + (w - vw * scale) / 2 - vx * scale
  const offsetY = y + (h - vh * scale) / 2 - vy * scale
  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  if (dotted) {
    const stroke = Math.max(vw, vh) * 0.03
    ctx.lineWidth = stroke
    ctx.setLineDash([0.01, stroke * 2.4])
    for (const poly of glyph.centerlines) {
      ctx.beginPath()
      poly.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)))
      ctx.stroke()
    }
    ctx.setLineDash([])
    for (const n of glyph.nuqtas) {
      ctx.beginPath()
      ctx.arc(n.cx, n.cy, Math.max(n.r, stroke * 1.6), 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    tracePath(ctx, glyph.solidPath)
    ctx.fill('nonzero')
  }
  ctx.restore()
}

function tracePath(ctx, d) {
  let i = 0
  const n = d.length
  const nums = []
  const readNumbers = (count) => {
    nums.length = 0
    while (nums.length < count) {
      while (i < n && (d[i] === ' ' || d[i] === ',')) i++
      const start = i
      if (d[i] === '-' || d[i] === '+') i++
      while (i < n && /[0-9.]/.test(d[i])) i++
      if (start === i) break
      nums.push(parseFloat(d.slice(start, i)))
    }
    return nums.slice()
  }
  ctx.beginPath()
  while (i < n) {
    const ch = d[i]
    if (ch === ' ' || ch === ',') { i++; continue }
    if (/[A-Za-z]/.test(ch)) {
      const cmd = ch; i++
      if (cmd === 'M') { const [x, y] = readNumbers(2); ctx.moveTo(x, y) }
      else if (cmd === 'L') { const [x, y] = readNumbers(2); ctx.lineTo(x, y) }
      else if (cmd === 'C') { const [x1, y1, x2, y2, x, y] = readNumbers(6); ctx.bezierCurveTo(x1, y1, x2, y2, x, y) }
      else if (cmd === 'Q') { const [x1, y1, x, y] = readNumbers(4); ctx.quadraticCurveTo(x1, y1, x, y) }
      else if (cmd === 'Z' || cmd === 'z') ctx.closePath()
    } else i++
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function writingLines(ctx, x, y, w, scale = 1) {
  ctx.save()
  for (const [position, dashed, strong] of [[20, false, false], [50, true, false], [80, false, true], [112, false, false]]) {
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

function pageHeader(ctx, englishTitle, urduTitle, instructions) {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.strokeStyle = '#d3dae0'
  ctx.lineWidth = 1.4
  roundRect(ctx, 33, 30, WIDTH - 66, HEIGHT - 60, 20)
  ctx.stroke()
  ctx.fillStyle = ACCENT
  roundRect(ctx, 70, 38, 88, 5, 2)
  ctx.fill()
  ctx.font = '20px sans-serif'
  ctx.fillStyle = ACCENT
  ctx.textAlign = 'left'
  ctx.fillText('Name:', 70, 86)
  ctx.fillText('Date:', 638, 86)
  ctx.strokeStyle = '#9aa6b1'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(140, 90); ctx.lineTo(560, 90)
  ctx.moveTo(698, 90); ctx.lineTo(930, 90)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.fillStyle = ACCENT
  ctx.font = 'bold 35px sans-serif'
  ctx.fillText(englishTitle, WIDTH / 2, 153)
  ctx.font = '29px NotoNaskhArabicBold'
  ctx.fillText(urduTitle, WIDTH / 2, 202)
  ctx.fillStyle = '#526171'
  ctx.font = '19px sans-serif'
  ctx.fillText(instructions, WIDTH / 2, 254)
  ctx.strokeStyle = '#e2e7ec'
  ctx.beginPath()
  ctx.moveTo(MARGIN, 276); ctx.lineTo(WIDTH - MARGIN, 276); ctx.stroke()
}

function pageFooter(ctx) {
  ctx.textAlign = 'left'
  ctx.fillStyle = '#526171'
  ctx.font = '15px sans-serif'
  ctx.fillText('AIEarlyEdge · Urdu Learning', MARGIN, HEIGHT - 58)
  ctx.textAlign = 'right'
  ctx.fillText('Page 1 of 1', WIDTH - MARGIN, HEIGHT - 58)
  ctx.textAlign = 'center'
  ctx.font = '14px sans-serif'
  ctx.fillText('A little practice, every day.', WIDTH / 2, HEIGHT - 58)
}

const TRACING_LETTERS = ['آ', 'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش']

function renderTracing() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  pageHeader(ctx,
    'Urdu Letter Tracing',
    'اردو حروف کی مشق',
    'Trace each letter along its dotted line. Remember its dots.')
  const GRID_WIDTH = WIDTH - MARGIN * 2
  const columns = 5
  const rows = Math.ceil(TRACING_LETTERS.length / columns)
  const cellWidth = GRID_WIDTH / columns
  const cellHeight = Math.min(185, 980 / rows)
  TRACING_LETTERS.forEach((char, index) => {
    const col = columns - 1 - (index % columns)
    const row = (index / columns) | 0
    drawLetter(ctx, char, MARGIN + col * cellWidth + 18, 302 + row * cellHeight, cellWidth - 36, cellHeight - 13)
  })
  pageFooter(ctx)
  return canvas
}

function renderLetterFocus() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  const item = { char: 'ب', name: 'Bay', word: 'بلی' }
  pageHeader(ctx,
    'Letter Spotlight',
    'حرف کی مشق',
    'Look, say, trace, and write. Start at the right of each row.')
  const GRID_WIDTH = WIDTH - MARGIN * 2
  ctx.fillStyle = '#f8fafb'
  roundRect(ctx, MARGIN, 304, GRID_WIDTH, 245, 18)
  ctx.fill()
  drawLetter(ctx, item.char, 132, 318, 180, 216, { dotted: false, color: ACCENT })
  ctx.fillStyle = '#f3eaff'
  roundRect(ctx, 720, 320, 160, 160, 10)
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#182230'
  ctx.font = '32px NotoNaskhArabicBold'
  ctx.fillText(`${item.char} سے ${item.word}`, 505, 401)
  ctx.fillStyle = '#64748b'
  ctx.font = '18px sans-serif'
  ctx.fillText(item.name, 505, 470)
  const cellWidth = GRID_WIDTH / 6
  for (let row = 0; row < 5; row++) {
    const y = 586 + row * 137
    writingLines(ctx, MARGIN, y, GRID_WIDTH, 0.92)
    const guided = [6, 3, 1, 0, 0][row]
    for (let col = 0; col < guided; col++) {
      drawLetter(ctx, item.char,
        WIDTH - MARGIN - (col + 1) * cellWidth + 22, y, cellWidth - 44, 110.4,
        { dotted: !(row === 0 && col === 0), color: row === 0 && col === 0 ? ACCENT : '#637080' })
    }
  }
  pageFooter(ctx)
  return canvas
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const tracing = renderTracing()
  const focus = renderLetterFocus()
  fs.writeFileSync(path.join(OUT_DIR, 'sample-tracing.png'), tracing.toBuffer('image/png'))
  fs.writeFileSync(path.join(OUT_DIR, 'sample-letter-focus.png'), focus.toBuffer('image/png'))
  console.log('Wrote sample-tracing.png and sample-letter-focus.png')
}

main().catch((err) => { console.error(err); process.exit(1) })
