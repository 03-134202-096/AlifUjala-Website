// Build-time pipeline that turns a bundled, OFL-licensed Urdu font into
// matched solid + dotted letterforms used across the site.
//
// Output: data/urduGlyphs.json
//   Per letter:
//     solidPath   SVG d string of the complete, isolated glyph outline (bold).
//     centerlines Array of [x, y] polylines sampled from the thinned body skeleton.
//     nuqtas      Array of { cx, cy, r } for small marks (dots, retroflex marks).
//     viewBox     [minX, minY, width, height] of the glyph in design space (SVG y-down).
//     advance     glyph advance width in font units.
//
// Pipeline per letter:
//   1. Walk the font glyph's path commands, splitting into independent contours.
//      Classify each contour as:
//        body outer    the single largest contour, enclosing most ink
//        body hole     a smaller contour whose centroid is inside the body outer bbox
//                      (e.g. the eye of ه, hole of ف/ق)
//        mark          a small contour outside the body bbox (nuqta / retroflex)
//   2. Rasterize body outer + body holes together (nonzero fill) → body bitmap.
//      Rasterize each mark separately for its centroid + radius.
//   3. Zhang-Suen thin the body bitmap to a one-pixel-wide skeleton.
//   4. Prune short spurs so skeleton branches that are just antialias noise
//      don't become visible dotted strokes.
//   5. Trace skeleton into polylines by walking from endpoints then
//      following remaining closed loops.
//   6. Merge polyline endpoints that end at the same point so a single stroke
//      the renderer walks is one polyline.
//   7. Simplify with Douglas-Peucker.
//   8. Map pixel coordinates back to design units (flipped to SVG y-down).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'
import { createCanvas } from '@napi-rs/canvas'

const __filename = fileURLToPath(import.meta.url)
const ROOT = path.resolve(path.dirname(__filename), '..', '..')
const FONT_PATH = path.join(ROOT, 'public', 'fonts', 'NotoNaskhArabic-Bold.ttf')
const OUTPUT_JSON = path.join(ROOT, 'data', 'urduGlyphs.json')

export const PRACTICE_CHARS = [
  'آ', 'ا',
  'ب', 'پ', 'ت', 'ٹ', 'ث',
  'ج', 'چ', 'ح', 'خ',
  'د', 'ڈ', 'ذ',
  'ر', 'ڑ', 'ز', 'ژ',
  'س', 'ش',
  'ص', 'ض',
  'ط', 'ظ',
  'ع', 'غ',
  'ف', 'ق',
  'ک', 'گ',
  'ل', 'م', 'ن', 'ں',
  'و',
  'ہ', 'ھ',
  'ء',
  'ی', 'ے',
]

const RASTER_SIZE = 600
const RASTER_PAD = 30
const DOUGLAS_PEUCKER_EPS = 2.0
const MIN_POLY_LEN = 10
const JOIN_RADIUS = 4 // pixels; merge polyline endpoints closer than this

// -- font loading -----------------------------------------------------------
function loadFont() {
  const buf = fs.readFileSync(FONT_PATH)
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
}

function getIsolatedGlyph(font, char) {
  const g = font.charToGlyph(char)
  if (!g || g.index === 0) throw new Error(`Missing glyph for ${char}`)
  return g
}

// -- contour extraction -----------------------------------------------------
// Split flat path commands into independent contours (each starts at M, ends at Z).
function splitContours(commands) {
  const contours = []
  let current = null
  for (const c of commands) {
    if (c.type === 'M') {
      if (current) contours.push(current)
      current = [c]
    } else if (current) {
      current.push(c)
    }
  }
  if (current) contours.push(current)
  return contours
}

