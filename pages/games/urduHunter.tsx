import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import alphabets from "@/data/alphabets.json";

/* ─── Types ─────────────────────────────────────────────── */
interface Letter { id: string; char: string; name: string; }
interface Bubble {
  key: string;
  letter: Letter;
  char: string;
  x: number;
  duration: number;
  colorIdx: number;
  isTarget: boolean;
  state: "falling" | "caught" | "wrong";
}
interface Effect {
  key: string;
  x: number;
  type: "correct" | "wrong";
  points?: number;
}

/* ─── Constants ──────────────────────────────────────────── */
const LETTERS: Letter[] = (alphabets as any).letters as Letter[];
const COLORS = ["#FF6B9D","#60A5FA","#4ADE80","#FACC15","#FB923C","#A78BFA","#22D3EE","#F472B6"];
const MAX_LIVES = 5;
const BASE_LVL_SCORE = 150;

function pickTarget(excludeId?: string): Letter {
  const pool = excludeId ? LETTERS.filter(l => l.id !== excludeId) : LETTERS;
  return pool[Math.floor(Math.random() * pool.length)];
}
function fallDuration(lvl: number) { return Math.max(1.6, 5.5 - lvl * 0.5); }
function spawnMs(lvl: number) { return Math.max(600, 2000 - (lvl - 1) * 180); }

