import React from 'react'

export interface DecorativeBlobsProps {
  variant?: 'soft' | 'rich'
  emojis?: string[]
  className?: string
}

const DEFAULT_EMOJIS = ['🌟', '✨', '🎈', '🚀', '🎨']

export default function DecorativeBlobs({
  variant = 'soft',
  emojis = DEFAULT_EMOJIS,
  className = '',
}: DecorativeBlobsProps) {
  const intensity = variant === 'rich' ? 'opacity-70' : 'opacity-40'

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
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

      {/* Floating emojis */}
      {emojis.map((e, i) => {
        const positions = [
          { top: '8%',  left: '6%',  delay: '0s', size: 'text-4xl sm:text-5xl', anim: 'animate-float' },
          { top: '14%', right: '8%', delay: '2s', size: 'text-3xl sm:text-4xl', anim: 'animate-float-delay' },
          { bottom: '18%', left: '10%', delay: '4s', size: 'text-3xl sm:text-4xl', anim: 'animate-bounce-slow' },
          { bottom: '24%', right: '14%', delay: '1s', size: 'text-3xl sm:text-4xl', anim: 'animate-float' },
          { top: '45%', left: '50%', delay: '3s', size: 'text-2xl sm:text-3xl', anim: 'animate-bounce-slow' },
        ]
        const p = positions[i % positions.length]
        return (
          <span
            key={i}
            className={`absolute ${p.size} ${p.anim} opacity-30 dark:opacity-25`}
            style={{ ...p, animationDelay: p.delay }}
          >
            {e}
          </span>
        )
      })}
    </div>
  )
}
