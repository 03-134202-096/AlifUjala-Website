import { getUrduLetterGlyph } from '@/data/urduHandwriting'

type DrawOptions = {
  dotted?: boolean
  color?: string
}

/**
 * Draw one Urdu letter on an HTML5 canvas inside the given cell.
 *
 * Both the solid model and the dotted writing path are derived from the SAME
 * glyph outline (Noto Naskh Arabic Bold). The dotted form is a true
 * centerline — a single pen path per stroke — plus solid dots for nuqtas.
 */
export function drawUrduGuide(
  ctx: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  width: number,
  height: number,
  { dotted = true, color = '#637080' }: DrawOptions = {},
) {
  const glyph = getUrduLetterGlyph(char)
  const [vx, vy, vw, vh] = glyph.viewBox
  const scale = Math.min(width / vw, height / vh)
  const offsetX = x + (width - vw * scale) / 2 - vx * scale
  const offsetY = y + (height - vh * scale) / 2 - vy * scale

  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (dotted) {
    const strokeWidth = Math.max(vw, vh) * 0.03
    const dashGap = strokeWidth * 2.4
    ctx.lineWidth = strokeWidth
    // Short dash + long gap => a chain of round dots following the pen path.
    ctx.setLineDash([0.01, dashGap])
    for (const poly of glyph.centerlines) {
      ctx.beginPath()
      poly.forEach(([px, py], index) => {
        if (index === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.stroke()
    }
    ctx.setLineDash([])
    for (const n of glyph.nuqtas) {
      ctx.beginPath()
      ctx.arc(n.cx, n.cy, Math.max(n.r, strokeWidth * 1.6), 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    ctx.beginPath()
    tracePath(ctx, glyph.solidPath)
    ctx.fill('nonzero')
  }

  ctx.restore()
}

/** Minimal SVG path parser — handles the M L C Q Z commands our data uses. */
function tracePath(ctx: CanvasRenderingContext2D, d: string) {
  let i = 0
  const n = d.length
  const nums: number[] = []
  const readNumbers = (count: number): number[] => {
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
      else throw new Error(`Unknown path command: ${cmd}`)
    } else {
      i++
    }
  }
}
