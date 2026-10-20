// Regenerate the five practice worksheet thumbnails from the current glyphs.
// Each thumbnail is a representative mini-page of one layout rendered via
// @napi-rs/canvas, then written as webp through sharp so it matches the file
// names ActivityIndex expects.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(__filename), '..', '..')
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'urduGlyphs.json'), 'utf8'))
const FONT = path.join(ROOT, 'public', 'fonts', 'NotoNaskhArabic-Bold.ttf')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'worksheetsSample', 'practice')

GlobalFonts.registerFromPath(FONT, 'NotoNaskhArabicBold')

const WIDTH = 500
const HEIGHT = 575 // 1000:1414 ratio shrunk ~2x

// --- shared drawing helpers ---------------------------------------------------
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
    const stroke = Math.max(vw, vh) * 0.028
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

function writingLines(ctx, x, y, w) {
  ctx.save()
  for (const [position, dashed, strong] of [[8, false, false], [22, true, false], [36, false, true], [50, false, false]]) {
    ctx.strokeStyle = strong ? '#9aa6b1' : '#d7dfe5'
    ctx.lineWidth = strong ? 1.1 : 0.9
    ctx.setLineDash(dashed ? [3, 3] : [])
    ctx.beginPath()
    ctx.moveTo(x, y + position)
    ctx.lineTo(x + w, y + position)
    ctx.stroke()
  }
  ctx.restore()
}

function header(ctx, title, accent = '#6d28d9') {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.strokeStyle = '#d3dae0'
  ctx.lineWidth = 1
  roundRect(ctx, 10, 10, WIDTH - 20, HEIGHT - 20, 10)
  ctx.stroke()
  ctx.fillStyle = accent
  roundRect(ctx, 32, 20, 50, 3, 1.5)
  ctx.fill()
  ctx.fillStyle = accent
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(title, WIDTH / 2, 60)
  ctx.fillStyle = '#526171'
  ctx.font = '13px NotoNaskhArabicBold'
  ctx.fillText('اردو حروف کی مشق', WIDTH / 2, 82)
}

const LETTERS = ['آ', 'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ', 'د']

// --- layouts -----------------------------------------------------------------
function tracingThumb() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  header(ctx, 'Urdu Letter Tracing')
  const cellW = (WIDTH - 60) / 4
  const cellH = 100
  LETTERS.slice(0, 12).forEach((char, i) => {
    const col = 3 - (i % 4)
    const row = (i / 4) | 0
    const x = 30 + col * cellW
    const y = 100 + row * cellH
    drawLetter(ctx, char, x + 6, y + 6, cellW - 12, cellH - 12, { dotted: true, color: '#637080' })
  })
  return canvas
}

function writingRowsThumb(withPictures = false) {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  header(ctx, withPictures ? 'Picture, Trace & Write' : 'Trace & Write')
  const rows = ['ا', 'ب', 'ت', 'ج', 'د']
  const cols = withPictures ? 7 : 6
  const cellW = (WIDTH - 60) / cols
  const rowH = 85
  rows.forEach((char, r) => {
    const y = 110 + r * rowH
    writingLines(ctx, 30, y + 4, WIDTH - 60 - (withPictures ? cellW : 0))
    for (let c = withPictures ? 1 : 0; c < cols; c++) {
      const modelCol = withPictures ? 1 : 0
      if (c > modelCol + 3) continue
      const x = WIDTH - 30 - (c + 1) * cellW + 4
      drawLetter(ctx, char, x, y + 4, cellW - 8, rowH - 20, {
        dotted: c !== modelCol,
        color: c === modelCol ? '#6d28d9' : '#637080',
      })
    }
    if (withPictures) {
      // tiny coloured square where the picture would go
      ctx.fillStyle = '#f3eaff'
      roundRect(ctx, WIDTH - 30 - cellW + 4, y + 4, cellW - 8, rowH - 14, 6)
      ctx.fill()
      ctx.fillStyle = '#6d28d9'
      ctx.font = 'bold 16px NotoNaskhArabicBold'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(char + 'ـ', WIDTH - 30 - cellW / 2, y + rowH / 2)
    }
  })
  return canvas
}

function letterFocusThumb() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  header(ctx, 'Letter Spotlight')
  ctx.fillStyle = '#f8fafb'
  roundRect(ctx, 30, 100, WIDTH - 60, 140, 10)
  ctx.fill()
  drawLetter(ctx, 'ب', 40, 110, 120, 120, { dotted: false, color: '#6d28d9' })
  ctx.fillStyle = '#f3eaff'
  roundRect(ctx, WIDTH - 160, 115, 110, 110, 8)
  ctx.fill()
  ctx.fillStyle = '#6d28d9'
  ctx.font = 'bold 22px NotoNaskhArabicBold'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ب سے بلی', WIDTH / 2, 175)
  const cellW = (WIDTH - 60) / 6
  for (let r = 0; r < 3; r++) {
    const y = 260 + r * 85
    writingLines(ctx, 30, y, WIDTH - 60)
    const guided = [6, 3, 1][r]
    for (let c = 0; c < guided; c++) {
      const x = WIDTH - 30 - (c + 1) * cellW + 6
      drawLetter(ctx, 'ب', x, y + 4, cellW - 12, 60, {
        dotted: !(r === 0 && c === 0),
        color: r === 0 && c === 0 ? '#6d28d9' : '#637080',
      })
    }
  }
  return canvas
}

function letterFindThumb() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')
  header(ctx, 'Find & Circle')
  const rows = ['ب', 'ج', 'س', 'ع']
  const cellW = (WIDTH - 60) / 7
  const rowH = 95
  rows.forEach((char, r) => {
    const y = 110 + r * rowH
    ctx.fillStyle = '#f3f5f7'
    roundRect(ctx, WIDTH - 30 - cellW + 4, y, cellW - 8, rowH - 20, 6)
    ctx.fill()
    drawLetter(ctx, char, WIDTH - 30 - cellW + 8, y + 4, cellW - 16, rowH - 28, { dotted: false, color: '#6d28d9' })
    // mock choices
    const choices = [char, 'ا', char, 'د', char, 'ر']
    choices.forEach((ch, c) => {
      const x = 30 + c * cellW + 6
      drawLetter(ctx, ch, x, y + 4, cellW - 12, rowH - 28, { dotted: false, color: '#243243' })
    })
  })
  return canvas
}

async function writeWebp(canvas, name) {
  const png = await canvas.encode('png')
  const outPath = path.join(OUT_DIR, name)
  const buf = await sharp(png).webp({ quality: 90 }).toBuffer()
  await fs.promises.writeFile(outPath, buf)
  console.log('wrote', outPath)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  await writeWebp(tracingThumb(), 'alphabet-tracing.webp')
  await writeWebp(writingRowsThumb(false), 'trace-write.webp')
  await writeWebp(writingRowsThumb(true), 'picture-practice.webp')
  await writeWebp(letterFocusThumb(), 'letter-spotlight.webp')
  await writeWebp(letterFindThumb(), 'find-circle.webp')
}

main().catch((err) => { console.error(err); process.exit(1) })
