import React, { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MatchingBoard from "@/components/MatchingBoard"
import lettersData from "@/data/alphabets.json"
import DownloadWorksheet from "@/components/DownloadWorksheet"
import LoadingIndicator from "@/components/LoadingIndicator"

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function AlphabetMatchPage() {
  const [status, setStatus] = useState<"checking" | "playing" | "out" | "error">("checking")
  const [count, setCount] = useState(5)
  const [startId, setStartId] = useState("alif")
  const [endId, setEndId] = useState("bari-yaa")
  const [seed, setSeed] = useState(Date.now())

  const allLetters = (lettersData as any).letters || []

  // Slice from chosen start to end
  const slice = useMemo(() => {
    const si = allLetters.findIndex((l: any) => l.id === startId)
    const ei = allLetters.findIndex((l: any) => l.id === endId)
    if (si === -1 || ei === -1) return allLetters
    const [a, b] = si <= ei ? [si, ei] : [ei, si]
    return allLetters.slice(a, b + 1)
  }, [allLetters, startId, endId])

  const [left, setLeft] = useState<Array<{ id: string; label: string }>>([])
  const [right, setRight] = useState<Array<{ id: string; label: string }>>([])

  // Generate left/right sets
  useEffect(() => {
    if (status !== "playing") return
    const pool = [...slice]
    const take = Math.max(5, Math.min(8, Math.min(count, pool.length)))
    const chosen = shuffle(pool).slice(0, take)
    const L = chosen.map((x: any) => ({ id: x.id, label: x.char }))
    const R = shuffle(chosen).map((x: any) => ({ id: x.id, label: x.char }))
    setLeft(L)
    setRight(R)
  }, [status, slice, count, seed])

  // Lives / premium check
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/play", { method: "POST" })
        const data = await res.json()
        // New rules: playing is allowed for everyone. If the API returns ok, start.
        if (res.ok && data.ok) {
          setStatus("playing")
          return
        }

        // If API explicitly says out of lives (403 / error) then show upgrade
        if (res.status === 403 || data?.error === "out of lives") {
          setStatus("out")
          return
        }

        // For any other response, fall back to allowing play (anonymous fallback)
        setStatus("playing")
      } catch (err) {
        // Network or other error — allow play to continue offline/anonymous
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
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>Alphabet &nbsp;→&nbsp; Alphabet Match</h2>
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
                  {allLetters.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.char} ({l.name})
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
                  {allLetters.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.char} ({l.name})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Load Button */}
            <div className="control-group">
              <button className="responsive-btn load-btn" onClick={() => setSeed(Date.now())}>
                <span className="btn-text">Load Letters</span>
              </button>
            </div>
          </div>

          {/* Download Section */}
          <div className="toolbar-actions">
            <DownloadWorksheet
              left={left}
              right={right}
              title="Alphabet Matching / حرف ملائیں"
              filename="worksheet_alphabet_match.pdf"
            />
          </div>

        </div>

        <p className="small center" style={{ marginTop: 8 }}>
          Range contains {slice.length} letters. We’ll use{" "}
          {Math.min(Math.max(count, 5), Math.min(8, slice.length))}.
        </p>

        <MatchingBoard
          leftItems={left}
          rightItems={right}
          mode="letters"
          onComplete={(s, t) => {
            localStorage.setItem(
              "alphabet_match_score",
              JSON.stringify({ s, t, ts: Date.now() })
            )
          }}
        />
      </div>
      <Footer />
    </>
  )
}
