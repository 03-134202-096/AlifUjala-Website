import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SEO from '@/components/SEO'
import DownloadWorksheet from '@/components/DownloadWorksheet'
import alphabetsData from '@/data/alphabets.json'
import { PRACTICE_LETTERS, PICTURE_PRACTICE_LETTERS } from '@/data/practiceLetters'
import { WORKSHEET_TEMPLATES, PRACTICE_TEMPLATE_IDS, type WorksheetType } from '@/data/worksheetTemplates'
import { buildWorksheetCanvas, getWorksheetPageCount, type WorksheetBgType, type WorksheetItem } from '@/lib/worksheetRenderer'
import { SectionHeader, DecorativeBlobs, LearningIcon, IconBadge, type LearningIconName } from '@/components/ui'

type Letter = { id: string; char: string; name: string }
type ActivitySection = 'interactive' | 'printable'

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

const FOLDER_TO_URDU: Record<string, string> = {
  ain: 'ع', alif: 'ا', bay: 'ب', che: 'چ', daad: 'ض',
  daal: 'د', ddaal: 'ڈ', fe: 'ف', gaaf: 'گ',
  ghain: 'غ', haa: 'ہ', hamza: 'ء', hha: 'ح', jeem: 'ج',
  kaaf: 'ک', khaa: 'خ', laam: 'ل', meem: 'م', noon: 'ن',
  pay: 'پ', qaaf: 'ق', ray: 'ر', rray: 'ڑ',
  saad: 'ص', say: 'ث', seen: 'س', sheen: 'ش', tay: 'ت',
  toein: 'ط', tte: 'ٹ', wao: 'و', yay: 'ی', zaal: 'ذ',
  zaay: 'ز', zhay: 'ژ', zoein: 'ظ',
}

const SMALL_ALPHABETS_MAP: Record<string, string> = {
  ain: 'aain-smalla.webp',
  bay: 'be-small.webp',
  pay: 'pe-small-1.webp',
  chay: 'che-small.webp',
  fay: 'fay-small.webp',
  gaaf: 'gaaf-small.webp',
  ghain: 'ghain-small.webp',
  hay: 'khay-small.webp',
  jeem: 'jeem-small.webp',
  kaf: 'kaaf-small.webp',
  kaaf: 'kaaf-small.webp',
  khay: 'khway-small.webp',
  laam: 'laam-small.webp',
  meem: 'meem-small.webp',
  noon: 'noon-small.webp',
  qaf: 'qaaf-small.webp',
  seen: 'seen-small.webp',
  sheen: 'sheen-small.webp',
  swad: 'swaad-small.webp',
  zwad: 'zwaad-small.webp',
  tay: 'te-small-1.webp',
  say: 'se-small-1.webp',
  tte: 'tte-small-1.webp',
  'choti-yaa': 'yay-small.webp',
}

const SITE_URL = 'https://alifujala.ai'

const WORKSHEET_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Printable Urdu Worksheets',
  description: 'Printable Urdu worksheets for kids — tracing, writing, picture practice, letter spotlight, find & circle, and matching activities, generated on demand and ready to download.',
  url: `${SITE_URL}/activity`,
}

/* Animated floating shapes */
function ActivityDecorations() {
  return <DecorativeBlobs variant="soft" motifs={["pencil","letters"]} />
}

