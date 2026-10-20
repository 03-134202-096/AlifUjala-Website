import UrduTraceGlyph from '@/components/UrduTraceGlyph'
import { DecorativeBlobs, LearningIcon, IconBadge } from '@/components/ui'
﻿import React, { useEffect, useMemo, useRef, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MatchingBoard from "@/components/MatchingBoard"
import alphabetsData from "@/data/alphabets.json"
import LoadingIndicator from "@/components/LoadingIndicator"
import SEO from "@/components/SEO"

type Letter = { id: string; char: string; name: string }

type Item = { id: string; label?: string }

type GameStatus = "checking" | "playing" | "out" | "error"

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function PageDecorations() {
  return <DecorativeBlobs motifs={['pencil', 'letters']} />
}

function DottedLetter({ char }: { char: string }) {
  return char ? <UrduTraceGlyph char={char} className="text-slate-700 dark:text-indigo-100" /> : <span>--</span>
}

function SolidLetter({ char, className = '' }: { char: string; className?: string }) {
  return char ? <UrduTraceGlyph char={char} dotted={false} className={className} /> : <span>--</span>
}

export default function UrduDottedMatchPage() {
  const [status, setStatus] = useState<GameStatus>("checking")
  const [count, setCount] = useState(6)
  const [startId, setStartId] = useState("alif")
  const [endId, setEndId] = useState("bari-yaa")
  const [seed, setSeed] = useState(Date.now())
  const [gameStarted, setGameStarted] = useState(false)
  const [triggerSubmit, setTriggerSubmit] = useState(false)
  const matchingBoardRef = useRef<HTMLDivElement>(null)

  const allLetters = ((alphabetsData as unknown as { letters: Letter[] }).letters || []) as Letter[]

  const previewChar = allLetters.find((letter) => letter.id === "alif")?.char || allLetters[0]?.char || ""

  const slice = useMemo(() => {
    const si = allLetters.findIndex((letter) => letter.id === startId)
    const ei = allLetters.findIndex((letter) => letter.id === endId)
    if (si === -1 || ei === -1) return allLetters
    const [a, b] = si <= ei ? [si, ei] : [ei, si]
    return allLetters.slice(a, b + 1)
  }, [allLetters, startId, endId])

  const [left, setLeft] = useState<Item[]>([])
  const [right, setRight] = useState<Item[]>([])

  const handleGameButton = () => {
    if (!gameStarted) {
      setGameStarted(true)
      setTimeout(() => {
        if (matchingBoardRef.current) {
          matchingBoardRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 200)
    } else {
      setTriggerSubmit(true)
    }
  }

  useEffect(() => {
    if (status !== "playing") return
    const pool = [...slice]
    const take = Math.max(5, Math.min(8, Math.min(count, pool.length)))
    const chosen = shuffle(pool).slice(0, take)
    setLeft(chosen.map((letter) => ({ id: letter.id, label: letter.char })))
    setRight(shuffle(chosen).map((letter) => ({ id: letter.id, label: letter.char })))
  }, [status, slice, count, seed])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/play", { method: "POST" })
        const data = await res.json()
        if (res.ok && data.ok) {
          setStatus("playing")
          return
        }
        if (res.status === 403 || data?.error === "out of lives") {
          setStatus("out")
          return
        }
        setStatus("playing")
      } catch (err) {
        console.warn("play check failed, allowing anonymous play", err)
        setStatus("playing")
      }
    })()
  }, [])

  const handleUpgrade = async () => {
    const res = await fetch("/api/upgrade", { method: "POST" })
    const data = await res.json()
    if (res.ok) {
      alert("You are now Premium. Unlimited lives unlocked.")
      window.location.reload()
    } else {
      alert("" + data.error)
    }
  }

  if (status === "checking") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingIndicator message="Loading activity..." />
      </div>
    )
  }
  if (status === "out") {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Free plays used</h2>
        <p>Upgrade to premium for unlimited plays.</p>
        <button onClick={handleUpgrade} className="btn" style={{ marginTop: 16 }}>
          Buy Premium
        </button>
      </div>
    )
  }
  if (status !== "playing") return <p className="center" style={{ marginTop: 24 }}>Error loading activity</p>

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Dotted Letter Match"
        description="Match dotted Urdu letters to their full forms. A focused activity for letter recognition and tracing readiness."
        ogUrl="https://alifujala.ai/games/urduDottedMatch"
        keywords="Urdu dotted letters, Urdu tracing activity, Urdu alphabet match, Urdu learning for kids"
      />
      <PageDecorations />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-indigo-950 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-indigo-200/70 dark:border-indigo-700/60 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 right-[-20px] h-48 w-48 rounded-full bg-gradient-to-br from-indigo-200/60 to-purple-200/20 blur-2xl" />
            <div className="absolute bottom-[-80px] left-[-40px] h-56 w-56 rounded-full bg-gradient-to-br from-amber-200/60 to-pink-200/20 blur-2xl" />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-500">Trace and match</p>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-3 text-indigo-700 dark:text-indigo-100"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  Dotted Letter Match
                </h1>
                <p className="text-indigo-700 dark:text-indigo-50 text-sm sm:text-base max-w-xl">
                  Connect dotted outlines on the left to the full Urdu letters on the right. This activity builds shape recognition and tracing readiness.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    "Start the game",
                    "Drag a dotted letter",
                    "Drop on the full letter",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-indigo-200/70 dark:border-indigo-700/60 bg-indigo-50/80 dark:bg-indigo-900/40 px-4 py-3 text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-100"
                    >
                      <span className="block text-[0.65rem] uppercase tracking-widest text-indigo-500">Step {index + 1}</span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl border-4 border-white/25">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-white/80">
                  <span>Preview</span>
                  <span className="font-bold">Dotted vs Full</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/[0.15] p-4 text-center">
                    <div className="text-[0.65rem] uppercase tracking-widest text-white/70">Dotted</div>
                    <div className="mt-2 h-20 flex items-center justify-center">
                      <DottedLetter char={previewChar} />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/[0.15] p-4 text-center">
                    <div className="text-[0.65rem] uppercase tracking-widest text-white/70">Full</div>
                    <div className="mt-2 h-20 flex items-center justify-center">
                      <SolidLetter char={previewChar} className="text-white" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/80">
                  Use short sessions and repeat the same set to build memory.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="responsive-game-toolbar">
          <div className="toolbar-controls">
            <div className="control-group">
              <label className="control-label">
                <span className="label-text">Count</span>
                <select
                  value={count}
                  onChange={(event) => setCount(Number(event.target.value))}
                  className="responsive-select"
                >
                  {[5, 6, 7, 8].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="control-group">
              <label className="control-label">
                <span className="label-text">From</span>
                <select
                  value={startId}
                  onChange={(event) => setStartId(event.target.value)}
                  className="responsive-select"
                >
                  {allLetters.map((letter) => (
                    <option key={letter.id} value={letter.id}>
                      {letter.char}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="control-group">
              <label className="control-label">
                <span className="label-text">To</span>
                <select
                  value={endId}
                  onChange={(event) => setEndId(event.target.value)}
                  className="responsive-select"
                >
                  {allLetters.map((letter) => (
                    <option key={letter.id} value={letter.id}>
                      {letter.char}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="control-group">
              <button className="responsive-btn load-btn" onClick={() => setSeed(Date.now())}>
                <span className="btn-text">Shuffle</span>
              </button>
            </div>

            <div className="control-group">
              <button className="responsive-btn game-btn" onClick={handleGameButton}>
                <span className="btn-text">{gameStarted ? "Submit" : "Start"}</span>
              </button>
            </div>
          </div>

          <div className="toolbar-actions">
            <div className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-200">
              Range size: {slice.length} letters
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-indigo-950 backdrop-blur-md rounded-3xl p-4 sm:p-6 border-2 border-indigo-200/70 dark:border-indigo-700/60 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg shadow-md" aria-hidden>✍️</span>
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 dark:text-indigo-100" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                  Match the Dotted Letters
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-200">
                Drag from <span className="underline decoration-dotted">dotted</span> → <span className="underline">full</span> letter.
              </p>
            </div>

            <div ref={matchingBoardRef} className="matching-board-container">
              <MatchingBoard
                leftItems={left}
                rightItems={right}
                mode="letters"
                gameStarted={gameStarted}
                triggerSubmit={triggerSubmit}
                onGameButtonClick={handleGameButton}
                onComplete={() => {
                  setGameStarted(false)
                  setTriggerSubmit(false)
                }}
                renderLeftItem={(item) => (
                  <div className="w-full h-full p-1.5 flex items-center justify-center text-slate-700 dark:text-indigo-100">
                    <DottedLetter char={item.label || ""} />
                  </div>
                )}
                renderRightItem={(item) => (
                  <div className="w-full h-full p-1.5 flex items-center justify-center text-slate-800 dark:text-indigo-50">
                    <SolidLetter char={item.label || ""} />
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
