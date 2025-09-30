import React, { useEffect, useMemo, useRef, useState } from "react"
import Animation from "@/components/AnimationTeacher"
import Cong_Animation from "@/components/AnimationCongrats"

type Item = { id: string; label?: string; src?: string }

type Props = {
  leftItems: Item[]
  rightItems: Item[]
  mode?: "letters" | "images"
  onComplete?: (score: number, total: number) => void
}

export default function MatchingBoard({ leftItems, rightItems, mode = "letters", onComplete }: Props) {
  const [pairs, setPairs] = useState<Array<{ l: string; r: string; correct: boolean }>>([])
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showFail, setShowFail] = useState(false)

  const [dragging, setDragging] = useState<{ fromId: string; start: { x: number; y: number } } | null>(null)

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const permRef = useRef<SVGGElement | null>(null)
  const tmpRef = useRef<SVGPathElement | null>(null)

  const rmap = useMemo(() => {
    const ids = new Set(leftItems.map((i) => i.id))
    return rightItems
      .filter((r) => ids.has(r.id))
      .reduce<Record<string, string>>((a, b) => ((a[b.id] = b.id), a), {})
  }, [leftItems, rightItems])

  const usedLeft = useMemo(() => new Set(pairs.map((p) => p.l)), [pairs])
  const usedRight = useMemo(() => new Set(pairs.map((p) => p.r)), [pairs])

  const getCenter = (el: Element) => {
    if (!wrapRef.current) return { x: 0, y: 0 }
    const wb = wrapRef.current.getBoundingClientRect()
    const b = (el as HTMLElement).getBoundingClientRect()
    return { x: b.left - wb.left + b.width / 2, y: b.top - wb.top + b.height / 2 }
  }

  const startDrag = (e: React.PointerEvent, id: string) => {
    if (!gameStarted) return // ❌ prevent tracing before game starts
    if (usedLeft.has(id)) return
    const el = e.currentTarget as HTMLElement
    const pos = getCenter(el)
    // capture pointer so move events continue even if finger goes outside the element
    try {
      el.setPointerCapture?.(e.pointerId)
    } catch (err) {
      // ignore if not supported
    }
    setDragging({ fromId: id, start: pos })
    if (tmpRef.current) {
      tmpRef.current.setAttribute("d", `M ${pos.x} ${pos.y} L ${pos.x} ${pos.y}`)
      tmpRef.current.style.display = "block"
    }
  }

  const moveDrag = (e: React.PointerEvent) => {
    if (!dragging || !wrapRef.current || !tmpRef.current) return
    const wb = wrapRef.current.getBoundingClientRect()
    const x = e.clientX - wb.left
    const y = e.clientY - wb.top
    const a = dragging.start
    const midx = (a.x + x) / 2
    tmpRef.current.setAttribute("d", `M ${a.x} ${a.y} C ${midx} ${a.y} ${midx} ${y} ${x} ${y}`)
  }

  const dropOnRight = (e: React.PointerEvent, rightId: string) => {
    if (!gameStarted) return // ❌ prevent dropping before start
    if (!dragging || usedRight.has(rightId)) return cancelDrag(e)
    const correct = rmap[dragging.fromId] === rightId
    setPairs((p) => [...p, { l: dragging.fromId, r: rightId, correct }])
    // try to release pointer capture on the source element
    try {
      const src = wrapRef.current?.querySelector(`.left-col .tile[data-id=\"${dragging.fromId}\"]`) as HTMLElement | null
      if (src) src.releasePointerCapture?.(e.pointerId)
    } catch (err) {}
    cancelDrag(e)
  }

  const cancelDrag = (e?: React.PointerEvent) => {
    // try to release pointer capture from source tile if possible
    if (dragging) {
      try {
        const src = wrapRef.current?.querySelector(`.left-col .tile[data-id=\"${dragging.fromId}\"]`) as HTMLElement | null
        if (src && e?.pointerId !== undefined) src.releasePointerCapture?.(e.pointerId)
      } catch (err) {}
    }
    setDragging(null)
    if (tmpRef.current) {
      tmpRef.current.style.display = "none"
      tmpRef.current.setAttribute("d", "")
    }
  }

  useEffect(() => {
    const g = permRef.current
    const wrap = wrapRef.current
    if (!g || !wrap) return

    const leftNodes = (id: string) => wrap.querySelector(`.left-col  .tile[data-id="${id}"]`)
    const rightNodes = (id: string) => wrap.querySelector(`.right-col .node[data-id="${id}"]`)

    const svgs = pairs
      .map((p) => {
        const lEl = leftNodes(p.l)
        const rEl = rightNodes(p.r)
        if (!lEl || !rEl) return ""
        const a = getCenter(lEl)
        const b = getCenter(rEl)
        const midx = (a.x + b.x) / 2
        const color = p.correct ? "rgba(0,180,0,.95)" : "rgba(240,0,0,.95)"
        return `<path d="M ${a.x} ${a.y} C ${midx} ${a.y} ${midx} ${b.y} ${b.x} ${b.y}" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      })
      .join("")

    g.innerHTML = svgs
  }, [pairs])

  const handleButtonClick = () => {
    if (!gameStarted) {
      // Start Game
      setPairs([])
      setScore(0)
      setGameStarted(true)
      setShowCongrats(false)
      setShowFail(false)
    } else {
      // Submit
      const total = leftItems.length
      const correctCount = pairs.filter((p) => p.correct).length
      setScore(correctCount)
      if (onComplete) onComplete(correctCount, total)

      const percentage = (correctCount / total) * 100
      if (percentage >= 75) {
        setShowCongrats(true)
      } else {
        setShowFail(true)
      }
      setGameStarted(false) // reset button to "Start Game"
    }
  }

  return (
    <div
      className="game-surface"
      ref={wrapRef}
      onPointerMove={moveDrag}
      onPointerUp={(e) => cancelDrag(e)}
      style={{ position: "relative", touchAction: "none" }}
    >
      <svg
        className="lines"
        ref={svgRef}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <g ref={permRef} />
        <path
          ref={tmpRef}
          d=""
          stroke="#0a84ff"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          style={{ display: "none" }}
        />
      </svg>

      <div
        className="col-wrap"
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        {/* Left column */}
        <div
          className="left-col"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            minWidth: "fit-content",
          }}
        >
          {leftItems.map((it) => (
            <div
              key={it.id}
              data-id={it.id}
              className={`tile ${usedLeft.has(it.id) ? "disabled" : ""}`}
              onPointerDown={(e) => startDrag(e, it.id)}
              style={{
                width: "clamp(56px, 18vw, 96px)",
                height: "clamp(56px, 18vw, 96px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(1rem, 4vw, 2.2rem)",
                touchAction: "none",
                userSelect: "none",
                opacity: usedLeft.has(it.id) ? 0.5 : 1,
                pointerEvents: usedLeft.has(it.id) ? "none" : "auto",
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>{it.label}</span>
            </div>
          ))}
        </div>

        {/* Right column + teacher animation */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <div
            className="right-col"
            style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}
          >
            {rightItems.map((it) => (
              <div
                key={it.id}
                data-id={it.id}
                className={`node tile ${usedRight.has(it.id) ? "disabled" : ""}`}
                onPointerUp={(e) => dropOnRight(e, it.id)}
                style={{
                  width: "clamp(56px, 18vw, 96px)",
                  height: "clamp(56px, 18vw, 96px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(1rem, 4vw, 2.2rem)",
                  touchAction: "none",
                  userSelect: "none",
                  opacity: usedRight.has(it.id) ? 0.5 : 1,
                  pointerEvents: usedRight.has(it.id) ? "none" : "auto",
                }}
              >
                {mode === "images" ? (
                  <div className="imgbox">
                    <img
                      src={it.src}
                      alt={it.label}
                      style={{ width: "clamp(48px, 30vw, 140px)", height: "clamp(48px, 30vw, 140px)", objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: "clamp(1rem, 4vw, 2.2rem)" }}>{it.label}</span>
                )}
              </div>
            ))}
          </div>

          {!showCongrats && !showFail && (
            <Animation style={{ width: "min(40vw, 320px)", height: "min(40vw, 320px)", marginTop: "1rem" }} loop={true} />
          )}
        </div>
      </div>

      {/* Scoreboard */}
      <div className="center" style={{ marginTop: "1rem" }}>
        <span className="score">
          Score: {score} / {leftItems.length}
        </span>
      </div>

      {/* Start / Submit button */}
      <div className="center" style={{ marginTop: "1rem" }}>
        <button
          className="btn btn-large"
          onClick={handleButtonClick}
          style={{ fontSize: "1.5rem", padding: "1rem 2rem" }}
        >
          {gameStarted ? "Submit" : "Start Game"}
        </button>
      </div>


      {/*  Fullscreen Congrats */}
      {showCongrats && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
          }}
        >
          <button
            onClick={() => setShowCongrats(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
          <Cong_Animation style={{ width: 400, height: 400 }} loop={false} />
          <p style={{ color: "white", marginTop: "1rem", fontSize: "1.5rem" }}>شاباش! You did it!</p>
        </div>
      )}

      {/* ❌ Fail Popup */}
      {showFail && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            flexDirection: "column",
            color: "white",
          }}
        >
          <button
            onClick={() => setShowFail(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
          <p style={{ fontSize: "2rem" }}>😢 Better luck next time!</p>
        </div>
      )}
    </div>
  )
}
