import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import SEO from '@/components/SEO'
import DownloadWorksheet from '@/components/DownloadWorksheet'
import alphabetsData from '@/data/alphabets.json'
import { buildWorksheetCanvas, type WorksheetBgType } from '@/lib/worksheetRenderer'
import { SectionHeader, DecorativeBlobs } from '@/components/ui'

type Letter = { id: string; char: string; name: string }
type WorksheetItem = { id: string; label?: string; src?: string }
type ActivitySection = 'interactive' | 'printable'
type WorksheetType = 'tracing' | 'alphabet' | 'image' | 'adhi'

// Include the Urdu forms missing from the game's image-based letter set.
// Repertoire: https://www.unicode.org/cldr/charts/48/summary/ur.html
const EXTRA_TRACING_LETTERS: Record<string, Letter> = {
  dal: { id: 'ddal', char: 'ڈ', name: 'Ddal' },
  noon: { id: 'noon-ghunna', char: 'ں', name: 'Noon Ghunna' },
  he: { id: 'do-chashmi-he', char: 'ھ', name: 'Do Chashmi He' },
}
const TRACING_LETTERS: Letter[] = alphabetsData.letters.flatMap((letter) =>
  EXTRA_TRACING_LETTERS[letter.id] ? [letter, EXTRA_TRACING_LETTERS[letter.id]] : [letter]
)

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

const WORKSHEET_META: Record<WorksheetType, { title: string; filename: string; helper: string }> = {
  tracing: {
    title: 'Urdu Letter Tracing / اردو حروف کی مشق',
    filename: 'worksheet_urdu_letter_tracing.pdf',
    helper: 'Follow the dotted Urdu letters with a pencil. Start at the right and move left.',
  },
  alphabet: {
    title: 'Alphabet Matching / حرف ملائیں',
    filename: 'worksheet_alphabet_match.pdf',
    helper: 'Match Urdu letters with their correct pair.',
  },
  image: {
    title: 'Letter to Image Matching / حرف اور تصویر',
    filename: 'worksheet_letter_image_match.pdf',
    helper: 'Match letters with picture tiles and practice recognition.',
  },
  adhi: {
    title: 'Adhi Ashkal Matching / آدھی اشکال ملائیں',
    filename: 'worksheet_adhi_ashkal_match.pdf',
    helper: 'Match letters with their half-shape style cards.',
  },
}

const SITE_URL = 'https://alifujala.ai'

const WORKSHEET_SAMPLE_IMAGES = [
  {
    src: '/images/worksheetsSample/one.png',
    alt: 'Urdu worksheet sample 1 for kids',
  },
  {
    src: '/images/worksheetsSample/two.png',
    alt: 'Urdu worksheet sample 2 for children',
  },
  {
    src: '/images/worksheetsSample/three.png',
    alt: 'Printable Urdu worksheet sample 3',
  },
  {
    src: '/images/worksheetsSample/four.png',
    alt: 'Printable Urdu worksheet sample 4',
  },
  {
    src: '/images/worksheetsSample/five.png',
    alt: 'Urdu learning worksheet sample 5',
  },
  {
    src: '/images/worksheetsSample/six.png',
    alt: 'Urdu worksheet sample 6 for kids',
  },
]

const WORKSHEET_SAMPLE_IMAGE_OBJECTS = WORKSHEET_SAMPLE_IMAGES.map((img) => ({
  '@type': 'ImageObject',
  contentUrl: `${SITE_URL}${img.src}`,
  caption: img.alt,
}))

const WORKSHEET_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Printable Urdu Worksheets',
  description: 'Printable Urdu worksheets for kids with sample pages and downloadable practice sheets.',
  url: `${SITE_URL}/activity`,
  image: WORKSHEET_SAMPLE_IMAGE_OBJECTS.map((img) => img.contentUrl),
  hasPart: WORKSHEET_SAMPLE_IMAGE_OBJECTS,
}