// Flatten a contour (Bezier curves → short line segments) to compute bbox + area.
function flattenContour(contour, segmentsPerCurve = 24) {
  const pts = []
  let x = 0, y = 0
  for (const c of contour) {
    if (c.type === 'M') { x = c.x; y = c.y; pts.push([x, y]) }
    else if (c.type === 'L') { x = c.x; y = c.y; pts.push([x, y]) }
    else if (c.type === 'Q') {
      const x0 = x, y0 = y
      for (let i = 1; i <= segmentsPerCurve; i++) {
        const t = i / segmentsPerCurve
        const nt = 1 - t
        pts.push([nt * nt * x0 + 2 * nt * t * c.x1 + t * t * c.x, nt * nt * y0 + 2 * nt * t * c.y1 + t * t * c.y])
      }
      x = c.x; y = c.y
    } else if (c.type === 'C') {
      const x0 = x, y0 = y
      for (let i = 1; i <= segmentsPerCurve; i++) {
        const t = i / segmentsPerCurve
        const nt = 1 - t
        pts.push([
          nt*nt*nt*x0 + 3*nt*nt*t*c.x1 + 3*nt*t*t*c.x2 + t*t*t*c.x,
          nt*nt*nt*y0 + 3*nt*nt*t*c.y1 + 3*nt*t*t*c.y2 + t*t*t*c.y,
        ])
      }
      x = c.x; y = c.y
    }
    // Z just closes; polygon is already defined by points
  }
  return pts
}

function bboxOf(points) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const [x, y] of points) {
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (y < minY) minY = y; if (y > maxY) maxY = y
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY, cx: (minX+maxX)/2, cy: (minY+maxY)/2 }
}

// Signed area via shoelace (sign tells winding; magnitude is enclosed area).
function signedArea(points) {
  let a = 0
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i]
    const [x2, y2] = points[(i + 1) % points.length]
    a += x1 * y2 - x2 * y1
  }
  return a / 2
}

function pointInBBox(px, py, bb, pad = 0) {
  return px >= bb.minX - pad && px <= bb.maxX + pad && py >= bb.minY - pad && py <= bb.maxY + pad
}

function classifyContours(contours) {
  const info = contours.map((c) => {
    const pts = flattenContour(c)
    const signed = signedArea(pts)
    const bb = bboxOf(pts)
    const longSide = Math.max(bb.w, bb.h)
    const shortSide = Math.max(1, Math.min(bb.w, bb.h))
    return {
      commands: c, points: pts, bbox: bb,
      area: Math.abs(signed), signed,
      aspect: longSide / shortSide,
    }
  })
  info.sort((a, b) => b.area - a.area)
  const body = info[0]
  // Classify every secondary contour against the body:
  //   opposite winding → inner hole of the body (e.g. eye of ق/ف, do-chashmi
  //     hay's two chambers). Drawn with the body for its visual shape.
  //   same winding, round (aspect < 2) → a nuqta or similar dot mark.
  //     Rendered separately as a filled dot in the dotted view.
  //   same winding, elongated → a secondary ink stroke that belongs to the
  //     letter's silhouette (madd on آ, toy on گ). Must be rasterised +
  //     skeletonised with the body so children trace along it.
  const bodyHoles = []
  const marks = []
  const bodySign = Math.sign(body.signed) || 1
  for (let i = 1; i < info.length; i++) {
    const c = info[i]
    const sameWinding = Math.sign(c.signed) === bodySign
    if (!sameWinding) {
      bodyHoles.push(c)
    } else if (c.aspect < 1.5 && c.area < body.area * 0.15) {
      // Compact AND small — a true nuqta.
      marks.push(c)
    } else {
      // Elongated (madd on آ, toy on گ) OR substantial even if round
      // (the retroflex ط-mark on ٹ/ڈ/ڑ, which is a mini-letter, not a dot).
      // These go into the body raster so they're skeletonised as a stroke.
      body._extra = body._extra || []
      body._extra.push(c)
    }
  }
  return { body, bodyHoles, marks }
}

// -- rasterization ----------------------------------------------------------
// Note: caller must beginPath() before and fill() after. We DON'T beginPath
// inside so multiple contours accumulate into one path for correct nonzero
// hole handling.
function addPathCommands(ctx, commands) {
  for (const c of commands) {
    if (c.type === 'M') ctx.moveTo(c.x, c.y)
    else if (c.type === 'L') ctx.lineTo(c.x, c.y)
    else if (c.type === 'C') ctx.bezierCurveTo(c.x1, c.y1, c.x2, c.y2, c.x, c.y)
    else if (c.type === 'Q') ctx.quadraticCurveTo(c.x1, c.y1, c.x, c.y)
    else if (c.type === 'Z') ctx.closePath()
  }
}