/* ─── Component ──────────────────────────────────────────── */
export default function UrduHunter() {
  type Phase = "idle" | "playing" | "paused" | "over";
  const [gamePhase, setGamePhase] = useState<Phase>("idle");
  const [score, setScore]       = useState(0);
  const [level, setLevel]       = useState(1);
  const [lives, setLives]       = useState(MAX_LIVES);
  const [target, setTarget]     = useState<Letter>(() => pickTarget());
  const [bubbles, setBubbles]   = useState<Bubble[]>([]);
  const [heartShake, setHeartShake] = useState(false);
  const [scoreFlash, setScoreFlash] = useState(false);
  const [effects, setEffects]   = useState<Effect[]>([]);
  const [arenaFlash, setArenaFlash] = useState<"none"|"correct"|"wrong">("none");

  const phaseRef    = useRef<Phase>("idle");
  const scoreRef    = useRef(0);
  const levelRef    = useRef(1);
  const livesRef    = useRef(MAX_LIVES);
  const targetRef   = useRef<Letter>(target);
  const counterRef  = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const effectRef   = useRef(0);

  const setPhase = (p: Phase) => { phaseRef.current = p; setGamePhase(p); };
  const setTargetSynced = (t: Letter) => { targetRef.current = t; setTarget(t); };

  /* ── Spawn effect ──────────────────────────────────────── */
  const spawnEffect = useCallback((x: number, type: "correct"|"wrong", points?: number) => {
    const key = `fx${effectRef.current++}`;
    setEffects(prev => [...prev, { key, x: Math.max(5, Math.min(85, x)), type, points }]);
    setTimeout(() => setEffects(prev => prev.filter(e => e.key !== key)), 900);
  }, []);

  /* ── Spawn a bubble ────────────────────────────────────── */
  const spawnBubble = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const lvl = levelRef.current;
    const tgt = targetRef.current;
    const isTarget = Math.random() < 0.32;
    const letter = isTarget
      ? tgt
      : (() => { const p = LETTERS.filter(l => l.id !== tgt.id); return p[Math.floor(Math.random() * p.length)]; })();

    setBubbles(prev => [...prev, {
      key: `b${Date.now()}-${counterRef.current++}`,
      letter, char: letter.char,
      x: 6 + Math.random() * 88,
      duration: fallDuration(lvl) + Math.random() * 0.6 - 0.3,
      colorIdx: Math.floor(Math.random() * COLORS.length),
      isTarget, state: "falling",
    }]);
  }, []);

  const restartInterval = useCallback((lvl: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(spawnBubble, spawnMs(lvl));
  }, [spawnBubble]);

  /* ── Lose life ─────────────────────────────────────────── */
  const loseLife = useCallback(() => {
    const next = Math.max(0, livesRef.current - 1);
    livesRef.current = next;
    setLives(next);
    setHeartShake(true);
    setArenaFlash("wrong");
    setTimeout(() => setHeartShake(false), 600);
    setTimeout(() => setArenaFlash("none"), 380);
    if (next <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhase("over");
    }
  }, []);

  /* ── Click handler ─────────────────────────────────────── */
  const handleClick = useCallback((bubble: Bubble) => {
    if (bubble.state !== "falling" || phaseRef.current !== "playing") return;

    if (bubble.isTarget) {
      const gain = 10 + levelRef.current * 5;
      scoreRef.current += gain;
      const ns = scoreRef.current;
      setScore(ns);
      setScoreFlash(true);
      setTimeout(() => setScoreFlash(false), 400);
      setBubbles(prev => prev.map(b => b.key === bubble.key ? { ...b, state: "caught" } : b));
      setTimeout(() => setBubbles(prev => prev.filter(b => b.key !== bubble.key)), 400);
      spawnEffect(bubble.x, "correct", gain);
      setArenaFlash("correct");
      setTimeout(() => setArenaFlash("none"), 280);

      if (ns >= levelRef.current * BASE_LVL_SCORE) {
        const nl = levelRef.current + 1;
        levelRef.current = nl; setLevel(nl);
        restartInterval(nl);
      }
      setTargetSynced(pickTarget(targetRef.current.id));
    } else {
      setBubbles(prev => prev.map(b => b.key === bubble.key ? { ...b, state: "wrong" } : b));
      setTimeout(() => setBubbles(prev => prev.filter(b => b.key !== bubble.key)), 500);
      spawnEffect(bubble.x, "wrong");
      loseLife();
    }
  }, [loseLife, restartInterval, spawnEffect]);

  /* ── Missed bubble ─────────────────────────────────────── */
  const handleAnimationEnd = useCallback((bubble: Bubble) => {
    if (bubble.state !== "falling") return;
    if (bubble.isTarget) {
      spawnEffect(bubble.x, "wrong");
      loseLife();
    }
    setBubbles(prev => prev.filter(b => b.key !== bubble.key));
  }, [loseLife, spawnEffect]);

  /* ── Start game ─────────────────────────────────────────── */
  const startGame = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    scoreRef.current = 0; levelRef.current = 1; livesRef.current = MAX_LIVES;
    setScore(0); setLevel(1); setLives(MAX_LIVES);
    setBubbles([]); setEffects([]);
    const t = pickTarget();
    setTargetSynced(t);
    setPhase("playing");
    restartInterval(1);
    setTimeout(spawnBubble, 300);
  }, [restartInterval, spawnBubble]);

  /* ── Pause / resume ─────────────────────────────────────── */
  const togglePause = useCallback(() => {
    if (phaseRef.current === "playing") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhase("paused");
    } else if (phaseRef.current === "paused") {
      setPhase("playing");
      restartInterval(levelRef.current);
    }
  }, [restartInterval]);

  const quitGame = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setBubbles([]);
    setPhase("idle");
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  /* ─── Render ──────────────────────────────────────────── */
  const HEART_ON = "#F43F5E", HEART_OFF = "rgba(255,255,255,0.22)";

  return (
    <>
      <Head>
        <title>Alphabet Hunter | Alif Ujala</title>
        <meta name="description" content="Pop the correct Urdu letter bubble! A fun arcade game to learn Urdu alphabets." />
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
          Alphabet Hunter
        </h1>

        {/* ──── IDLE ──── */}
        {gamePhase === "idle" && (
          <div style={{
            background:"rgba(255,255,255,0.07)", borderRadius:"24px", padding:"36px 28px",
            textAlign:"center", maxWidth:"480px", width:"100%", backdropFilter:"blur(14px)",
            border:"1.5px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{ fontSize:"4rem", marginBottom:"14px" }}>🎯</div>
            <h2 style={{ fontFamily:"'Comic Neue',cursive", color:"white", fontSize:"1.4rem", marginBottom:"14px" }}>How to Play</h2>
            <p style={{ color:"rgba(255,255,255,0.8)", fontFamily:"'Comic Neue',cursive", fontSize:"0.98rem", lineHeight:"1.68", marginBottom:"28px" }}>
              A target Urdu letter is shown at the top. Colourful bubbles with Urdu letters fall from the sky!
              <br /><br />
              <strong style={{ color:"#4ADE80" }}>Tap the correct bubble</strong> to score points.
              Tapping the wrong one or missing the target costs a <strong style={{ color:"#F43F5E" }}>life</strong>.
              You have {MAX_LIVES} lives. Speed goes up every level!
            </p>
            <button onClick={startGame} style={{
              background:"linear-gradient(135deg,#7C3AED,#EC4899)", color:"white",
              fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.2rem",
              border:"none", borderRadius:"50px", padding:"14px 48px", cursor:"pointer",
              boxShadow:"0 6px 24px rgba(124,58,237,0.5)",
            }}>
              Start Game!
            </button>
          </div>
        )}

        {/* ──── GAME OVER ──── */}
        {gamePhase === "over" && (
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
                background:"linear-gradient(135deg,#7C3AED,#EC4899)", color:"white",
                fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.1rem",
                border:"none", borderRadius:"50px", padding:"12px 36px", cursor:"pointer",
                boxShadow:"0 4px 18px rgba(124,58,237,0.4)",
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
        {(gamePhase === "playing" || gamePhase === "paused") && (
          <div style={{ width:"100%", maxWidth:"700px", display:"flex", flexDirection:"column", gap:"14px" }}>

            {/* HUD */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"10px",
              background:"rgba(255,255,255,0.08)", borderRadius:"16px", padding:"10px 18px",
              border:"1px solid rgba(255,255,255,0.15)",
            }}>
              {/* Hearts */}
              <div style={{ display:"flex", gap:"3px", animation: heartShake ? "shake-x 0.5s ease" : "none" }}>
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span key={i} style={{ fontSize:"clamp(1.1rem,4vw,1.5rem)", color: i < lives ? HEART_ON : HEART_OFF }}>♥</span>
                ))}
              </div>

              {/* Score */}
              <span style={{
                fontFamily:"'Bubblegum Sans',cursive", fontSize:"clamp(1.2rem,4vw,1.7rem)",
                color: scoreFlash ? "#FACC15" : "white",
                textShadow: scoreFlash ? "0 0 20px #FACC15" : "none",
                transition:"color 0.3s, text-shadow 0.3s",
              }}>
                {score} pts
              </span>

              {/* Level + Pause */}
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{
                  background:"rgba(255,255,255,0.18)", color:"white",
                  fontFamily:"'Comic Neue',cursive", fontWeight:700, fontSize:"0.85rem",
                  padding:"4px 14px", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.3)",
                }}>
                  Lvl {level}
                </span>
                <button onClick={togglePause} style={{
                  background: gamePhase === "paused" ? "rgba(250,204,21,0.28)" : "rgba(255,255,255,0.18)",
                  color:"white", border:"1.5px solid rgba(255,255,255,0.4)", borderRadius:"10px",
                  padding:"5px 16px", fontFamily:"'Comic Neue',cursive", fontWeight:700,
                  fontSize:"0.9rem", cursor:"pointer",
                }}>
                  {gamePhase === "paused" ? "▶ Resume" : "⏸ Pause"}
                </button>
              </div>
            </div>

            {/* Target card */}
            <div style={{
              background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.4)",
              borderRadius:"18px", padding:"10px 20px", width:"100%",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"18px",
              flexWrap:"wrap", backdropFilter:"blur(8px)",
            }}>
              <p style={{ color:"rgba(255,255,255,0.65)", fontFamily:"'Comic Neue',cursive", fontSize:"0.85rem", margin:0, flexBasis:"100%", textAlign:"center" }}>
                Find this letter:
              </p>
              <div style={{
                width:"clamp(68px,15vw,90px)", height:"clamp(68px,15vw,90px)",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"rgba(255,255,255,0.18)", borderRadius:"14px",
                overflow:"hidden", flexShrink:0, border:"2px solid rgba(255,255,255,0.3)", padding:"6px 4px",
              }}>
                <span style={{
                  fontFamily:"'Noto Nastaliq Urdu',serif", fontSize:"clamp(1.4rem,4.5vw,2.1rem)",
                  lineHeight:"1.3", color:"white", direction:"rtl", display:"block", textAlign:"center",
                }}>
                  {target.char}
                </span>
              </div>
              <div>
                <p style={{ color:"white", fontFamily:"'Comic Neue',cursive", fontWeight:700, fontSize:"clamp(0.95rem,3vw,1.2rem)", margin:0 }}>
                  {target.name}
                </p>
                <p style={{ color:"rgba(255,255,255,0.55)", fontFamily:"'Comic Neue',cursive", fontSize:"0.75rem", margin:0 }}>
                  Pop this bubble!
                </p>
              </div>
            </div>

            {/* Game arena */}
            <div style={{
              position:"relative", width:"100%", height:"clamp(360px,52vh,540px)",
              background: arenaFlash==="correct" ? "rgba(74,222,128,0.15)" : arenaFlash==="wrong" ? "rgba(239,68,68,0.15)" : "rgba(0,0,0,0.2)",
              borderRadius:"20px", overflow:"hidden",
              border: arenaFlash==="correct" ? "2px solid rgba(74,222,128,0.55)" : arenaFlash==="wrong" ? "2px solid rgba(239,68,68,0.55)" : "2px solid rgba(255,255,255,0.18)",
              transition:"background 0.15s, border-color 0.15s",
            }}>
              {/* Falling bubbles */}
              {bubbles.map(bubble => {
                const anim =
                  bubble.state === "caught" ? "bubble-pop 0.4s ease forwards" :
                  bubble.state === "wrong" ? "bubble-wrong 0.5s ease forwards" :
                  `bubble-fall ${bubble.duration}s linear forwards`;
                return (
                  <div
                    key={bubble.key}
                    onClick={() => handleClick(bubble)}
                    onAnimationEnd={() => handleAnimationEnd(bubble)}
                    style={{
                      position:"absolute", left:`${bubble.x}%`, top:"-100px",
                      width:"clamp(62px,13vw,82px)", height:"clamp(62px,13vw,82px)",
                      borderRadius:"50%",
                      background: bubble.state === "caught" ? "rgba(255,255,255,0.9)"
                        : `radial-gradient(circle at 35% 32%, rgba(255,255,255,0.55) 0%, ${COLORS[bubble.colorIdx]}dd 58%, ${COLORS[bubble.colorIdx]}99 100%)`,
                      border:`3px solid rgba(255,255,255,${bubble.state === "wrong" ? "0.9" : "0.45"})`,
                      boxShadow: bubble.isTarget
                        ? "0 0 18px 5px rgba(250,204,21,0.65), inset 0 0 10px rgba(255,255,255,0.3)"
                        : "0 4px 14px rgba(0,0,0,0.22), inset 0 0 8px rgba(255,255,255,0.22)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      cursor: bubble.state === "falling" ? "pointer" : "default",
                      userSelect:"none", touchAction:"manipulation",
                      animation: anim,
                      animationPlayState: gamePhase === "paused" ? "paused" : "running",
                    } as React.CSSProperties}
                  >
                    <span style={{
                      fontFamily:"'Noto Nastaliq Urdu',serif", fontSize:"clamp(1.3rem,3.5vw,1.8rem)",
                      lineHeight:1, color:"white", direction:"rtl",
                      textShadow:"0 1px 4px rgba(0,0,0,0.5)", pointerEvents:"none",
                      display:"block", textAlign:"center",
                    }}>
                      {bubble.char}
                    </span>
                  </div>
                );
              })}

              {/* Explosion effects */}
              {effects.map(effect => (
                <div key={effect.key} style={{ position:"absolute", left:`${effect.x}%`, top:"30%", zIndex:15, pointerEvents:"none", transform:"translateX(-50%)" }}>
                  <div style={{ position:"absolute", width:"72px", height:"72px", borderRadius:"50%", border:`3.5px solid ${effect.type==="correct"?"#4ADE80":"#F43F5E"}`, animation:"burst-ring 0.6s ease-out forwards", top:"-36px", left:"-36px" }}/>
                  <div style={{ fontFamily:"'Bubblegum Sans',cursive", fontSize:effect.type==="correct"?"1.5rem":"1.7rem", color:effect.type==="correct"?"#4ADE80":"#F43F5E", textShadow:`0 0 14px ${effect.type==="correct"?"rgba(74,222,128,0.9)":"rgba(244,63,94,0.9)"}`, animation:"score-float 0.9s ease-out forwards", whiteSpace:"nowrap", fontWeight:"bold", textAlign:"center" }}>
                    {effect.type==="correct" ? `+${effect.points}` : "✗"}
                  </div>
                </div>
              ))}

              {/* Pause overlay */}
              {gamePhase === "paused" && (
                <div style={{
                  position:"absolute", inset:0, background:"rgba(0,0,0,0.62)", backdropFilter:"blur(8px)",
                  display:"flex", alignItems:"center", justifyContent:"center", zIndex:10, borderRadius:"18px",
                }}>
                  <div style={{
                    background:"rgba(255,255,255,0.12)", border:"2px solid rgba(255,255,255,0.3)",
                    borderRadius:"22px", padding:"28px 36px", textAlign:"center", minWidth:"220px",
                  }}>
                    <p style={{ fontFamily:"'Bubblegum Sans',cursive", color:"white", fontSize:"2rem", margin:"0 0 10px" }}>⏸ Paused</p>
                    <p style={{ fontFamily:"'Comic Neue',cursive", color:"rgba(255,255,255,0.65)", fontSize:"0.95rem", margin:"0 0 20px" }}>
                      Score: {score} · Level: {level}
                    </p>
                    <button onClick={togglePause} style={{
                      display:"block", width:"100%", marginBottom:"10px",
                      background:"linear-gradient(135deg,#7C3AED,#EC4899)", color:"white",
                      fontFamily:"'Bubblegum Sans',cursive", fontSize:"1.1rem",
                      border:"none", borderRadius:"40px", padding:"11px 24px", cursor:"pointer",
                      boxShadow:"0 4px 16px rgba(124,58,237,0.4)",
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
              {bubbles.length === 0 && gamePhase === "playing" && (
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                  <p style={{ color:"rgba(255,255,255,0.25)", fontFamily:"'Comic Neue',cursive", fontSize:"0.95rem" }}>Bubbles incoming…</p>
                </div>
              )}
            </div>

            {/* Level progress */}
            <div style={{ width:"100%" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Comic Neue',cursive", fontSize:"0.72rem" }}>Level {level}</span>
                <span style={{ color:"rgba(255,255,255,0.45)", fontFamily:"'Comic Neue',cursive", fontSize:"0.72rem" }}>{score} / {level * BASE_LVL_SCORE}</span>
              </div>
              <div style={{ height:"6px", background:"rgba(255,255,255,0.1)", borderRadius:"3px", overflow:"hidden" }}>
                <div style={{
                  height:"100%", background:"linear-gradient(90deg,#7C3AED,#EC4899)",
                  borderRadius:"3px", width:`${Math.min(100, (score / (level * BASE_LVL_SCORE)) * 100)}%`,
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
