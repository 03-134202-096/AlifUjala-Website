import { getUrduLetterGlyph } from '@/data/urduHandwriting'

type Props = {
  char: string
  dotted?: boolean
  className?: string
  /** Stroke colour (hex / css var). Defaults to currentColor. */
  color?: string
}

/**
 * Render one Urdu letter in either solid or dotted form.
 *
 * Both forms come from the same validated glyph outline (Noto Naskh Arabic
 * Bold). The solid form is the font's filled outline. The dotted form is the
 * glyph's centerline polylines (what children trace) plus true dot marks for
 * nuqtas / retroflex marks — never a thick-glyph outline.
 */
export default function UrduTraceGlyph({ char, dotted = true, className = '', color }: Props) {
  const glyph = getUrduLetterGlyph(char)
  const [vx, vy, vw, vh] = glyph.viewBox
  const vmax = Math.max(vw, vh)
  // Keep dots clearly visible as the glyph scales.
  const strokeWidth = Math.max(vmax * 0.03, 10)
  const dashGap = strokeWidth * 2.4
  const stroke = color ?? 'currentColor'

  if (!dotted) {
    return (
      <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className={`block w-full h-full ${className}`} aria-hidden="true">
        <path d={glyph.solidPath} fill={stroke} fillRule="nonzero" />
      </svg>
    )
  }

  return (
    <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className={`block w-full h-full ${className}`} fill="none" aria-hidden="true">
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`0.01 ${dashGap}`}>
        {glyph.centerlines.map((poly, index) => (
          <polyline key={index} points={poly.map(([x, y]) => `${x},${y}`).join(' ')} />
        ))}
      </g>
      <g fill={stroke}>
        {glyph.nuqtas.map((n, index) => (
          <circle key={index} cx={n.cx} cy={n.cy} r={Math.max(n.r, strokeWidth * 1.6)} />
        ))}
      </g>
    </svg>
  )
}