// Build a transform that maps the font-design-space glyph (as returned by
// getPath, which already flips Y so the path renders upright in screen space)
// into our raster canvas. We do NOT flip Y again — just translate + uniform
// scale. designFromPx returns coordinates in that same y-down design space.
function makeRasterTransform(fontBbox, size, pad) {
  const sMinX = fontBbox.x1
  const sMinY = -fontBbox.y2
  const sMaxX = fontBbox.x2
  const sMaxY = -fontBbox.y1
  const gw = sMaxX - sMinX
  const gh = sMaxY - sMinY
  const scale = (size - pad * 2) / Math.max(gw, gh)
  const scx = (sMinX + sMaxX) / 2
  const scy = (sMinY + sMaxY) / 2
  const tx = size / 2 - scx * scale
  const ty = size / 2 - scy * scale
  return {
    scale, tx, ty,
    apply(ctx) {
      ctx.save()
      ctx.translate(tx, ty)
      ctx.scale(scale, scale)
    },
    restore(ctx) { ctx.restore() },
    designFromPx(px, py) {
      return [(px - tx) / scale, (py - ty) / scale]
    },
  }
}

function rasterContours(contours, size, transform) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)
  transform.apply(ctx)
  ctx.fillStyle = '#000'
  ctx.beginPath()
  for (const c of contours) addPathCommands(ctx, c.commands)
  // nonzero fill handles outer + holes correctly because font winding is opposite
  ctx.fill('nonzero')
  transform.restore(ctx)
  const img = ctx.getImageData(0, 0, size, size)
  const bits = new Uint8Array(size * size)
  for (let i = 0; i < size * size; i++) bits[i] = img.data[i * 4] < 128 ? 1 : 0
  return { bits, canvas }
}

// -- thinning ---------------------------------------------------------------
function thinSkeleton(bits, size) {
  const a = Uint8Array.from(bits)
  const w = size, h = size
  function neighbours(i) {
    const x = i % w, y = (i / w) | 0
    return [
      y > 0 ? a[i - w] : 0,
      y > 0 && x < w - 1 ? a[i - w + 1] : 0,
      x < w - 1 ? a[i + 1] : 0,
      y < h - 1 && x < w - 1 ? a[i + w + 1] : 0,
      y < h - 1 ? a[i + w] : 0,
      y < h - 1 && x > 0 ? a[i + w - 1] : 0,
      x > 0 ? a[i - 1] : 0,
      y > 0 && x > 0 ? a[i - w - 1] : 0,
    ]
  }
  let changed = true
  while (changed) {
    changed = false
    for (const step of [0, 1]) {
      const toClear = []
      for (let i = 0; i < a.length; i++) {
        if (!a[i]) continue
        const n = neighbours(i)
        const B = n.reduce((s, v) => s + v, 0)
        if (B < 2 || B > 6) continue
        let A = 0
        for (let k = 0; k < 8; k++) if (n[k] === 0 && n[(k + 1) % 8] === 1) A++
        if (A !== 1) continue
        const [P2,,P4,,P6,,P8,] = n
        if (step === 0) {
          if (P2 * P4 * P6 !== 0) continue
          if (P4 * P6 * P8 !== 0) continue
        } else {
          if (P2 * P4 * P8 !== 0) continue
          if (P2 * P6 * P8 !== 0) continue
        }
        toClear.push(i)
      }
      if (toClear.length) { changed = true; for (const i of toClear) a[i] = 0 }
    }
  }
  return a
}

function neighbourCount(sk, size, i) {
  const x = i % size, y = (i / size) | 0
  let c = 0
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx, ny = y + dy
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue
      if (sk[ny * size + nx]) c++
    }
  }
  return c
}