/* Animated floating shapes */
function ActivityDecorations() {
  return <DecorativeBlobs variant="soft" emojis={["✨", "📚", "🌟", "🎨", "💫"]} />
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
  const [tracingCount, setTracingCount] = useState(0)
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
  const isTracing = worksheetType === 'tracing'
  const worksheetLayout = isTracing ? 'tracing' : 'matching'

  const activePool = useMemo(
    () => (worksheetType === 'tracing' ? TRACING_LETTERS : worksheetType === 'adhi' ? adhiLetters : allLetters),
    [worksheetType, adhiLetters, allLetters]
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

  const worksheetMeta = WORKSHEET_META[worksheetType]

  const regenerateWorksheet = () => {
    setSeed(Date.now())
    setColorBgIndex(Math.floor(Math.random() * 4))
  }

  const resetTracingRange = () => {
    setStartId(TRACING_LETTERS[0]?.id || '')
    setEndId(TRACING_LETTERS[TRACING_LETTERS.length - 1]?.id || '')
    setTracingCount(0)
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

      if (worksheetType === 'tracing') {
        const chosen = tracingCount ? pool.slice(0, tracingCount) : pool
        setLeftItems(chosen.map((letter) => ({ id: letter.id, label: letter.char })))
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
  }, [worksheetType, worksheetCount, tracingCount, selectedSlice, activePool, seed, allLetters])

  useEffect(() => {
    let cancelled = false

    const generatePreview = async () => {
      setPreviewError('')
      if (!leftItems.length || (!isTracing && !rightItems.length)) {
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
  }, [leftItems, rightItems, worksheetMeta.title, bgType, colorBgIndex, isTracing, worksheetLayout])

  const activities = [
    {
      href: "/games/alphabetMatch",
      img: "/images/matchLetter.webp",
      title: "Letter to Letter",
      description: "Match Urdu letters together!",
      emoji: "🔤",
    },
    {
      href: "/games/matching",
      img: "/images/letterImg.webp",
      title: "Letter to Image",
      description: "Match letters with pictures!",
      emoji: "🖼️",
    },
    {
      href: "/games/adhiAshkalMatch",
      img: "/images/halfLetters.webp",
      title: "Adhi Ashkal",
      description: "Match half letter shapes!",
      emoji: "✂️",
    },
    {
      href: "/games/urduDottedMatch",
      img: "/images/alphabat-to-alphabat.webp",
      title: "Dotted Letter Match",
      description: "Match dotted letters with the full form.",
      emoji: "✏️",
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
          eyebrow="✨ Activities"
          emoji="🎯"
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
              🎯 Interactive Sheets
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
              🖨️ Printable Worksheets
            </button>
          </div>
        </div>

        {activeSection === 'interactive' && (
          <>
            {/* Activity cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-10">
              {activities.map((act, i) => (
                <Link key={i} href={act.href} className="group flex flex-col items-center">
                  <div className="w-full rounded-3xl overflow-hidden shadow-lg border-2 border-purple-200/50 dark:border-purple-500/30 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-xl">
                    <img
                      src={act.img}
                      alt={act.title}
                      className="w-full h-auto block"
                      style={{display:'block'}}
                    />
                  </div>
                  <div className="mt-3 text-center px-1">
                    <p className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 transition-colors" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                      <span className="mr-1">{act.emoji}</span> {act.title}
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
                  🕹️ Want Arcade Games?
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
                  🌟 More Activities Coming Soon! 🌟
                </h3>
                <p className="text-gray-600 text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>
                  We&apos;re making exciting new learning activities for you! Stay tuned! 🚀
                </p>
              </div>
            </div>
          </>
        )}

        {activeSection === 'printable' && (
          <div className="max-w-6xl mx-auto mb-10 space-y-6">
            <div className="bg-white dark:bg-indigo-950 rounded-3xl p-5 sm:p-6 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-indigo-700 dark:text-indigo-100" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                🖨️ Printable Worksheets
              </h2>
              <p className="text-sm sm:text-base text-indigo-700 dark:text-indigo-50 mb-5" style={{ fontFamily: "'Comic Neue', cursive" }}>
                Select worksheet type and letter range. The preview below matches the downloadable worksheet layout.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">Worksheet</span>
                  <select
                    value={worksheetType}
                    onChange={(e) => setWorksheetType(e.target.value as WorksheetType)}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    <option value="tracing">Urdu Letter Tracing</option>
                    <option value="alphabet">Letter to Letter</option>
                    <option value="image">Letter to Image</option>
                    <option value="adhi">Adhi Ashkal</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">{isTracing ? 'Letters' : 'Count'}</span>
                  <select
                    value={isTracing ? tracingCount : worksheetCount}
                    onChange={(e) => isTracing ? setTracingCount(Number(e.target.value)) : setWorksheetCount(Number(e.target.value))}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    {isTracing && <option value={0}>All in range ({selectedSlice.length})</option>}
                    {(isTracing ? [6, 12, 24] : [5, 6, 7, 8]).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-50 uppercase tracking-wider">From</span>
                  <select
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
                    value={endId}
                    onChange={(e) => setEndId(e.target.value)}
                    className="rounded-xl border border-indigo-200 dark:border-indigo-600 bg-white/90 dark:bg-indigo-900/75 px-3 py-2 text-indigo-800 dark:text-indigo-100 font-semibold"
                  >
                    {activePool.map((letter) => (
                      <option key={letter.id} value={letter.id}>{letter.char}</option>
                    ))}
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    onClick={isTracing ? resetTracingRange : regenerateWorksheet}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold px-4 py-2.5 hover:scale-[1.02] transition-transform"
                    style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                  >
                    {isTracing ? '↺ Reset Range' : '🔀 Shuffle'}
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
                    👀 Live Preview
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-50" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    This preview mirrors the worksheet look before download.
                  </p>
                </div>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-100 uppercase tracking-wider">
                  {isTracing ? `Tracing: ${leftItems.length} letters · Right to left` : `Range size: ${selectedSlice.length || activePool.length} letters`}
                </p>
              </div>

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

            <div className="bg-white dark:bg-indigo-950 rounded-3xl p-5 sm:p-6 border-2 border-purple-200 dark:border-purple-700 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-100" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                    Worksheet Samples
                  </h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-50" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    Preview sample Urdu worksheets for kids and classrooms.
                  </p>
                </div>
                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-100 uppercase tracking-wider">
                  Printable examples
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WORKSHEET_SAMPLE_IMAGES.map((image) => (
                  <figure
                    key={image.src}
                    className="rounded-2xl border border-indigo-200/70 dark:border-indigo-700/70 bg-white/80 dark:bg-indigo-900/75 p-3 shadow-sm"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto rounded-xl"
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
