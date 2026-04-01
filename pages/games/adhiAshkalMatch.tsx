import React, { useEffect, useMemo, useState, useRef } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MatchingBoard from "@/components/MatchingBoard"
import lettersData from "@/data/alphabets.json"
import DownloadWorksheet from "@/components/DownloadWorksheet"
import LoadingIndicator from "@/components/LoadingIndicator"

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// Mapping from letter id -> small-alphabet filename in /public/images/small-alphabets
// NOTE: Not all letters have a corresponding small image; we provide mappings for files
// that exist in the repo. For missing images the game will fall back to showing the
// character as text on the right.
const SMALL_ALPHABETS_MAP: Record<string, string> = {
  // common mappings (approximate filenames present in the repo)
  "ain": "aain-smalla.webp",
  "bay": "be-small.webp",
  "pay": "pe-small-1.webp",
  "chay": "che-small.webp",
  "fay": "fay-small.webp",
  "gaaf": "gaaf-small.webp",
  "ghain": "ghain-small.webp",
  "hay": "hay-small.webp",
  "jeem": "jeem-small.webp",
  "kaf": "kaaf-small.webp",
  "kaaf": "kaaf-small.webp",
  "khay": "khay-small.webp",
  "laam": "laam-small.webp",
  "meem": "meem-small.webp",
  "noon": "noon-small.webp",
  "qaf": "qaaf-small.webp",
  "seen": "seen-small.webp",
  "sheen": "sheen-small.webp",
  "swad": "swaad-small.webp",
  "zwad": "zwaad-small.webp",
  "tay": "te-small-1.webp",
  "toay": "tte-small-1.webp",
  "choti-yaa": "yay-small.webp",
  "Khay": "khay-small.webp", 
}