function pruneSpurs(sk, size, maxLen) {
  const s = Uint8Array.from(sk)
  let changed = true
  while (changed) {
    changed = false
    const endpoints = []
    for (let i = 0; i < s.length; i++) {
      if (s[i] && neighbourCount(s, size, i) === 1) endpoints.push(i)
    }
    for (const start of endpoints) {
      if (!s[start]) continue
      const chain = [start]
      let cur = start, prev = -1
      for (let step = 0; step < maxLen; step++) {
        const x = cur % size, y = (cur / size) | 0
        let next = -1
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
          const nx = x + dx, ny = y + dy
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue
          const ni = ny * size + nx
          if (!s[ni] || ni === prev) continue
          next = ni; break
        }
        if (next === -1) break
        if (neighbourCount(s, size, next) >= 3) break
        prev = cur; cur = next; chain.push(cur)
      }
      if (chain.length <= maxLen) {
        for (const i of chain) s[i] = 0
        changed = true
      }
    }
  }
  return s
}

function tracePolylines(sk, size) {
  const s = Uint8Array.from(sk)
  const polys = []
  function walk(start) {
    const poly = [start]
    s[start] = 0
    let cur = start
    while (true) {
      const x = cur % size, y = (cur / size) | 0
      let next = -1
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) {
        const nx = x + dx, ny = y + dy
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue
        const ni = ny * size + nx
        if (s[ni]) { next = ni; break }
      }
      if (next === -1) break
      s[next] = 0; poly.push(next); cur = next
    }
    return poly
  }
  const endpoints = []
  for (let i = 0; i < sk.length; i++) {
    if (sk[i] && neighbourCount(sk, size, i) === 1) endpoints.push(i)
  }
  for (const ep of endpoints) if (s[ep]) polys.push(walk(ep))
  for (let i = 0; i < s.length; i++) if (s[i]) polys.push(walk(i))
  return polys
    .map((p) => p.map((idx) => [idx % size, (idx / size) | 0]))
    .filter((p) => p.length >= MIN_POLY_LEN)
}

// Greedy join of polyline endpoints within JOIN_RADIUS so a single logical
// stroke that got split at a junction becomes one polyline.
function joinPolylines(polys, radius) {
  const chains = polys.map((p) => [...p])
  let joined = true
  while (joined) {
    joined = false
    outer: for (let i = 0; i < chains.length; i++) {
      for (let j = 0; j < chains.length; j++) {
        if (i === j) continue
        const a = chains[i], b = chains[j]
        if (!a.length || !b.length) continue
        const tryPairs = [
          { endA: a[a.length - 1], endB: b[0], flipA: false, flipB: false },
          { endA: a[a.length - 1], endB: b[b.length - 1], flipA: false, flipB: true },
          { endA: a[0], endB: b[0], flipA: true, flipB: false },
          { endA: a[0], endB: b[b.length - 1], flipA: true, flipB: true },
        ]
        for (const pair of tryPairs) {
          const d = Math.hypot(pair.endA[0] - pair.endB[0], pair.endA[1] - pair.endB[1])
          if (d <= radius) {
            const aa = pair.flipA ? [...a].reverse() : a
            const bb = pair.flipB ? [...b].reverse() : b
            chains[i] = aa.concat(bb)
            chains[j] = []
            joined = true
            break outer
          }
        }
      }
    }
  }
  return chains.filter((c) => c.length)
}

function simplify(points, eps) {
  if (points.length <= 2) return points
  let maxDist = 0, index = 0
  for (let i = 1; i < points.length - 1; i++) {
    const d = pointSegmentDistance(points[i], points[0], points[points.length - 1])
    if (d > maxDist) { maxDist = d; index = i }
  }
  if (maxDist > eps) {
    const left = simplify(points.slice(0, index + 1), eps)
    const right = simplify(points.slice(index), eps)
    return [...left.slice(0, -1), ...right]
  }
  return [points[0], points[points.length - 1]]
}
function pointSegmentDistance(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const len2 = dx * dx + dy * dy
  if (len2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1])
  let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

function round(n, p = 2) {
  const m = Math.pow(10, p)
  return Math.round(n * m) / m
}

function pathCommandsToSvgD(commands) {
  const out = []
  for (const c of commands) {
    if (c.type === 'M') out.push(`M${round(c.x,2)} ${round(c.y,2)}`)
    else if (c.type === 'L') out.push(`L${round(c.x,2)} ${round(c.y,2)}`)
    else if (c.type === 'C') out.push(`C${round(c.x1,2)} ${round(c.y1,2)} ${round(c.x2,2)} ${round(c.y2,2)} ${round(c.x,2)} ${round(c.y,2)}`)
    else if (c.type === 'Q') out.push(`Q${round(c.x1,2)} ${round(c.y1,2)} ${round(c.x,2)} ${round(c.y,2)}`)
    else if (c.type === 'Z') out.push('Z')
  }
  return out.join('')
}

