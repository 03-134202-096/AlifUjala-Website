import glyphData from './urduGlyphs.json'

// Font-derived writing guide for every character in the practice alphabet.
// Both the solid model letter and the dotted writing path come from one
// validated glyph outline (Noto Naskh Arabic Bold, OFL licensed).
export type UrduLetterGlyph = {
  /** Isolated SVG path (y-down) matching the font's bold outline. */
  solidPath: string
  /** One or more pen-path polylines a child traces, in viewBox units. */
  centerlines: [number, number][][]
  /** Round marks (nuqtas / dots) with design-space position and radius. */
  nuqtas: { cx: number; cy: number; r: number }[]
  /** viewBox for the SVG / canvas rendering: [x, y, width, height]. */
  viewBox: [number, number, number, number]
  /** Original font advance width — exposed for future layout work. */
  advance: number
}

// JSON is loose by default — assert to the strongly-typed glyph shape.
const DATA = glyphData as unknown as { letters: Record<string, UrduLetterGlyph> }

export const URDU_GLYPHS: Record<string, UrduLetterGlyph> = DATA.letters

export function getUrduLetterGlyph(char: string): UrduLetterGlyph {
  const glyph = URDU_GLYPHS[char]
  if (!glyph) throw new Error(`No handwriting glyph is available for ${char}`)
  return glyph
}

// Back-compat type for the old monoline shape some callers still reference.
export type UrduStrokeGlyph = { paths: string[]; dots?: [number, number][] }

/**
 * Legacy single-path accessor. Older callers expected `{ paths, dots }`;
 * they now receive the modern glyph projected onto that shape so the whole
 * app keeps working without a sweeping rename. Prefer `getUrduLetterGlyph`.
 */
export function getUrduStrokeGlyph(char: string): UrduStrokeGlyph {
  const glyph = getUrduLetterGlyph(char)
  const paths = glyph.centerlines.map((poly) => (
    poly.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join('')
  ))
  const dots: [number, number][] = glyph.nuqtas.map((n) => [n.cx, n.cy])
  return { paths, dots }
}
