import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import alphabets from "@/data/alphabets.json";

/* ─── Types ─────────────────────────────────────────────── */
interface Letter { id: string; char: string; name: string; }
interface FallingLetter {
  key: string;
  letter: Letter;
  x: number;
  duration: number;
  isTarget: boolean;
  state: "falling" | "caught" | "missed" | "wrong";
}

/* ─── Constants ──────────────────────────────────────────── */
const LETTERS: Letter[] = (alphabets as any).letters as Letter[];
const COLORS = ["#FF6B9D","#60A5FA","#4ADE80","#FACC15","#FB923C","#A78BFA","#22D3EE","#F472B6"];
const MAX_LIVES = 5;
const BASE_LVL_SCORE = 160;
const BASKET_SPEED = 3.2;
const BASKET_HALF = 10;

function pickTarget(excludeId?: string): Letter {
  const pool = excludeId ? LETTERS.filter(l => l.id !== excludeId) : LETTERS;
  return pool[Math.floor(Math.random() * pool.length)];
}
function fallDuration(level: number) { return Math.max(1.4, 5.2 - level * 0.45); }
function spawnMs(level: number) { return Math.max(650, 2100 - (level - 1) * 160); }

/* ─── Component ──────────────────────────────────────────── */
export default function UrduBasketCatch() {
  const [phase, setPhase]       = useState<"idle"|"playing"|"paused"|"over">("idle");
  const [score, setScore]       = useState(0);
  const [level, setLevel]       = useState(1);
  const [lives, setLives]       = useState(MAX_LIVES);
  const [target, setTarget]     = useState<Letter>(() => pickTarget());
  const [letters, setLetters]   = useState<FallingLetter[]>([]);
  const [basketX, setBasketX]   = useState(50);
  const [heartShake, setHeartShake] = useState(false);
  const [scoreFlash, setScoreFlash] = useState(false);
  const [catchFx, setCatchFx]   = useState<{ x: number; visible: boolean; type: "correct"|"wrong" }>({ x: 50, visible: false, type: "correct" });

  const phaseRef    = useRef(phase);
  const scoreRef    = useRef(0);
  const levelRef    = useRef(1);
  const livesRef    = useRef(MAX_LIVES);
  const targetRef   = useRef<Letter>(target);
  const counterRef  = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef      = useRef<number | null>(null);
  const basketRef   = useRef(50);
  const keysRef     = useRef<Set<string>>(new Set());
  const spawnLetterRef = useRef<() => void>(() => {});

  const setPhaseSync = (p: typeof phase) => { phaseRef.current = p; setPhase(p); };
  const setTargetSync = (t: Letter) => { targetRef.current = t; setTarget(t); };

  /* ── Keyboard ──────────────────────────────────────────── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keysRef.current.add(e.key); e.preventDefault(); };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  /* ── rAF for basket movement ───────────────────────────── */
  const moveBasket = useCallback(() => {
    if (phaseRef.current !== "playing") { rafRef.current = requestAnimationFrame(moveBasket); return; }
    const keys = keysRef.current;
    let x = basketRef.current;
    if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) x -= BASKET_SPEED;
    if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) x += BASKET_SPEED;
    x = Math.max(6, Math.min(94, x));
    if (x !== basketRef.current) { basketRef.current = x; setBasketX(x); }
    rafRef.current = requestAnimationFrame(moveBasket);
  }, []);

  /* ── Lose life ─────────────────────────────────────────── */
  const loseLife = useCallback(() => {
    const next = Math.max(0, livesRef.current - 1);
    livesRef.current = next;
    setLives(next);
    setHeartShake(true);
    setTimeout(() => setHeartShake(false), 600);
    if (next <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setPhaseSync("over");
    }
  }, []);

  /* ── Spawn letter with setTimeout collision ────────────── */
  const spawnLetter = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const lvl = levelRef.current;
    const tgt = targetRef.current;
    const isTarget = Math.random() < 0.28;
    const letter = isTarget
      ? tgt
      : (() => { const p = LETTERS.filter(l => l.id !== tgt.id); return p[Math.floor(Math.random() * p.length)]; })();

    const item: FallingLetter = {
      key: `fl${Date.now()}-${counterRef.current++}`,
      letter, x: 8 + Math.random() * 84,
      duration: fallDuration(lvl) + (Math.random() * 0.5 - 0.25),
      isTarget, state: "falling",
    };
    setLetters(prev => [...prev, item]);

    // Collision check when letter reaches basket zone
    const checkMs = item.duration * 0.74 * 1000;
    setTimeout(() => {
      if (phaseRef.current !== "playing") return;
      const bx = basketRef.current;
      const diff = Math.abs(item.x - bx);
      if (diff <= BASKET_HALF) {
        if (item.isTarget) {
          const gain = 12 + levelRef.current * 5;
          scoreRef.current += gain;
          const ns = scoreRef.current;
          setScore(ns);
          setScoreFlash(true);
          setTimeout(() => setScoreFlash(false), 600);
          setLetters(prev => prev.map(l => l.key === item.key ? { ...l, state: "caught" } : l));
          setTimeout(() => setLetters(prev => prev.filter(l => l.key !== item.key)), 350);
          setCatchFx({ x: bx, visible: true, type: "correct" });
          setTimeout(() => setCatchFx(prev => ({ ...prev, visible: false })), 600);
          if (ns >= levelRef.current * BASE_LVL_SCORE) {
            const nl = levelRef.current + 1;
            levelRef.current = nl; setLevel(nl);
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => spawnLetterRef.current(), spawnMs(nl));
          }
          setTargetSync(pickTarget(targetRef.current.id));
        } else {
          setLetters(prev => prev.map(l => l.key === item.key ? { ...l, state: "wrong" } : l));
          setTimeout(() => setLetters(prev => prev.filter(l => l.key !== item.key)), 400);
          setCatchFx({ x: bx, visible: true, type: "wrong" });
          setTimeout(() => setCatchFx(prev => ({ ...prev, visible: false })), 600);
          loseLife();
        }
      }
    }, checkMs);
  }, [loseLife]);

  spawnLetterRef.current = spawnLetter;

  const restartInterval = useCallback((lvl: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => spawnLetterRef.current(), spawnMs(lvl));
  }, []);

  /* ── AnimationEnd (letter exits screen, not caught) ────── */
  const handleAnimEnd = useCallback((item: FallingLetter) => {
    if (item.state !== "falling") return;
    if (item.isTarget) loseLife();
    setLetters(prev => prev.filter(l => l.key !== item.key));
  }, [loseLife]);

  /* ── Touch / mouse ─────────────────────────────────────── */
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const area = e.currentTarget.getBoundingClientRect();
    const pct = ((e.touches[0].clientX - area.left) / area.width) * 100;
    basketRef.current = Math.max(6, Math.min(94, pct));
    setBasketX(basketRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    basketRef.current = Math.max(6, Math.min(94, pct));
    setBasketX(basketRef.current);
  }, []);

  /* ── Start / pause / quit ──────────────────────────────── */
  const startGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    scoreRef.current = 0; levelRef.current = 1; livesRef.current = MAX_LIVES;
    setScore(0); setLevel(1); setLives(MAX_LIVES);
    setLetters([]); basketRef.current = 50; setBasketX(50);
    const t = pickTarget();
    setTargetSync(t);
    setPhaseSync("playing");
    restartInterval(1);
    rafRef.current = requestAnimationFrame(moveBasket);
    setTimeout(spawnLetter, 400);
  }, [restartInterval, moveBasket, spawnLetter]);

  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhaseSync("paused");
    } else if (phaseRef.current === "paused") {
      setPhaseSync("playing");
      restartInterval(levelRef.current);
    }
  }, [restartInterval]);

  const quitGame = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setLetters([]);
    setPhaseSync("idle");
  };

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  /* ─── Render ──────────────────────────────────────────── */
  const HEART_ON = "#F43F5E", HEART_OFF = "rgba(255,255,255,0.22)";

  return (
    <>
      <Head>
        <title>Urdu Basket Catch | Alif Ujala</title>
        <meta name="description" content="Move your basket to catch the correct Urdu letter! A fun arcade game for kids." />
      </Head>
      <Navbar />

      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(135deg,#0f172a 0%,#1e1b4b 35%,#312e81 65%,#4c1d95 100%)",
        display:"flex", flexDirection:"column", alignItems:"center",
        paddingTop:"88px", paddingBottom:"40px", paddingLeft:"12px", paddingRight:"12px",
      }}>
        {/* Back */}
        <div style={{ alignSelf:"flex-start", width:"100%", maxWidth:"700px", margin:"0 auto 8px" }}>
          <Link href="/games" style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.85rem", fontFamily:"'Comic Neue',cursive", textDecoration:"none" }}>
            ← Back to Games
          </Link>
        </div>

        <h1 style={{
          fontFamily:"'Bubblegum Sans',cursive", fontSize:"clamp(1.5rem,5vw,2.4rem)",
          color:"white", textShadow:"0 2px 12px rgba(139,92,246,0.9)", marginBottom:"16px", textAlign:"center",
        }}>
          Urdu Basket Catch
        </h1>

        {/* ──── IDLE ──── */}
        {phase === "idle" && (
          <div style={{
            background:"rgba(255,255,255,0.07)", borderRadius:"24px", padding:"36px 28px",
            textAlign:"center", maxWidth:"480px", width:"100%", backdropFilter:"blur(14px)",
            border:"1.5px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{ fontSize:"4rem", marginBottom:"14px" }}>🧺</div>
            <h2 style={{ fontFamily:"'Comic Neue',cursive", color:"white", fontSize:"1.4rem", marginBottom:"14px" }}>How to Play</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontFamily:"'Comic Neue',cursive", fontSize:"0.98rem", lineHeight:"1.68", marginBottom:"28px" }}>
              A target Urdu letter is shown at the top. Letters fall from the sky!
              <br /><br />
              <strong style={{ color:"#FACC15" }}>Move the basket</strong> with <strong style={{ color:"#60A5FA" }}>← → keys</strong>, <strong style={{ color:"#60A5FA" }}>mouse</strong>, or <strong style={{ color:"#60A5FA" }}>drag on mobile</strong> to catch the correct letter.
              <br /><br />
              Catching wrong letters or missing target letters costs a <strong style={{ color:"#F43F5E" }}>life</strong>. You have {MAX_LIVES} lives!
            </p>
            <button onClick={startGame} style={{
              background:"linear-gradient(135deg,#A78BFA,#EC4899)", color:"white",
              fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.2rem",
              border:"none", borderRadius:"50px", padding:"14px 48px", cursor:"pointer",
              boxShadow:"0 6px 24px rgba(167,139,250,0.5)",
            }}>
              Start Game!
            </button>
          </div>
        )}

        {/* ──── GAME OVER ──── */}
        {phase === "over" && (
          <div style={{
            background:"rgba(255,255,255,0.07)", borderRadius:"24px", padding:"36px 28px",
            textAlign:"center", maxWidth:"480px", width:"100%", backdropFilter:"blur(14px)",
            border:"1.5px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{ fontSize:"3.5rem", marginBottom:"10px" }}>💥</div>
            <h2 style={{ fontFamily:"'Bubblegum Sans',cursive", color:"white", fontSize:"1.6rem", marginBottom:"6px" }}>Game Over!</h2>
            <p style={{ fontFamily:"'Comic Neue',cursive", color:"rgba(255,255,255,0.7)", fontSize:"1rem", marginBottom:"6px" }}>
              Final Score: <strong style={{ color:"#FACC15" }}>{score}</strong>
            </p>
            <p style={{ fontFamily:"'Comic Neue',cursive", color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", marginBottom:"24px" }}>
              Level reached: {level}
            </p>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={startGame} style={{
                background:"linear-gradient(135deg,#A78BFA,#EC4899)", color:"white",
                fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.1rem",
                border:"none", borderRadius:"50px", padding:"12px 36px", cursor:"pointer",
                boxShadow:"0 4px 18px rgba(167,139,250,0.4)",
              }}>
                Play Again
              </button>
              <Link href="/games" style={{
                background:"rgba(255,255,255,0.1)", color:"white",
                fontFamily:"'Comic Neue',cursive", fontWeight:700, fontSize:"0.95rem",
                border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:"50px",
                padding:"12px 28px", textDecoration:"none", display:"inline-block",
              }}>
                Back to Games
              </Link>
            </div>
          </div>
        )}

        {/* ──── PLAYING / PAUSED ──── */}
        {(phase === "playing" || phase === "paused") && (
          <div style={{ width:"100%", maxWidth:"700px", display:"flex", flexDirection:"column", gap:"14px" }}>

            {/* HUD */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px",
              background:"rgba(255,255,255,0.08)", borderRadius:"16px", padding:"10px 18px",
              border:"1px solid rgba(255,255,255,0.15)",
            }}>
              <div style={{ display:"flex", gap:"3px", animation: heartShake ? "shake-x 0.5s ease" : "none" }}>
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span key={i} style={{ fontSize:"clamp(1.1rem,4vw,1.5rem)", color: i < lives ? HEART_ON : HEART_OFF }}>♥</span>
                ))}
              </div>
              <span style={{
                fontFamily:"'Bubblegum Sans',cursive", fontSize:"clamp(1.2rem,4vw,1.7rem)",
                color: scoreFlash ? "#FACC15" : "white",
                textShadow: scoreFlash ? "0 0 20px #FACC15" : "none",
                transition:"color 0.3s, text-shadow 0.3s",
              }}>
                {score} pts
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{
                  background:"rgba(255,255,255,0.18)", color:"white",
                  fontFamily:"'Comic Neue',cursive", fontWeight:700, fontSize:"0.85rem",
                  padding:"4px 14px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.3)",
                }}>
                  Lvl {level}
                </span>
                <button onClick={togglePause} style={{
                  background: phase === "paused" ? "rgba(250,204,21,0.28)" : "rgba(255,255,255,0.18)",
                  color:"white", border:"1.5px solid rgba(255,255,255,0.4)", borderRadius:"10px",
                  padding:"5px 16px", fontFamily:"'Comic Neue',cursive", fontWeight:700,
                  fontSize:"0.9rem", cursor:"pointer",
                }}>
                  {phase === "paused" ? "▶ Resume" : "⏸ Pause"}
                </button>
              </div>
            </div>

            {/* Target card */}
            <div style={{
              background:"rgba(255,255,255,0.09)", border:"1.5px solid rgba(255,255,255,0.28)",
              borderRadius:"18px", padding:"10px 20px", width:"100%",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"18px", flexWrap:"wrap",
            }}>
              <p style={{ color:"rgba(255,255,255,0.55)", fontFamily:"'Comic Neue',cursive", fontSize:"0.85rem", margin:0, flexBasis:"100%", textAlign:"center" }}>
                Catch this letter:
              </p>
              <div style={{
                width:"clamp(68px,15vw,90px)", height:"clamp(68px,15vw,90px)",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"rgba(167,139,250,0.3)", borderRadius:"14px",
                overflow:"hidden", flexShrink:0, border:"2px solid rgba(167,139,250,0.6)", padding:"6px 4px",
              }}>
                <span style={{
                  fontFamily:"'Noto Nastaliq Urdu',serif", fontSize:"clamp(1.4rem,4.5vw,2.1rem)",
                  lineHeight:"1.3", color:"white", direction:"rtl", display:"block", textAlign:"center",
                }}>
                  {target.char}
                </span>
              </div>
              <div>
                <p style={{ color:"white", fontFamily:"'Comic Neue',cursive", fontWeight:700, fontSize:"clamp(0.9rem,3vw,1.15rem)", margin:0 }}>{target.name}</p>
                <p style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Comic Neue',cursive", fontSize:"0.75rem", margin:0 }}>Move basket to catch it!</p>
              </div>
            </div>

            {/* Game arena */}
            <div
              onTouchMove={handleTouchMove}
              onMouseMove={handleMouseMove}
              style={{
                position:"relative", width:"100%", height:"clamp(340px,50vh,520px)",
                background:"rgba(0,0,0,0.35)", borderRadius:"20px", overflow:"hidden",
                border:"1.5px solid rgba(255,255,255,0.15)", cursor:"crosshair",
                userSelect:"none", touchAction:"none",
              }}
            >
              {/* Star dots */}
              {[...Array(18)].map((_,i) => (
                <div key={i} style={{
                  position:"absolute", width: i%3===0?"3px":"2px", height: i%3===0?"3px":"2px",
                  background:"rgba(255,255,255,0.4)", borderRadius:"50%",
                  left:`${(i*37+5)%95}%`, top:`${(i*53+10)%85}%`,
                }}/>
              ))}

              {/* Falling letters */}
              {letters.map(item => {
                const color = COLORS[LETTERS.indexOf(item.letter) % COLORS.length];
                const anim =
                  item.state === "caught" ? "bubble-pop 0.35s ease forwards" :
                  item.state === "wrong" ? "bubble-wrong 0.45s ease forwards" :
                  `bubble-fall ${item.duration}s linear forwards`;
                return (
                  <div
                    key={item.key}
                    onAnimationEnd={() => handleAnimEnd(item)}
                    style={{
                      position:"absolute", left:`${item.x}%`, top:"-80px",
                      transform:"translateX(-50%)",
                      width:"clamp(58px,12vw,76px)", height:"clamp(58px,12vw,76px)",
                      borderRadius:"16px",
                      background:`linear-gradient(135deg,${color}cc,${color}66)`,
                      border:`2.5px solid rgba(255,255,255,${item.isTarget?0.9:0.35})`,
                      boxShadow: item.isTarget ? "0 0 16px 5px rgba(250,204,21,0.6)" : "0 4px 12px rgba(0,0,0,0.35)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      animation: anim,
                      animationPlayState: phase === "paused" ? "paused" : "running",
                    } as React.CSSProperties}
                  >
                    <span style={{
                      fontFamily:"'Noto Nastaliq Urdu',serif", fontSize:"clamp(1.3rem,3.5vw,1.75rem)",
                      lineHeight:1, color:"white", direction:"rtl",
                      textShadow:"0 1px 4px rgba(0,0,0,0.6)", pointerEvents:"none",
                      display:"block", textAlign:"center",
                    }}>
                      {item.letter.char}
                    </span>
                  </div>
                );
              })}

              {/* Basket */}
              <div style={{
                position:"absolute", bottom:"12px", left:`${basketX}%`,
                transform:"translateX(-50%)", width:"clamp(80px,18vw,110px)",
                display:"flex", flexDirection:"column", alignItems:"center",
                transition:"left 0s", pointerEvents:"none", zIndex:5,
              }}>
                <div style={{
                  width:"100%", height:"clamp(36px,8vw,50px)",
                  background:"linear-gradient(180deg,rgba(251,146,60,0.95),rgba(239,68,68,0.9))",
                  borderRadius:"0 0 40px 40px",
                  border:"3px solid rgba(255,255,255,0.6)", borderTop:"none",
                  position:"relative", overflow:"hidden",
                  boxShadow:"0 4px 20px rgba(239,68,68,0.4)",
                }}>
                  {[...Array(4)].map((_,i) => (
                    <div key={i} style={{ position:"absolute", left:`${15+i*20}%`, top:0, bottom:0, width:"2px", background:"rgba(255,255,255,0.25)" }}/>
                  ))}
                </div>
                <div style={{
                  width:"110%", height:"10px",
                  background:"linear-gradient(180deg,rgba(251,191,36,1),rgba(251,146,60,0.9))",
                  borderRadius:"6px", border:"2px solid rgba(255,255,255,0.7)",
                  marginTop:"-3px", boxShadow:"0 2px 8px rgba(251,146,60,0.5)",
                }}/>
              </div>

              {/* Catch FX */}
              {catchFx.visible && (
                <div style={{ position:"absolute", left:`${catchFx.x}%`, bottom:"55px", transform:"translateX(-50%)", zIndex:8, pointerEvents:"none" }}>
                  <div style={{ position:"absolute", width:"80px", height:"80px", borderRadius:"50%", border:`3px solid ${catchFx.type==="correct"?"#4ADE80":"#F43F5E"}`, animation:"burst-ring 0.5s ease-out forwards", top:"-40px", left:"-40px" }}/>
                  <div style={{ fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.6rem", color:catchFx.type==="correct"?"#4ADE80":"#F43F5E", textShadow:`0 0 12px ${catchFx.type==="correct"?"rgba(74,222,128,0.9)":"rgba(244,63,94,0.9)"}`, animation:"score-float 0.7s ease-out forwards", whiteSpace:"nowrap", fontWeight:"bold", textAlign:"center" }}>
                    {catchFx.type==="correct" ? "★ Got it!" : "✗ Wrong!"}
                  </div>
                </div>
              )}

              {/* Ground */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"4px", background:"linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent)" }}/>

              {/* Pause overlay */}
              {phase === "paused" && (
                <div style={{
                  position:"absolute", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)",
                  display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, borderRadius:"18px",
                }}>
                  <div style={{
                    background:"rgba(255,255,255,0.1)", border:"2px solid rgba(255,255,255,0.25)",
                    borderRadius:"22px", padding:"28px 36px", textAlign:"center", minWidth:"220px",
                  }}>
                    <p style={{ fontFamily:"'Bubblegum Sans',cursive", color:"white", fontSize:"2rem", margin:"0 0 10px" }}>⏸ Paused</p>
                    <p style={{ fontFamily:"'Comic Neue',cursive", color:"rgba(255,255,255,0.65)", fontSize:"0.95rem", margin:"0 0 20px" }}>
                      Score: {score} · Level: {level}
                    </p>
                    <button onClick={togglePause} style={{
                      display:"block", width:"100%", marginBottom:"10px",
                      background:"linear-gradient(135deg,#A78BFA,#EC4899)", color:"white",
                      fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.1rem",
                      border:"none", borderRadius:"40px", padding:"11px 24px", cursor:"pointer",
                    }}>
                      ▶ Resume
                    </button>
                    <button onClick={quitGame} style={{
                      display:"block", width:"100%", background:"rgba(255,255,255,0.1)",
                      color:"rgba(255,255,255,0.7)", fontFamily:"'Comic Neue',cursive", fontWeight:700,
                      fontSize:"0.9rem", border:"1px solid rgba(255,255,255,0.25)",
                      borderRadius:"40px", padding:"8px 24px", cursor:"pointer",
                    }}>
                      Quit
                    </button>
                  </div>
                </div>
              )}

              {/* Hint */}
              {letters.length === 0 && phase === "playing" && (
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                  <p style={{ color:"rgba(255,255,255,0.25)", fontFamily:"'Comic Neue',cursive", fontSize:"0.95rem" }}>Letters incoming…</p>
                </div>
              )}
            </div>

            {/* Mobile controls */}
            <div style={{ display:"flex", gap:"12px", width:"100%" }} className="md:hidden">
              {["←", "→"].map((dir, i) => (
                <button
                  key={dir}
                  onPointerDown={() => {
                    const step = i === 0 ? -2.5 : 2.5;
                    const move = () => { basketRef.current = Math.max(6, Math.min(94, basketRef.current + step)); setBasketX(basketRef.current); };
                    move();
                    const id = setInterval(move, 50);
                    const stop = () => clearInterval(id);
                    window.addEventListener("pointerup", stop, { once: true });
                  }}
                  style={{
                    flex:1, padding:"18px 0",
                    fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.8rem",
                    background:"rgba(255,255,255,0.12)", color:"white",
                    border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:"14px",
                    cursor:"pointer", touchAction:"manipulation",
                  }}
                >
                  {dir}
                </button>
              ))}
            </div>

            {/* Level progress */}
            <div style={{ width:"100%" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Comic Neue',cursive", fontSize:"0.72rem" }}>Level {level}</span>
                <span style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Comic Neue',cursive", fontSize:"0.72rem" }}>{score} / {level * BASE_LVL_SCORE}</span>
              </div>
              <div style={{ height:"6px", background:"rgba(255,255,255,0.1)", borderRadius:"3px", overflow:"hidden" }}>
                <div style={{
                  height:"100%", background:"linear-gradient(90deg,#A78BFA,#EC4899)",
                  borderRadius:"3px", width:`${Math.min(100,(score/(level*BASE_LVL_SCORE))*100)}%`,
                  transition:"width 0.4s ease",
                }}/>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
