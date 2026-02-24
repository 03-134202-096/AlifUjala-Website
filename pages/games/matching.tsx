import React, { useEffect, useState, useRef } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MatchingBoard from "@/components/MatchingBoard"
import imagesData from "@/data/images.json"
import alphabetsData from "@/data/alphabets.json"
import DownloadWorksheet from "@/components/DownloadWorksheet"
import LoadingIndicator from "@/components/LoadingIndicator"

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function MatchingPage() {
  const [status, setStatus] = useState<"checking" | "playing" | "out" | "error">("checking")
  const [count, setCount] = useState(6)
  const [seed, setSeed] = useState(Date.now())
  const [filterRange, setFilterRange] = useState<string>('all')
  const [gameStarted, setGameStarted] = useState(false)
  const [triggerSubmit, setTriggerSubmit] = useState(false)
  const matchingBoardRef = useRef<HTMLDivElement>(null)

  const allImages = (imagesData as any).images || []

  const letters = (alphabetsData as any).letters || []

  const [left, setLeft] = useState<Array<{ id: string; label?: string; char?: string }>>([])
  const [right, setRight] = useState<Array<{ id: string; src?: string; label?: string }>>([])

  // Ref to prevent duplicated/rapid fetch loops
  const lastFetchKeyRef = React.useRef<string | null>(null)
  const isMountedRef = React.useRef(true)
  const isFetchingRef = React.useRef(false)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Game button handler
  const handleGameButton = () => {
    if (!gameStarted) {
      // Start Game
      setGameStarted(true)
      
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
      // Submit
      setTriggerSubmit(true)
    }
  }

  useEffect(() => {
    if (status !== "playing") return

    const controller = new AbortController()
    const signal = controller.signal

    const fetchKey = `${status}:${count}:${seed}:${filterRange}`
    if (lastFetchKeyRef.current === fetchKey) {
      // We've already fetched for this combination, skip
      return
    }
    if (isFetchingRef.current) {
      // already fetching, skip
      return
    }
    lastFetchKeyRef.current = fetchKey
    isFetchingRef.current = true
    setIsFetching(true)

    // Fetch images for random letters from server-side folders
    ;(async () => {
      try {
        // If a filter range is set, compute ids to request (comma-separated)
        let idsParam = ''
        if (filterRange !== 'all') {
          if (filterRange === 'first10') idsParam = letters.slice(0, 10).map((l: any) => l.id).join(',')
          else if (filterRange === 'next10') idsParam = letters.slice(10, 20).map((l: any) => l.id).join(',')
          else if (filterRange === 'last') idsParam = letters.slice(20).map((l: any) => l.id).join(',')
        }

        const q = new URLSearchParams({ count: String(count), seed: String(seed) })
        if (idsParam) q.set('ids', idsParam)
        const res = await fetch(`/api/letter-images?${q.toString()}`, { signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        if (!data?.ok) throw new Error('no-data')

        const images = data.images as Array<{ id: string; src: string }>

        // Build left (letters) from alphabets.json using folder ids
        const chosenLetters = images
          .map((img) => {
            const letter = letters.find((l: any) => l.id === img.id || l.id === img.id.replace(/\s+/g, '-'))
            return { id: img.id, label: letter?.name || img.id, char: letter?.char }
          })

        const L = chosenLetters.map((c: any) => ({ id: c.id, label: c.char || c.label, char: c.char }))
        const R = shuffle(images).map((x) => ({ id: x.id, src: x.src }))

        if (!isMountedRef.current) return
        setLeft(L)
        setRight(R)
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return
        console.warn('letter-images fetch failed, falling back', err)
        const pool = [...allImages]
        const take = Math.max(5, Math.min(8, Math.min(count, pool.length)))
        const chosen = shuffle(pool).slice(0, take)
        const L = chosen.map((x: any) => ({ id: x.id, label: x.label }))
        const R = shuffle(chosen).map((x: any) => ({ id: x.id, src: x.src }))
        if (!isMountedRef.current) return
        setLeft(L)
        setRight(R)
      }
    })()
      .finally(() => {
        isFetchingRef.current = false
        if (isMountedRef.current) setIsFetching(false)
      })

    return () => {
      controller.abort()
    }
  }, [status, count, seed, filterRange])

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
        <button className="btn" style={{ marginTop: 16 }}>
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
        <h2 className="center" style={{ margin: "1rem 0" }}>Match Images</h2>

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

            {/* Load Button */}
            <div className="control-group">
              <button className="responsive-btn load-btn" onClick={() => setSeed(Date.now())} disabled={isFetching}>
                <span className="btn-text">{isFetching ? 'Loading...' : '🔀 حروف بدلیں'}</span>
              </button>
            </div>

            {/* Alphabet Filter */}
            <div className="control-group">
              <label className="control-label">
                <span className="label-text">Filter:</span>
                <select value={filterRange} onChange={(e) => setFilterRange(e.target.value)} className="responsive-select">
                  <option value="all">All</option>
                  <option value="first10">First 10</option>
                  <option value="next10">Next 10</option>
                  <option value="last">Last</option>
                </select>
              </label>
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
              title="Match each image to its pair"
              filename="worksheet_image_match.pdf"
            />
          </div>
        </div>

        <div ref={matchingBoardRef} className="matching-board-container">
          <MatchingBoard 
            leftItems={left} 
            rightItems={right} 
            mode="images" 
            gameStarted={gameStarted}
            triggerSubmit={triggerSubmit}
            onGameButtonClick={handleGameButton}
            onComplete={(s, t) => {
              setGameStarted(false)
              setTriggerSubmit(false)
            }} 
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