export default function AdhiAshkalMatchPage() {
  const [status, setStatus] = useState<"checking" | "playing" | "out" | "error">("checking")
  const [count, setCount] = useState(5)
  const [startId, setStartId] = useState("")
  const [endId, setEndId] = useState("")
  const [seed, setSeed] = useState(Date.now())
  const [gameStarted, setGameStarted] = useState(false)
  const [gameScore, setGameScore] = useState({ score: 0, total: 0 })
  const [triggerSubmit, setTriggerSubmit] = useState(false)
  const matchingBoardRef = useRef<HTMLDivElement>(null)

  const allLetters = (lettersData as any).letters || []

  // Only include letters that have a corresponding small-alphabet PNG
  const availableLetters = useMemo(() => {
    return (allLetters as any[]).filter((l) => !!SMALL_ALPHABETS_MAP[l.id])
  }, [allLetters])

  // Slice from chosen start to end (on available letters)
  const slice = useMemo(() => {
    const si = availableLetters.findIndex((l: any) => l.id === startId)
    const ei = availableLetters.findIndex((l: any) => l.id === endId)
    if (si === -1 || ei === -1) return availableLetters
    const [a, b] = si <= ei ? [si, ei] : [ei, si]
    return availableLetters.slice(a, b + 1)
  }, [availableLetters, startId, endId])

  // Ensure startId/endId default to first/last available letters
  useEffect(() => {
    if (!availableLetters || !availableLetters.length) return
    if (!startId || availableLetters.findIndex((l: any) => l.id === startId) === -1) {
      setStartId(availableLetters[0].id)
    }
    if (!endId || availableLetters.findIndex((l: any) => l.id === endId) === -1) {
      setEndId(availableLetters[availableLetters.length - 1].id)
    }
  }, [availableLetters])

  const [left, setLeft] = useState<Array<{ id: string; label?: string; src?: string }>>([])
  const [right, setRight] = useState<Array<{ id: string; label?: string; src?: string }>>([])

  // Game button handler
  const handleGameButton = () => {
    if (!gameStarted) {
      // Start Game
      setGameStarted(true)
      setGameScore({ score: 0, total: 0 })
      
      // Smooth scroll to matching board after a short delay
      setTimeout(() => {
        if (matchingBoardRef.current) {
          matchingBoardRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 200)
    } else {
      // Submit - Trigger submit in MatchingBoard
      setTriggerSubmit(true)
    }
  }

  // Generate left/right sets - right uses small images when available
  useEffect(() => {
    if (status !== "playing") return
    const pool = [...slice]
    const take = Math.max(5, Math.min(8, Math.min(count, pool.length)))
    const chosen = shuffle(pool).slice(0, take)
    const L = chosen.map((x: any) => ({ id: x.id, label: x.char }))

    // Right items: try to use small-alphabets images if mapping exists, otherwise fallback to char label
    const R = shuffle(chosen).map((x: any) => {
      const fname = SMALL_ALPHABETS_MAP[x.id]
      if (fname) return { id: x.id, src: `/images/small-alphabets/${fname}`, label: x.char }
      return { id: x.id, label: x.char }
    })

    setLeft(L)
    setRight(R)
  }, [status, slice, count, seed])

  // Lives / premium check (same behavior as alphabet match)
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
        console.warn('play check failed, allowing anonymous play', err)
        setStatus("playing")
      }
    })()
  }, [])

  const handleUpgrade = async () => {
    const res = await fetch("/api/upgrade", { method: "POST" })
    const data = await res.json()
    if (res.ok) {
      alert("🎉 You are now Premium! Unlimited lives unlocked.")
      window.location.reload()
    } else {
      alert("❌ " + data.error)
    }
  }

  if (status === "checking") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingIndicator message="Loading game..." />
      </div>
    )
  }
  if (status === "out") {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>😢 You’ve used all 3 free lives</h2>
        <p>Upgrade to premium for unlimited plays!</p>
        <button onClick={handleUpgrade} className="btn" style={{ marginTop: 16 }}>
          Buy Premium
        </button>
      </div>
    )
  }
  if (status !== "playing") return <p className="center" style={{ marginTop: 24 }}>Error loading game</p>

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>Adhi Ashkal &nbsp;→&nbsp; Matching</h2>
        </div>

        {/* Responsive Toolbar */}
        <div className="responsive-game-toolbar">
          <div className="toolbar-controls">
            {/* Count Control */}
            <div className="control-group">
              <label className="control-label">
                <span className="label-text">Count:</span>
                <select 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))} 
                  className="responsive-select"
                >
                  {[5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* From Control */}
            <div className="control-group">
              <label className="control-label">
                <span className="label-text">From:</span>
                <select 
                  value={startId} 
                  onChange={(e) => setStartId(e.target.value)} 
                  className="responsive-select"
                >
                  {availableLetters.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.char}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* To Control */}
            <div className="control-group">
              <label className="control-label">
                <span className="label-text">To:</span>
                <select 
                  value={endId} 
                  onChange={(e) => setEndId(e.target.value)} 
                  className="responsive-select"
                >
                  {availableLetters.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.char}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Load Button */}
            <div className="control-group">
              <button className="responsive-btn load-btn" onClick={() => setSeed(Date.now())}>
                <span className="btn-text" lang="ur">🔀 حروف بدلیں</span>
              </button>
            </div>

            {/* Start/Submit Game Button */}
            <div className="control-group">
              <button className="responsive-btn game-btn" onClick={handleGameButton}>
                <span className="btn-text">{gameStarted ? "Submit" : "Start Game"}</span>
              </button>
            </div>
          </div>

          {/* Download Section */}
          <div className="toolbar-actions">
            <DownloadWorksheet
              left={left}
              right={right}
              title="Adhi Ashkal Matching / آدھی اشکال ملائیں"
              filename="worksheet_adhi_ashkal_match.pdf"
            />
          </div>

        </div>

        <p className="small center" style={{ marginTop: 8 }}>
          Range contains {slice.length} letters. We’ll use{" "}
          {Math.min(Math.max(count, 5), Math.min(8, slice.length))}.
        </p>

        <div ref={matchingBoardRef} className="matching-board-container">
          <MatchingBoard
            leftItems={left}
            rightItems={right}
            mode="images"
            imageBoxBackground="#000"
            gameStarted={gameStarted}
            triggerSubmit={triggerSubmit}
            onGameButtonClick={handleGameButton}
            onComplete={(s, t) => {
              setGameScore({ score: s, total: t })
              setGameStarted(false)
              setTriggerSubmit(false)
              localStorage.setItem(
                "adhi_ashkal_match_score",
                JSON.stringify({ s, t, ts: Date.now() })
              )
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
