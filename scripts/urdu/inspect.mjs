// Render a comparison sheet of every practice letter at large scale.
// Three columns per row: reference (bold font fill), derived solid (filled
// solid path from JSON), derived dotted (centerlines + nuqtas from JSON).
// Writes public/images/urdu-letter-review.png

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'

const __filename = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(__filename), '..', '..')
const DATA = path.join(ROOT, 'data', 'urduGlyphs.json')
const FONT = path.join(ROOT, 'public', 'fonts', 'NotoNaskhArabic-Bold.ttf')
const OUT = process.argv[2] || path.join(ROOT, 'public', 'images', 'urdu-letter-review.png')

GlobalFonts.registerFromPath(FONT, 'NotoNaskhArabicBold')

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'))
const chars = Object.keys(data.letters)

const CELL_W = 180
const CELL_H = 180
const COL_GAP = 8
const ROW_GAP = 14
// Each letter uses 3 cells (ref / solid / dotted). Lay letters out in 2 columns
// of (3 cells wide) to keep the sheet short enough to review in one image.
const LETTER_COLS = 2
const SUBCOLS = 3
const COLS = LETTER_COLS * SUBCOLS
const LABEL_H = 22

const rowCount = Math.ceil(chars.length / LETTER_COLS)
const groupW = CELL_W * SUBCOLS + COL_GAP * (SUBCOLS - 1)
const totalW = groupW * LETTER_COLS + 40 * (LETTER_COLS - 1) + 48
const totalH = rowCount * (CELL_H + LABEL_H + ROW_GAP) + 90

const canvas = createCanvas(totalW, totalH)
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#fff'
ctx.fillRect(0, 0, totalW, totalH)

ctx.fillStyle = '#222'
ctx.font = 'bold 28px sans-serif'
ctx.textAlign = 'left'
ctx.fillText('Urdu letter review — reference / solid / dotted', 24, 44)
ctx.font = '16px sans-serif'
ctx.fillStyle = '#666'
ctx.fillText('Noto Naskh Arabic Bold, isolated forms. All three columns of a row must agree.', 24, 68)

function drawInViewBox(x, y, w, h, vb, draw) {
  ctx.save()
  const [vx, vy, vw, vh] = vb
  const sc = Math.min(w / vw, h / vh)
  ctx.translate(x + (w - vw * sc) / 2, y + (h - vh * sc) / 2)
  ctx.scale(sc, sc)
  ctx.translate(-vx, -vy)
  draw(ctx)
  ctx.restore()
}

function pathCommandsFromSvgD(d) {
  const commands = []
  let i = 0
  const n = d.length
  const nums = []
  function readNumbers(count) {
    nums.length = 0
    while (nums.length < count) {
      while (i < n && (d[i] === ' ' || d[i] === ',')) i++
      let start = i
      if (d[i] === '-' || d[i] === '+') i++
      while (i < n && /[0-9.]/.test(d[i])) i++
      if (start === i) break
      nums.push(parseFloat(d.slice(start, i)))
    }
    return nums.slice()
  }
  while (i < n) {
    const ch = d[i]
    if (' ,'.includes(ch)) { i++; continue }
    if (/[A-Za-z]/.test(ch)) {
      const cmd = ch; i++
      if (cmd === 'M') { const [x, y] = readNumbers(2); commands.push({ type: 'M', x, y }) }
      else if (cmd === 'L') { const [x, y] = readNumbers(2); commands.push({ type: 'L', x, y }) }
      else if (cmd === 'C') { const [x1,y1,x2,y2,x,y] = readNumbers(6); commands.push({ type: 'C', x1,y1,x2,y2,x,y }) }
      else if (cmd === 'Q') { const [x1,y1,x,y] = readNumbers(4); commands.push({ type: 'Q', x1,y1,x,y }) }
      else if (cmd === 'Z' || cmd === 'z') commands.push({ type: 'Z' })
      else throw new Error('unknown command ' + cmd)
    } else i++
  }
  return commands
}

function tracePath(ctx, commands) {
  ctx.beginPath()
  for (const c of commands) {
    if (c.type === 'M') ctx.moveTo(c.x, c.y)
    else if (c.type === 'L') ctx.lineTo(c.x, c.y)
    else if (c.type === 'C') ctx.bezierCurveTo(c.x1, c.y1, c.x2, c.y2, c.x, c.y)
    else if (c.type === 'Q') ctx.quadraticCurveTo(c.x1, c.y1, c.x, c.y)
    else if (c.type === 'Z') ctx.closePath()
  }
}

for (let i = 0; i < chars.length; i++) {
  const char = chars[i]
  const entry = data.letters[char]
  const row = i % rowCount
  const col = (i / rowCount) | 0
  const originX = 24 + col * (groupW + 40)
  const originY = 90 + row * (CELL_H + LABEL_H + ROW_GAP)

  const refX = originX
  const solidX = refX + CELL_W + COL_GAP
  const dotX = solidX + CELL_W + COL_GAP

  // Reference cell
  ctx.save()
  ctx.fillStyle = '#f6f8fb'
  ctx.fillRect(refX, originY, CELL_W, CELL_H)
  ctx.fillStyle = '#111'
  ctx.font = `${CELL_H - 40}px NotoNaskhArabicBold`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(char, refX + CELL_W / 2, originY + CELL_H / 2 + 6)
  ctx.restore()

  // Solid cell
  ctx.fillStyle = '#eef3ff'
  ctx.fillRect(solidX, originY, CELL_W, CELL_H)
  const commands = pathCommandsFromSvgD(entry.solidPath)
  drawInViewBox(solidX, originY, CELL_W, CELL_H, entry.viewBox, () => {
    tracePath(ctx, commands)
    ctx.fillStyle = '#111'
    ctx.fill('nonzero')
  })

  // Dotted cell
  ctx.fillStyle = '#fff9ec'
  ctx.fillRect(dotX, originY, CELL_W, CELL_H)
  drawInViewBox(dotX, originY, CELL_W, CELL_H, entry.viewBox, (ctxLocal) => {
    const vbW = entry.viewBox[2]
    const stroke = vbW * 0.028
    ctxLocal.strokeStyle = '#1d4ed8'
    ctxLocal.lineWidth = stroke
    ctxLocal.lineCap = 'round'
    ctxLocal.setLineDash([stroke * 0.01, stroke * 2.4])
    for (const poly of entry.centerlines) {
      ctxLocal.beginPath()
      poly.forEach(([px, py], idx) => {
        if (idx === 0) ctxLocal.moveTo(px, py)
        else ctxLocal.lineTo(px, py)
      })
      ctxLocal.stroke()
    }
    ctxLocal.setLineDash([])
    ctxLocal.fillStyle = '#1d4ed8'
    for (const n of entry.nuqtas) {
      ctxLocal.beginPath()
      ctxLocal.arc(n.cx, n.cy, Math.max(stroke * 0.8, n.r), 0, Math.PI * 2)
      ctxLocal.fill()
    }
  })

  // Label line under the triple
  ctx.fillStyle = '#333'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(
    `${char}  U+${entry.unicode.toString(16).toUpperCase()}  polys=${entry.centerlines.length}  nuqtas=${entry.nuqtas.length}`,
    originX, originY + CELL_H + 16
  )
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, canvas.toBuffer('image/png'))
console.log(`Wrote ${OUT}`)
