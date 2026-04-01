import React, { useEffect, useMemo, useRef, useState } from "react"
import Animation from "@/components/AnimationTeacher"
import Cong_Animation from "@/components/AnimationCongrats"

type Item = { id: string; label?: string; src?: string }

type Props = {
  leftItems: Item[]
  rightItems: Item[]
  mode?: "letters" | "images"
  gameStarted?: boolean
  triggerSubmit?: boolean
  onComplete?: (score: number, total: number) => void
  onGameButtonClick?: () => void
  imageBoxBackground?: string
}

export default function MatchingBoard({ leftItems, rightItems, mode = "letters", gameStarted = false, triggerSubmit = false, onComplete, onGameButtonClick, imageBoxBackground = "transparent" }: Props) {
  const [pairs, setPairs] = useState<Array<{ l: string; r: string; correct: boolean }>>([])
  const [score, setScore] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const [showFail, setShowFail] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  // Dynamic tile sizing based on number of items
  const getTileSize = () => {
    const itemCount = leftItems.length
    if (itemCount <= 4) return { width: '88px', height: '88px' }
    if (itemCount === 5) return { width: '80px', height: '80px' }
    if (itemCount === 6) return { width: '72px', height: '72px' }
    if (itemCount === 7) return { width: '68px', height: '68px' }
    if (itemCount >= 8) return { width: '64px', height: '64px' }
    return { width: '80px', height: '80px' }
  }

  const tileSize = getTileSize()

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
    
    e.preventDefault() // Prevent default touch behaviors
    e.stopPropagation()
    
    const el = e.currentTarget as Element
    const pos = getCenter(el)
    setDragging({ fromId: id, start: pos })
    
    // Capture pointer for consistent tracking across the entire screen
    if (el instanceof HTMLElement) {
      el.setPointerCapture(e.pointerId)
    }
    
    if (tmpRef.current) {
      tmpRef.current.setAttribute("d", `M ${pos.x} ${pos.y} L ${pos.x} ${pos.y}`)
      tmpRef.current.style.display = "block"
    }
  }

  const moveDrag = (e: React.PointerEvent) => {
    if (!gameStarted || !dragging || !wrapRef.current || !tmpRef.current) return
    
    e.preventDefault() // Prevent scrolling and other touch behaviors
    
    const wb = wrapRef.current.getBoundingClientRect()
    const x = e.clientX - wb.left
    const y = e.clientY - wb.top
    const a = dragging.start
    const midx = (a.x + x) / 2
    tmpRef.current.setAttribute("d", `M ${a.x} ${a.y} C ${midx} ${a.y} ${midx} ${y} ${x} ${y}`)
  }

  const dropOnRight = (e: React.PointerEvent, rightId: string) => {
    if (!gameStarted) return // ❌ prevent dropping before start
    if (!dragging || usedRight.has(rightId)) return cancelDrag()
    
    e.preventDefault()
    e.stopPropagation()
    
    const correct = rmap[dragging.fromId] === rightId
    setPairs((p) => [...p, { l: dragging.fromId, r: rightId, correct }])
    cancelDrag()
  }

  const cancelDrag = () => {
    setDragging(null)
    if (tmpRef.current) {
      tmpRef.current.style.display = "none"
      tmpRef.current.setAttribute("d", "")
    }
  }

  // Format timer display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
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

  // Global pointer event handlers for better touch support - only active when game is started
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!gameStarted || !dragging || !wrapRef.current || !tmpRef.current) return
      
      e.preventDefault()
      
      const wb = wrapRef.current.getBoundingClientRect()
      const x = e.clientX - wb.left
      const y = e.clientY - wb.top
      const a = dragging.start
      const midx = (a.x + x) / 2
      tmpRef.current.setAttribute("d", `M ${a.x} ${a.y} C ${midx} ${a.y} ${midx} ${y} ${x} ${y}`)
    }

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (!gameStarted || !dragging || !wrapRef.current) return
      
      e.preventDefault()
      
      // Check if we're dropping on a right item
      const wb = wrapRef.current.getBoundingClientRect()
      const x = e.clientX - wb.left
      const y = e.clientY - wb.top
      
      // Find the element at the drop position
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY)
      const rightTile = elementAtPoint?.closest('.right-col .node')
      
      if (rightTile) {
        const rightId = rightTile.getAttribute('data-id')
        if (rightId && !usedRight.has(rightId)) {
          const correct = rmap[dragging.fromId] === rightId
          setPairs((p) => [...p, { l: dragging.fromId, r: rightId, correct }])
        }
      }
      
      cancelDrag()
    }

    // Only add event listeners when game is active and dragging
    if (gameStarted && dragging) {
      document.addEventListener('pointermove', handleGlobalPointerMove, { passive: false })
      document.addEventListener('pointerup', handleGlobalPointerUp, { passive: false })
      
      return () => {
        document.removeEventListener('pointermove', handleGlobalPointerMove)
        document.removeEventListener('pointerup', handleGlobalPointerUp)
      }
    }
  }, [gameStarted, dragging, rmap, usedRight])

  // Cleanup on unmount to ensure no dangling event listeners
  useEffect(() => {
    return () => {
      // Cancel any ongoing drag on unmount
      cancelDrag()
    }
  }, [])

  // Handle game state changes
  useEffect(() => {
    if (gameStarted) {
      // Reset game when started
      setPairs([])
      setScore(0)
      setShowCongrats(false)
      setShowFail(false)
      setTimer(0)
      
      // Start timer
      const interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
      setTimerInterval(interval)
    } else {
      // Stop timer when game ends and cancel any ongoing drag
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
      // Cancel any ongoing drag operation when game ends
      cancelDrag()
    }

    // Cleanup timer on unmount
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [gameStarted])

  // Handle game submission when submit is triggered from parent
  useEffect(() => {
    if (triggerSubmit) {
      // Stop timer
      if (timerInterval) {
        clearInterval(timerInterval)
        setTimerInterval(null)
      }
      
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
    }
  }, [triggerSubmit, pairs, leftItems.length, onComplete, timerInterval])

  return (
    <div 
      className={`relative rounded-xl overflow-hidden p-4 sm:p-6 ${gameStarted ? 'touch-none game-active' : 'game-inactive'}`}
      ref={wrapRef}
      style={{ touchAction: gameStarted ? 'none' : 'auto' }}
    >
      {/* Score and Timer Display */}
      {gameStarted && (
        <div className="absolute top-4 right-4 z-10 score-timer-display">
          <div className="score-display">
            <div className="score-circle">
              <span className="score-text">SCORE: {score} / {leftItems.length}</span>
            </div>
          </div>
          <div className="timer-display">
            <span className="timer-text">TIME: {formatTime(timer)}</span>
          </div>
        </div>
      )}

      <svg className="absolute inset-0 w-full h-full pointer-events-none" ref={svgRef}>
        <g ref={permRef} />
        <path
          ref={tmpRef}
          d=""
          stroke="#0a84ff"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          style={{ display: "none" }}
        />
      </svg>

      <div className="flex items-start justify-center w-full overflow-x-auto">
        <div className="flex items-start justify-center gap-14 sm:gap-20 md:gap-28 lg:gap-72 flex-shrink-0 px-4 sm:px-6 md:px-8">
          {/* Left column */}
          <div className="left-col flex flex-col gap-3 flex-shrink-0">
            {leftItems.map((it) => (
              <div
                key={it.id}
                data-id={it.id}
                className={`tile ${usedLeft.has(it.id) ? "disabled" : ""} rounded-lg bg-blue-100 flex items-center justify-center select-none cursor-pointer border border-black/5 ${gameStarted ? 'touch-none' : ''}`}
                style={{ 
                  width: tileSize.width, 
                  height: tileSize.height,
                  touchAction: gameStarted ? 'none' : 'auto',
                  userSelect: gameStarted ? 'none' : 'auto',
                  WebkitUserSelect: gameStarted ? 'none' : 'auto'
                }}
                onPointerDown={gameStarted ? (e) => startDrag(e, it.id) : undefined}
                onContextMenu={gameStarted ? (e) => e.preventDefault() : undefined}
              >
                <span style={{fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl', fontSize: '1.8rem', lineHeight: '1.2'}}>{it.label}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="right-col flex flex-col gap-3 flex-shrink-0">
            {rightItems.map((it) => (
              <div
                key={it.id}
                data-id={it.id}
                className={`node tile ${usedRight.has(it.id) ? "disabled" : ""} rounded-lg bg-blue-100 flex items-center justify-center select-none cursor-pointer border border-black/5 ${gameStarted ? 'touch-none' : ''}`}
                style={{ 
                  width: tileSize.width, 
                  height: tileSize.height,
                  touchAction: gameStarted ? 'none' : 'auto',
                  userSelect: gameStarted ? 'none' : 'auto',
                  WebkitUserSelect: gameStarted ? 'none' : 'auto'
                }}
                onContextMenu={gameStarted ? (e) => e.preventDefault() : undefined}
              >
                {mode === "images" ? (
                  <div className="imgbox w-full h-full flex items-center justify-center" style={{ background: imageBoxBackground, padding: 4, borderRadius: 8 }}>
                    {it.src ? (
                      <img
                        src={it.src}
                        alt={it.label}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement
                          el.style.display = 'none'
                          const parent = el.parentElement
                          if (parent) {
                            const placeholder = document.createElement('div')
                            placeholder.textContent = '🖼️'
                            placeholder.style.fontSize = '20px'
                            placeholder.style.color = '#fff'
                            parent.appendChild(placeholder)
                          }
                        }}
                      />
                    ) : (
                      <div style={{ color: '#6b7280' }}>🖼️</div>
                    )}
                  </div>
                ) : (
                  <span style={{fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl', fontSize: '1.8rem', lineHeight: '1.2'}}>{it.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Teacher animation — separate column, hidden on small screens */}
        {!showCongrats && !showFail && (
          <div className="hidden md:flex flex-shrink-0 items-center self-center ml-6 lg:ml-10">
            <Animation style={{ width: 220, height: 220 }} loop={true} isPlaying={gameStarted && !triggerSubmit} />
          </div>
        )}
      </div>

      {/* Bottom Game Button */}
      <div className="bottom-game-button-container">
        <button 
          onClick={onGameButtonClick} 
          className="bottom-game-button"
          disabled={!onGameButtonClick}
        >
          <span className="btn-text">{gameStarted ? "Submit Game" : "Start Game"}</span>
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
          <div className="congrats-content">
            <p className="congrats-title">شاباش! You did it!</p>
            <div className="congrats-stats">
              <div className="stat-item">
                <span className="stat-label">Final Score:</span>
                <span className="stat-value">{score} / {leftItems.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completion Time:</span>
                <span className="stat-value">{formatTime(timer)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Accuracy:</span>
                <span className="stat-value">{leftItems.length > 0 ? Math.round((score / leftItems.length) * 100) : 0}%</span>
              </div>
            </div>
          </div>
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
          <div className="fail-content">
            <p className="fail-title">😢 Better luck next time!</p>
            <div className="fail-stats">
              <div className="stat-item">
                <span className="stat-label">Your Score:</span>
                <span className="stat-value">{score} / {leftItems.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Taken:</span>
                <span className="stat-value">{formatTime(timer)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Accuracy:</span>
                <span className="stat-value">{leftItems.length > 0 ? Math.round((score / leftItems.length) * 100) : 0}%</span>
              </div>
              <p className="retry-message">You need 75% or higher to pass. Keep practicing!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}