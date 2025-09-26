import React, { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MatchingBoard from "@/components/MatchingBoard"
import imagesData from "@/data/images.json"
import DownloadWorksheet from "@/components/DownloadWorksheet"

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function MatchingPage() {
  const [status, setStatus] = useState<"checking" | "playing" | "out" | "error">("checking")
  const [count, setCount] = useState(6)
  const [seed, setSeed] = useState(Date.now())

  const allImages = (imagesData as any).images || []

  const [left, setLeft] = useState<Array<{ id: string; src: string }>>([])
  const [right, setRight] = useState<Array<{ id: string; src: string }>>([])

  useEffect(() => {
    if (status !== "playing") return
    const pool = [...allImages]
    const take = Math.max(5, Math.min(8, Math.min(count, pool.length)))
    const chosen = shuffle(pool).slice(0, take)
    const L = chosen.map((x: any) => ({ id: x.id, src: x.src }))
    const R = shuffle(chosen).map((x: any) => ({ id: x.id, src: x.src }))
    setLeft(L)
    setRight(R)
  }, [status, allImages, count, seed])

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

  if (status === "checking") return <p className="center" style={{ marginTop: 24 }}>Loading...</p>
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

        <div className="game-toolbar" style={{ gap: "1rem" }}>
          <label>
            Count:&nbsp;
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button className="btn" onClick={() => setSeed(Date.now())}>
            Load Images
          </button>

          {/* ✅ Worksheet Download */}
          <DownloadWorksheet
            left={left}
            right={right}
            title="Match each image to its pair"
            filename="worksheet_image_match.pdf"
          />


        </div>

        <MatchingBoard leftItems={left} rightItems={right} mode="images" onComplete={() => {}} />
      </div>
      <Footer />
    </>
  )
}
