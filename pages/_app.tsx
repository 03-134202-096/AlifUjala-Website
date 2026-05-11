import '@/styles/tailwind.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ScrollProgress from '@/components/ui/ScrollProgress'

export default function App({ Component, pageProps, router: _r }: AppProps) {
  const [dark, setDark] = useState(false)
  const router = useRouter()
  const [routeKey, setRouteKey] = useState(router.asPath)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  // Re-trigger page-fade animation on route changes
  useEffect(() => {
    const handle = (url: string) => setRouteKey(url)
    router.events.on('routeChangeComplete', handle)
    return () => router.events.off('routeChangeComplete', handle)
  }, [router.events])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <>
      <ScrollProgress />
      <div key={routeKey} className="page-fade">
        <Component {...pageProps} toggleTheme={toggleTheme} isDark={dark} />
      </div>
    </>
  )
}