export default function ActivityIndex() {
  const [activeSection, setActiveSection] = useState<ActivitySection>('interactive')
  const allLetters = ((alphabetsData as unknown as { letters: Letter[] }).letters || []) as Letter[]

  const adhiLetters = useMemo(
    () => allLetters.filter((letter) => !!SMALL_ALPHABETS_MAP[letter.id]),
    [allLetters]
  )

  const [worksheetType, setWorksheetType] = useState<WorksheetType>('tracing')
  const [worksheetCount, setWorksheetCount] = useState(6)
  const [practiceCount, setPracticeCount] = useState(0)
  const [seed, setSeed] = useState(Date.now())
  const [colorBgIndex, setColorBgIndex] = useState(0)
  const [bgType, setBgType] = useState<WorksheetBgType>('bw')
  const [leftItems, setLeftItems] = useState<WorksheetItem[]>([])
  const [rightItems, setRightItems] = useState<WorksheetItem[]>([])
  const [previewSrc, setPreviewSrc] = useState('')
  const [isSheetLoading, setIsSheetLoading] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [sheetError, setSheetError] = useState('')
  const [previewError, setPreviewError] = useState('')
  const [previewPage, setPreviewPage] = useState(0)
  const worksheetMeta = WORKSHEET_TEMPLATES[worksheetType]
  const worksheetLayout = worksheetMeta.layout
  const isPractice = worksheetLayout !== 'matching'
  const hasPictures = worksheetLayout === 'picture-rows' || worksheetLayout === 'letter-focus'
  const pageCount = getWorksheetPageCount(worksheetLayout, leftItems.length)
  const effectivePreviewPage = Math.min(previewPage, pageCount - 1)

  const activePool = useMemo(
    () => (hasPictures ? PICTURE_PRACTICE_LETTERS : isPractice ? PRACTICE_LETTERS : worksheetType === 'adhi' ? adhiLetters : allLetters),
    [hasPictures, isPractice, worksheetType, adhiLetters, allLetters]
  )

  const [startId, setStartId] = useState(allLetters[0]?.id || '')
  const [endId, setEndId] = useState(allLetters[allLetters.length - 1]?.id || '')

  useEffect(() => {
    if (!activePool.length) {
      setStartId('')
      setEndId('')
      return
    }
    if (!startId || !activePool.find((letter) => letter.id === startId)) {
      setStartId(activePool[0].id)
    }
    if (!endId || !activePool.find((letter) => letter.id === endId)) {
      setEndId(activePool[activePool.length - 1].id)
    }
  }, [activePool, startId, endId])

  const selectedSlice = useMemo(() => {
    if (!activePool.length) return []
    const startIndex = activePool.findIndex((letter) => letter.id === startId)
    const endIndex = activePool.findIndex((letter) => letter.id === endId)
    if (startIndex === -1 || endIndex === -1) return activePool
    const [a, b] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex]
    return activePool.slice(a, b + 1)
  }, [activePool, startId, endId])

  useEffect(() => {
    setPreviewPage(0)
  }, [worksheetType, startId, endId, practiceCount, worksheetCount, seed])

  const regenerateWorksheet = () => {
    setSeed(Date.now())
    setColorBgIndex(Math.floor(Math.random() * 4))
  }

  const resetPracticeRange = () => {
    setStartId(activePool[0]?.id || '')
    setEndId(activePool[activePool.length - 1]?.id || '')
    setPracticeCount(0)
  }

  useEffect(() => {
    let cancelled = false

    const generateWorksheetItems = async () => {
      setSheetError('')
      setIsSheetLoading(false)

      const pool = selectedSlice.length ? selectedSlice : activePool
      if (!pool.length) {
        if (!cancelled) {
          setLeftItems([])
          setRightItems([])
        }
        return
      }

      const requested = Math.max(5, Math.min(8, worksheetCount))
      const take = Math.min(requested, pool.length)

      if (isPractice) {
        const chosen = practiceCount ? pool.slice(0, practiceCount) : pool
        setLeftItems(chosen.map((letter) => {
          const details = PRACTICE_LETTERS.find((entry) => entry.id === letter.id)
          return { id: letter.id, label: letter.char, name: letter.name, src: details?.src, word: details?.word }
        }))
        setRightItems([])
        return
      }

      const fallbackToLetterPairs = () => {
        const chosen = shuffle(pool).slice(0, take)
        const left = chosen.map((letter) => ({ id: letter.id, label: letter.char }))
        const right = shuffle(chosen).map((letter) => ({ id: letter.id, label: letter.char }))
        setLeftItems(left)
        setRightItems(right)
      }

      if (worksheetType === 'alphabet') {
        if (cancelled) return
        fallbackToLetterPairs()
        return
      }

      if (worksheetType === 'adhi') {
        const chosen = shuffle(pool).slice(0, take)
        const left = chosen.map((letter) => ({ id: letter.id, label: letter.char }))
        const right = shuffle(chosen).map((letter) => {
          const filename = SMALL_ALPHABETS_MAP[letter.id]
          if (!filename) {
            return { id: letter.id, label: letter.char }
          }
          return {
            id: letter.id,
            src: `/images/small-alphabets/${filename}`,
            label: letter.char,
          }
        })
        if (cancelled) return
        setLeftItems(left)
        setRightItems(right)
        return
      }

      setIsSheetLoading(true)
      try {
        const ids = pool.map((letter) => letter.id).join(',')
        const params = new URLSearchParams({ count: String(take), seed: String(seed) })
        if (ids) params.set('ids', ids)

        const response = await fetch(`/api/letter-images?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`letter-images failed (${response.status})`)
        }

        const data = await response.json()
        const images = (data?.images || []) as Array<{ id: string; src: string }>
        if (!images.length) {
          throw new Error('No worksheet images found for selected range')
        }

        const chosen = images.slice(0, take)
        const left = chosen.map((entry) => {
          const urdu =
            FOLDER_TO_URDU[entry.id] ||
            allLetters.find((letter) => letter.id === entry.id)?.char ||
            entry.id
          return { id: entry.id, label: urdu }
        })
        const right = shuffle(chosen).map((entry) => ({ id: entry.id, src: entry.src }))

        if (cancelled) return
        setLeftItems(left)
        setRightItems(right)
      } catch (error) {
        if (cancelled) return
        setSheetError('Could not load worksheet images for this range, showing letter fallback preview instead.')
        fallbackToLetterPairs()
      } finally {
        if (!cancelled) {
          setIsSheetLoading(false)
        }
      }
    }

    generateWorksheetItems()

    return () => {
      cancelled = true
    }
  }, [worksheetType, isPractice, worksheetCount, practiceCount, selectedSlice, activePool, seed, allLetters])

  useEffect(() => {
    let cancelled = false

    const generatePreview = async () => {
      setPreviewError('')
      if (!leftItems.length || (!isPractice && !rightItems.length)) {
        setPreviewSrc('')
        setIsPreviewLoading(false)
        return
      }

      setIsPreviewLoading(true)
      try {
        const { canvas } = await buildWorksheetCanvas({
          left: leftItems,
          right: rightItems,
          title: worksheetMeta.title,
          bgType,
          colorBackgroundIndex: colorBgIndex,
          scaleFactor: 1,
          layout: worksheetLayout,
          pageIndex: effectivePreviewPage,
          seed,
        })
        if (!cancelled) {
          setPreviewSrc(canvas.toDataURL('image/png'))
        }
      } catch {
        if (!cancelled) {
          setPreviewSrc('')
          setPreviewError('Could not render the worksheet. Please change a setting or try again.')
        }
      } finally {
        if (!cancelled) {
          setIsPreviewLoading(false)
        }
      }
    }

    generatePreview()

    return () => {
      cancelled = true
    }
  }, [leftItems, rightItems, worksheetMeta.title, bgType, colorBgIndex, isPractice, worksheetLayout, effectivePreviewPage, seed])

  const activities = [
    {
      href: "/games/alphabetMatch",
      img: "/images/matchLetter.webp",
      title: "Letter to Letter",
      description: "Match Urdu letters together!",
      icon: 'letters',
    },
    {
      href: "/games/matching",
      img: "/images/letterImg.webp",
      title: "Letter to Image",
      description: "Match letters with pictures!",
      icon: 'palette',
    },
    {
      href: "/games/adhiAshkalMatch",
      img: "/images/halfLetters.webp",
      title: "Adhi Ashkal",
      description: "Match half letter shapes!",
      icon: 'puzzle',
    },
    {
      href: "/games/urduDottedMatch",
      img: "/thumbnail_sheets/dottedHaroofThumnail.webp",
      title: "Dotted Letter Match",
      description: "Match dotted letters with the full form.",
      icon: 'pencil',
    },
  ]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Activities — Learn Urdu Alphabets Through Fun Activities"
        description="Interactive Urdu activities plus printable worksheets with live preview. Trace dotted Urdu letters or match letters, pictures and half-shapes, then download practice sheets for home or school."
        ogUrl="https://alifujala.ai/activity"
        keywords="Urdu activities for kids, printable Urdu worksheets, children worksheets, Urdu learning, match Urdu letters, Urdu alphabet activities, learn Urdu online free"
        structuredData={WORKSHEET_STRUCTURED_DATA}
      />
      <ActivityDecorations />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-6 relative z-10">
        <SectionHeader
          eyebrow="Activities"
          icon="pencil"
          title="Learn, trace & match letters"
          subtitle="Choose interactive sheets or printable worksheets — سیکھیں، لکھیں اور حروف پہچانیں!"
          tone="rainbow"
        />

        {/* Section switcher */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white/70 dark:bg-indigo-900/70 backdrop-blur-md rounded-full p-1.5 flex gap-2 border border-indigo-200 dark:border-indigo-700 shadow-lg">
            <button
              onClick={() => setActiveSection('interactive')}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm sm:text-base font-bold transition-all ${
                activeSection === 'interactive'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-indigo-700 dark:text-indigo-100 hover:bg-indigo-100/70 dark:hover:bg-indigo-800/50'
              }`}
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              <LearningIcon name="puzzle" className="mr-2" /> Interactive Sheets
            </button>
            <button
              onClick={() => setActiveSection('printable')}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm sm:text-base font-bold transition-all ${
                activeSection === 'printable'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                  : 'text-indigo-700 dark:text-indigo-100 hover:bg-indigo-100/70 dark:hover:bg-indigo-800/50'
              }`}
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              <LearningIcon name="worksheet" className="mr-2" /> Printable Worksheets
            </button>
          </div>
        </div>

        {activeSection === 'interactive' && (
          <>
            {/* Activity cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
              {activities.map((act, i) => (
                <Link key={i} href={act.href} className="group flex flex-col items-center">
                  <div className="w-full aspect-[4/3] bg-sky-100 dark:bg-indigo-900 rounded-3xl overflow-hidden shadow-lg border-2 border-purple-200/50 dark:border-purple-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <img
                      src={act.img}
                      alt={act.title}
                      className="w-full h-full object-contain block"
                      style={{display:'block'}}
                    />
                  </div>
                  <div className="mt-3 text-center px-1">
                    <p className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 transition-colors" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                      <IconBadge name={act.icon as LearningIconName} size="sm" className="mr-1.5" /> {act.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
                      {act.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Explore Games CTA */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-center text-white shadow-xl border-4 border-white/20">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                  <LearningIcon name="gamepad" className="mr-2" /> Want Arcade Games?
                </h3>
                <p className="text-white/90 text-base mb-5" style={{fontFamily: "'Comic Neue', cursive"}}>
                  Check out our exciting arcade-style letter games — pop bubbles, catch letters, and test your memory!
                </p>
                <Link
                  href="/games"
                  className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-full text-base shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                  style={{fontFamily: "'Bubblegum Sans', cursive"}}
                >
                  Play Games →
                </Link>
              </div>
            </div>

            {/* Coming soon */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-200 dark:border-indigo-700 rounded-3xl p-6 sm:p-8 text-center">
                <h3 className="text-2xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
                  <IconBadge name="bulb" size="sm" className="mr-2" /> More Activities Coming Soon!
                </h3>
                <p className="text-gray-600 text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>
                  We&apos;re making exciting new learning activities for you! Stay tuned!
                </p>
              </div>
            </div>
          </>
        )}

        {activeSection === 'printable' && (
          <div className="max-w-6xl mx-auto mb-10 space-y-6">
            <section aria-label="Urdu writing and recognition worksheets" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {PRACTICE_TEMPLATE_IDS.map((id) => {
                const template = WORKSHEET_TEMPLATES[id]
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setWorksheetType(id)}
                    aria-pressed={worksheetType === id}
                    className={`group text-left rounded-2xl border-2 p-3 transition-colors ${worksheetType === id
                      ? 'border-violet-500 bg-violet-50 dark:bg-indigo-900 shadow-md'
                      : 'border-indigo-100 dark:border-indigo-800 bg-white dark:bg-indigo-950 hover:border-violet-400'}`}
                  >
                    <div className="aspect-[1/1.15] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-indigo-800 mb-3">
                      <img src={template.thumbnail} alt={`${template.label} worksheet example`} className="block w-full h-full object-contain" loading="lazy" />
                    </div>
                    <span className="block font-bold text-sm text-indigo-800 dark:text-indigo-100"><LearningIcon name={template.icon} className="mr-1.5" />{template.label}</span>
                    <span className="block mt-1 text-xs text-slate-600 dark:text-slate-300">{template.caption}</span>
                  </button>
                )
              })}
            </section>
            <div className="bg-white dark:bg-indigo-950 rounded-3xl p-5 sm:p-6 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-indigo-700 dark:text-indigo-100" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                <IconBadge name="worksheet" className="mr-2" /> Printable Worksheets
              </h2>
              <p className="text-sm sm:text-base text-indigo-700 dark:text-indigo-50 mb-5" style={{ fontFamily: "'Comic Neue', cursive" }}>
                Select worksheet type and letter range. The preview below matches the downloadable worksheet layout.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
                <label className="col-span-2 sm:col-span-1 lg:col-span-2 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">Worksheet</span>
                  <select
                    aria-label="Worksheet type"
                    value={worksheetType}
                    onChange={(e) => setWorksheetType(e.target.value as WorksheetType)}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    <optgroup label="Writing & recognition">
                      {PRACTICE_TEMPLATE_IDS.map((id) => <option key={id} value={id}>{WORKSHEET_TEMPLATES[id].label}</option>)}
                    </optgroup>
                    <optgroup label="Matching activities">
                      {(['alphabet', 'image', 'adhi'] as const).map((id) => <option key={id} value={id}>{WORKSHEET_TEMPLATES[id].label}</option>)}
                    </optgroup>
                  </select>
                </label>

                <label className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">{isPractice ? 'Letters' : 'Count'}</span>
                  <select
                    aria-label="Number of letters"
                    value={isPractice ? practiceCount : worksheetCount}
                    onChange={(e) => isPractice ? setPracticeCount(Number(e.target.value)) : setWorksheetCount(Number(e.target.value))}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    {isPractice && <option value={0}>All in range ({selectedSlice.length})</option>}
                    {(isPractice ? [6, 12, 24] : [5, 6, 7, 8]).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">From</span>
                  <select
                    aria-label="From letter"
                    value={startId}
                    onChange={(e) => setStartId(e.target.value)}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    {activePool.map((letter) => (
                      <option key={letter.id} value={letter.id}>{letter.char}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">To</span>
                  <select
                    aria-label="To letter"
                    value={endId}
                    onChange={(e) => setEndId(e.target.value)}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    {activePool.map((letter) => (
                      <option key={letter.id} value={letter.id}>{letter.char}</option>
                    ))}
                  </select>
                </label>

                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <button
                    onClick={isPractice && worksheetLayout !== 'letter-find' ? resetPracticeRange : regenerateWorksheet}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-2.5 hover:scale-[1.02] transition-transform"
                    style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                  >
                    <LearningIcon name={isPractice && worksheetLayout !== 'letter-find' ? 'letters' : 'shuffle'} className="mr-2" />
                    {worksheetLayout === 'letter-find' ? 'New Puzzle' : isPractice ? 'Reset Range' : 'Shuffle'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-indigo-200/70 dark:border-indigo-700/70 bg-indigo-50/70 dark:bg-indigo-900/75 p-4">
                <div>
                  <p className="font-bold text-indigo-700 dark:text-indigo-100" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    {worksheetMeta.title}
                  </p>
                  <p className="text-sm text-indigo-700 dark:text-indigo-50" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    {worksheetMeta.helper}
                  </p>
                </div>

                <DownloadWorksheet
                  left={leftItems}
                  right={rightItems}
                  title={worksheetMeta.title}
                  filename={worksheetMeta.filename}
                  bgType={bgType}
                  onBgTypeChange={setBgType}
                  colorBackgroundIndex={colorBgIndex}
                  layout={worksheetLayout}
                  pageIndex={effectivePreviewPage}
                  seed={seed}
                  disabled={isSheetLoading || isPreviewLoading || !!previewError}
                />
              </div>

              {(isSheetLoading || sheetError) && (
                <div className="mt-4">
                  {isSheetLoading && (
                    <p className="text-sm font-bold text-indigo-700 dark:text-indigo-50" style={{ fontFamily: "'Comic Neue', cursive" }}>
                      Building worksheet set...
                    </p>
                  )}
                  {!!sheetError && (
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300" style={{ fontFamily: "'Comic Neue', cursive" }}>
                      {sheetError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-indigo-950 rounded-3xl p-5 sm:p-6 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-100" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    <IconBadge name="search" size="sm" className="mr-2" /> Live Preview
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-50" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    This preview mirrors the worksheet look before download.
                  </p>
                </div>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-100 uppercase tracking-wider">
                  {isPractice ? `${leftItems.length} letters · ${pageCount} ${pageCount === 1 ? 'page' : 'pages'} · Right to left` : `Range size: ${selectedSlice.length || activePool.length} letters`}
                </p>
              </div>

              {pageCount > 1 && (
                <nav aria-label="Worksheet preview pages" className="flex items-center justify-center gap-3 mb-4">
                  <button type="button" aria-label="Previous preview page" onClick={() => setPreviewPage((page) => Math.max(0, page - 1))} disabled={effectivePreviewPage === 0 || isPreviewLoading} className="rounded-full border border-indigo-300 dark:border-indigo-700 px-3 py-2 text-sm font-bold text-indigo-700 dark:text-indigo-100 disabled:opacity-40">← Prev</button>
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-100" aria-live="polite">Page {effectivePreviewPage + 1} of {pageCount}</span>
                  <button type="button" aria-label="Next preview page" onClick={() => setPreviewPage((page) => Math.min(pageCount - 1, page + 1))} disabled={effectivePreviewPage >= pageCount - 1 || isPreviewLoading} className="rounded-full border border-indigo-300 dark:border-indigo-700 px-3 py-2 text-sm font-bold text-indigo-700 dark:text-indigo-100 disabled:opacity-40">Next →</button>
                </nav>
              )}
              <div className="mx-auto max-w-[640px] rounded-2xl border border-indigo-200 dark:border-indigo-700 bg-slate-100 dark:bg-slate-900 p-4 sm:p-5 max-h-[72vh] overflow-auto" aria-busy={isPreviewLoading}>
                {isPreviewLoading ? (
                  <div className="h-[220px] sm:h-[260px] flex items-center justify-center text-indigo-700 dark:text-indigo-50 font-bold" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    Rendering preview...
                  </div>
                ) : previewSrc ? (
                  <img
                    src={previewSrc}
                    alt={`${worksheetMeta.title} — printable worksheet preview`}
                    className="block w-full h-auto max-w-[520px] rounded-xl shadow-lg border border-indigo-200 mx-auto"
                  />
                ) : (
                  <div className="h-[220px] sm:h-[260px] flex items-center justify-center text-indigo-700 dark:text-indigo-50 font-bold text-center px-4" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    {previewError || 'Select worksheet settings to generate preview.'}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
