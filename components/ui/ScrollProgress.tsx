"use client"
import { useEffect, useState } from 'react'

/**
 * Top-of-page scroll progress indicator (gradient bar).
 * Mounted once globally in pages/_app.tsx.
 */
export default function ScrollProgress() {
  const [w, setW] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement
        const total = doc.scrollHeight - doc.clientHeight
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0
        setW(pct)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="scroll-progress" style={{ width: `${w}%` }} aria-hidden="true" />
}