// -- main per-letter --------------------------------------------------------
function buildGlyphData(font, char) {
  const glyph = getIsolatedGlyph(font, char)
  const bbox = glyph.getBoundingBox()
  const designPath = glyph.getPath(0, 0, font.unitsPerEm)

  // ViewBox around the ink with a small pad, in SVG y-down coordinates.
  // Use a pad proportional to the glyph so slim letters (alif) and wide ones
  // (seen) read with similar breathing room.
  const inkW = bbox.x2 - bbox.x1
  const inkH = bbox.y2 - bbox.y1
  const pad = Math.round(Math.max(inkW, inkH) * 0.08)
  const vbX = Math.floor(bbox.x1 - pad)
  const vbY = Math.floor(-bbox.y2 - pad)
  const vbW = Math.ceil(inkW + pad * 2)
  const vbH = Math.ceil(inkH + pad * 2)

  // getPath already returns commands in y-down screen space, which matches
  // our viewBox convention. No extra flip.
  const solidPath = pathCommandsToSvgD(designPath.commands)

  // Classify contours (in native font coords, y-up).
  const contours = splitContours(designPath.commands)
  const { body, bodyHoles, marks } = classifyContours(contours)

  // Rasterize body (outer + any secondary positive pieces + holes) for skeleton.
  const transform = makeRasterTransform(bbox, RASTER_SIZE, RASTER_PAD)
  const bodyGroup = [body, ...(body._extra || []), ...bodyHoles]
  const bodyRaster = rasterContours(bodyGroup, RASTER_SIZE, transform)
  const sk = thinSkeleton(bodyRaster.bits, RASTER_SIZE)
  const pruned = pruneSpurs(sk, RASTER_SIZE, 8)
  const polys = tracePolylines(pruned, RASTER_SIZE)
  const joined = joinPolylines(polys, JOIN_RADIUS)
  const centerlines = joined
    .map((poly) => simplify(poly, DOUGLAS_PEUCKER_EPS))
    .map((poly) => poly.map(([px, py]) => {
      const [dx, dy] = transform.designFromPx(px, py)
      return [round(dx), round(dy)]
    }))
    .filter((poly) => poly.length >= 2)

  // Nuqtas / marks: centroid + area-equivalent radius, already in y-down space
  // because contours came from getPath (which pre-flips Y).
  const nuqtas = marks.map((c) => {
    const r = Math.sqrt(c.area / Math.PI)
    return { cx: round(c.bbox.cx, 2), cy: round(c.bbox.cy, 2), r: round(r, 2) }
  })

  return {
    char,
    unicode: char.codePointAt(0),
    viewBox: [vbX, vbY, vbW, vbH],
    solidPath,
    centerlines,
    nuqtas,
    advance: glyph.advanceWidth,
  }
}

async function main() {
  const font = loadFont()
  const result = {
    font: 'Noto Naskh Arabic Bold',
    source: 'public/fonts/NotoNaskhArabic-Bold.ttf',
    license: 'SIL Open Font License 1.1 — see public/fonts/LICENSE-NotoFonts-OFL.txt',
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    rasterSize: RASTER_SIZE,
    letters: {},
  }
  for (const char of PRACTICE_CHARS) {
    process.stdout.write(`${char} `)
    try {
      const data = buildGlyphData(font, char)
      result.letters[char] = data
      process.stdout.write(`polys=${data.centerlines.length} nuqtas=${data.nuqtas.length}\n`)
    } catch (err) {
      process.stdout.write(`FAIL: ${err.message}\n`)
    }
  }
  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true })
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(result, null, 2))
  console.log(`Wrote ${OUTPUT_JSON}`)
}

if (process.argv[1] && process.argv[1].endsWith('pipeline.mjs')) {
  main().catch((err) => { console.error(err); process.exit(1) })
}
