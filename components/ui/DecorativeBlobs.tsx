import React from 'react'
import LearningIcon, { type LearningIconName } from './LearningIcon'

export interface DecorativeBlobsProps {
  variant?: 'soft' | 'rich'
  motifs?: LearningIconName[]
  className?: string
}

const DEFAULT_MOTIFS: LearningIconName[] = ['book', 'pencil', 'letters']

export default function DecorativeBlobs({
  variant = 'soft',
  motifs = DEFAULT_MOTIFS,
  className = '',
}: DecorativeBlobsProps) {
  const intensity = variant === 'rich' ? 'opacity-70' : 'opacity-40'

  return (
    <div
      className={`learning-decorations absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Aurora blobs */}
      <span
        className={`deco-blob bg-pink-300/60 dark:bg-fuchsia-500/30 ${intensity}`}
        style={{ width: 320, height: 320, top: '-80px', left: '-60px' }}
      />
      <span
        className={`deco-blob bg-violet-300/60 dark:bg-violet-600/30 ${intensity}`}
        style={{ width: 360, height: 360, top: '20%', right: '-100px', animationDelay: '3s' }}
      />
      <span
        className={`deco-blob bg-cyan-300/60 dark:bg-cyan-500/25 ${intensity}`}
        style={{ width: 280, height: 280, bottom: '-60px', left: '30%', animationDelay: '6s' }}
      />

      {/* A few quiet learning motifs stay at the edges of wide screens. */}
      {motifs.slice(0, variant === 'rich' ? 3 : 2).map((name, i) => (
        <span key={`${name}-${i}`} className={`learning-margin-motif learning-margin-motif-${i + 1}`}>
          <LearningIcon name={name} />
        </span>
      ))}
    </div>
  )
}
