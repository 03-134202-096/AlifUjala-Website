import React from 'react'

export type LearningIconName =
  | 'worksheet' | 'pencil' | 'book' | 'play' | 'gamepad' | 'letters'
  | 'sparkles' | 'star' | 'bulb' | 'heart' | 'mobile' | 'chart' | 'audio'
  | 'palette' | 'school' | 'users' | 'shield' | 'lock' | 'mail' | 'search'
  | 'question' | 'trophy' | 'home' | 'check' | 'arrow-right' | 'download'
  | 'shuffle' | 'clock' | 'puzzle' | 'target' | 'cards' | 'basket'
  | 'balloon' | 'train' | 'sort' | 'tiles' | 'hammer' | 'camera'

const lavender = '#ddd6fe'
const mint = '#a7f3d0'
const gold = '#fcd34d'
const sky = '#bae6fd'

// One rounded, two-tone illustration style for navigation and learning tools.
const DRAWINGS: Record<LearningIconName, React.ReactNode> = {
  worksheet: <><rect x="10" y="5" width="27" height="37" rx="5" fill="white"/><path d="M17 14h13M17 21h6M17 29h5"/><path d="m26 34 2-8 10-10a3 3 0 0 1 5 5L33 31Z" fill={gold}/><path d="m35 19 5 5M26 34l7-3"/></>,
  pencil: <><path d="m9 39 3-12L32 7a5 5 0 0 1 7 7L19 34Z" fill={gold}/><path d="m29 10 7 7M12 27l7 7M9 39l7-2"/><path d="M25 38h15" stroke={mint}/></>,
  book: <><path d="M24 12C18 7 10 7 5 9v28c6-2 13-1 19 4 6-5 13-6 19-4V9c-6-2-13-2-19 3Z" fill="white"/><path d="M24 12v29"/><path d="M11 16c3 0 5 1 8 2m-8 5c3 0 5 1 8 2m10-7c3-1 5-2 8-2m-8 9c3-1 5-2 8-2" stroke={lavender}/></>,
  play: <><rect x="5" y="9" width="38" height="30" rx="9" fill={sky}/><path d="m20 17 12 7-12 7Z" fill="white"/></>,
  gamepad: <><path d="M15 13h18c5 0 7 4 8 9l3 13c1 6-6 8-9 4l-5-6H18l-5 6c-3 4-10 2-9-4l3-13c1-5 3-9 8-9Z" fill={lavender}/><path d="M14 20v10m-5-5h10"/><circle cx="32" cy="22" r="2" fill={gold} stroke="none"/><circle cx="37" cy="28" r="2" fill={mint} stroke="none"/></>,
  letters: <><rect x="5" y="7" width="38" height="34" rx="8" fill={lavender}/><path d="M32 14v18M11 26c1 9 15 9 17 0"/><circle cx="20" cy="36" r="1.5" fill="currentColor" stroke="none"/></>,
  sparkles: <><path d="m24 6 5 12 13 6-13 5-5 13-5-13-13-5 13-6Z" fill={gold}/><path d="m39 4 1 4 4 1-4 2-1 4-2-4-4-2 4-1ZM7 32l2 5 5 2-5 2-2 5-2-5-4-2 4-2" fill={lavender} stroke="none"/></>,
  star: <path d="m24 5 6 12 13 2-9 10 2 14-12-7-12 7 2-14-9-10 13-2Z" fill={gold}/>,
  bulb: <><path d="M16 31c0-5-6-6-6-14a14 14 0 0 1 28 0c0 8-6 9-6 14Z" fill={gold}/><path d="M17 36h14m-12 6h10M24 30v-9m-5-3 5 4 5-4"/></>,
  heart: <path d="M24 41 8 26C-6 12 15-3 24 12 33-3 54 12 40 26Z" fill="#fecdd3"/>,
  mobile: <><rect x="12" y="4" width="24" height="40" rx="6" fill={lavender}/><rect x="17" y="11" width="14" height="23" rx="2" fill="white"/><path d="M22 39h4M21 7h6"/></>,
  chart: <><rect x="6" y="5" width="36" height="38" rx="6" fill="white"/><path d="M14 34V24h5v10m5 0V18h5v16m5 0V12" stroke={mint} strokeWidth="4"/><path d="M12 35h24"/></>,
  audio: <><path d="M8 18h9l11-9v30L17 30H8Z" fill={sky}/><path d="M34 17c4 4 4 10 0 14m5-21c9 8 9 20 0 28"/></>,
  palette: <><path d="M43 24C43 9 29 3 18 7 1 12 2 32 14 39c7 4 15 3 15-2 0-3-6-2-4-7 2-5 18 6 18-6Z" fill="white"/><circle cx="15" cy="16" r="3" fill={gold} stroke="none"/><circle cx="27" cy="13" r="3" fill={mint} stroke="none"/><circle cx="35" cy="21" r="3" fill={lavender} stroke="none"/><circle cx="12" cy="28" r="3" fill={sky} stroke="none"/></>,
  school: <><path d="M7 20h34v23H7Z" fill="white"/><path d="m3 20 21-15 21 15Z" fill={gold}/><path d="M19 43V30h10v13m-15-16v5m20-5v5"/><circle cx="24" cy="16" r="3" fill="white"/></>,
  users: <><circle cx="24" cy="14" r="7" fill={gold}/><path d="M11 42v-5a13 13 0 0 1 26 0v5Z" fill={lavender}/><path d="M8 10a6 6 0 0 0 0 12M3 36v-4a9 9 0 0 1 8-9m29-13a6 6 0 0 1 0 12m5 14v-4a9 9 0 0 0-8-9"/></>,
  shield: <><path d="M24 5 41 12v13c0 8-8 14-17 19C15 39 7 33 7 25V12Z" fill={mint}/><path d="m16 24 6 6 11-13"/></>,
  lock: <><path d="M14 22V14a10 10 0 0 1 20 0v8"/><rect x="9" y="21" width="30" height="23" rx="6" fill={lavender}/><path d="M24 29v7"/></>,
  mail: <><rect x="5" y="10" width="38" height="29" rx="6" fill="white"/><path d="m6 14 18 14 18-14" stroke={lavender} strokeWidth="3"/></>,
  search: <><circle cx="21" cy="21" r="14" fill={sky}/><path d="m31 31 11 11" strokeWidth="5"/><path d="M13 20a8 8 0 0 1 8-8" stroke="white"/></>,
  question: <><path d="M41 22a17 17 0 0 1-21 16L7 43l3-13A17 17 0 1 1 41 22Z" fill={lavender}/><path d="M19 17a5 5 0 1 1 7 5c-3 1-3 3-3 4"/><circle cx="23" cy="32" r="1.5" fill="currentColor" stroke="none"/></>,
  trophy: <><path d="M14 6h20v10c0 16-20 16-20 0Z" fill={gold}/><path d="M14 10H6v5c0 7 6 9 10 9m18-14h8v5c0 7-6 9-10 9M24 28v10m-9 5h18m-14-5h10v5H19Z"/></>,
  home: <><path d="m5 23 19-17 19 17"/><path d="M10 20v22h28V20" fill={sky}/><path d="M20 42V29h9v13"/></>,
  check: <><circle cx="24" cy="24" r="19" fill={mint}/><path d="m14 24 7 7 14-15"/></>,
  'arrow-right': <><path d="M8 24h31m-12-12 12 12-12 12"/></>,
  download: <><path d="M24 5v25m-9-9 9 9 9-9M7 31v10h34V31"/></>,
  shuffle: <><path d="M7 12h7c8 0 12 24 20 24h7m-8-7 8 7-8 7M7 36h7c3 0 5-3 8-8m5-9c3-5 4-7 7-7h7m-8-7 8 7-8 7"/></>,
  clock: <><circle cx="24" cy="24" r="19" fill="white"/><path d="M24 12v13l8 5"/></>,
  puzzle: <path d="M7 7h12c-3 11 13 11 10 0h12v12c-11-3-11 13 0 10v12H29c3-11-13-11-10 0H7V29c11 3 11-13 0-10Z" fill={mint}/>,
  target: <><circle cx="24" cy="25" r="18" fill={lavender}/><circle cx="24" cy="25" r="10" fill="white"/><path d="m24 25 15-17m-2-4 1 7 7-1"/><circle cx="24" cy="25" r="3" fill={gold} stroke="none"/></>,
  cards: <><rect x="5" y="8" width="24" height="32" rx="5" fill={lavender} transform="rotate(-8 17 24)"/><rect x="21" y="9" width="23" height="32" rx="5" fill="white"/><path d="m32 17 3 6 6 1-5 5 1 6-5-3-5 3 1-6-4-5 6-1Z" fill={gold} stroke="none"/></>,
  basket: <><path d="m7 21 5 21h24l5-21Z" fill={gold}/><path d="M4 21h40M14 21 23 6m11 15L25 6M19 28l1 8m9-8-1 8"/></>,
  balloon: <><ellipse cx="24" cy="19" rx="15" ry="16" fill="#fecdd3"/><path d="m24 35-3 4h6Zm0 4c-8 2 8 3 0 7M16 17c0-4 2-6 5-7"/></>,
  train: <><rect x="6" y="19" width="36" height="18" rx="4" fill={sky}/><path d="M11 19V7h13v12m10 0V9h5v10" fill={lavender}/><circle cx="14" cy="39" r="5" fill={gold}/><circle cx="35" cy="39" r="5" fill={gold}/></>,
  sort: <><path d="M24 5v23m0-16L11 25m13-13 13 13"/><rect x="4" y="28" width="15" height="15" rx="4" fill={lavender}/><rect x="29" y="28" width="15" height="15" rx="4" fill={mint}/></>,
  tiles: <><rect x="6" y="5" width="15" height="17" rx="4" fill={lavender}/><rect x="27" y="5" width="15" height="17" rx="4" fill={sky}/><rect x="6" y="28" width="15" height="15" rx="4" fill={gold}/><rect x="27" y="28" width="15" height="15" rx="4" fill={mint}/></>,
  hammer: <><path d="m17 21 8-8 18 20-8 8Z" fill={gold}/><path d="m5 14 10-9 15 15-10 9Z" fill={lavender}/></>,
  camera: <><path d="M6 14h9l4-7h10l4 7h9v27H6Z" fill={lavender}/><circle cx="24" cy="26" r="8" fill="white"/><path d="M36 20h1"/></>,
}

export default function LearningIcon({ name, className = '' }: { name: LearningIconName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={`learning-icon ${className}`} aria-hidden="true" focusable="false">
      {DRAWINGS[name]}
    </svg>
  )
}

export function IconBadge({ name, size = 'md', className = '' }: { name: LearningIconName; size?: 'sm' | 'md' | 'lg' | 'hero'; className?: string }) {
  return <span className={`learning-badge learning-badge-${size} ${className}`} aria-hidden="true"><LearningIcon name={name} /></span>
}
