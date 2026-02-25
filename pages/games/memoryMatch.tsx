import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import alphabets from "@/data/alphabets.json";

/* ─── Types ─────────────────────────────────────────────── */
interface Letter { id: string; char: string; name: string; }
interface Card {
  id: number;
  letter: Letter;
  flipped: boolean;
  matched: boolean;
}

type Difficulty = "easy" | "medium" | "hard";
const DIFF_CONFIG: Record<Difficulty, { pairs: number; cols: number; label: string; emoji: string }> = {
  easy:   { pairs: 6,  cols: 4, label: "Easy (12 cards)", emoji: "😊" },
  medium: { pairs: 8,  cols: 4, label: "Medium (16 cards)", emoji: "🤔" },
  hard:   { pairs: 10, cols: 5, label: "Hard (20 cards)", emoji: "🔥" },
};

const LETTERS: Letter[] = (alphabets as any).letters as Letter[];
const CARD_COLORS = [
  "#7C3AED","#EC4899","#0EA5E9","#10B981","#F59E0B","#EF4444",
  "#8B5CF6","#06B6D4","#F472B6","#34D399","#FBBF24","#FB923C",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─── Component ──────────────────────────────────────────── */
export default function MemoryMatch() {
  const [phase, setPhase] = useState<"menu"|"playing"|"won">("menu");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timer, setTimer] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({ easy: null, medium: null, hard: null });
  const [shakeIds, setShakeIds] = useState<number[]>([]);
  const [sparkleIds, setSparkleIds] = useState<number[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);
  const totalPairsRef = useRef(0);

  /* ── Build board ───────────────────────────────────────── */
  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    const config = DIFF_CONFIG[diff];
    totalPairsRef.current = config.pairs;

    const selected = shuffle(LETTERS).slice(0, config.pairs);
    const doubled = [...selected, ...selected];
    const shuffled = shuffle(doubled);

    setCards(shuffled.map((letter, i) => ({
      id: i, letter, flipped: false, matched: false,
    })));
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setTimer(0);
    setShakeIds([]);
    setSparkleIds([]);
    lockRef.current = false;
    setPhase("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  }, []);

  /* ── Card click ────────────────────────────────────────── */
  const handleCardClick = useCallback((cardId: number) => {
    if (lockRef.current) return;
    setCards(prev => {
      const card = prev[cardId];
      if (!card || card.flipped || card.matched) return prev;

      const newCards = prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
      const newFlipped = [...flippedIds, cardId];

      if (newFlipped.length === 2) {
        lockRef.current = true;
        setMoves(m => m + 1);
        const [a, b] = newFlipped;
        const cardA = newCards[a];
        const cardB = newCards[b];

        if (cardA.letter.id === cardB.letter.id) {
          // Match!
          setSparkleIds([a, b]);
          setTimeout(() => {
            setCards(prev2 => prev2.map(c =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            ));
            setSparkleIds([]);
            setMatchedPairs(mp => {
              const next = mp + 1;
              if (next >= totalPairsRef.current) {
                // Won!
                if (timerRef.current) clearInterval(timerRef.current);
                setPhase("won");
                setTimer(t => {
                  setBestTimes(bt => {
                    const key = difficulty;
                    if (bt[key] === null || t < bt[key]!) return { ...bt, [key]: t };
                    return bt;
                  });
                  return t;
                });
              }
              return next;
            });
            lockRef.current = false;
          }, 600);
          setFlippedIds([]);
        } else {
          // No match — shake then flip back
          setShakeIds([a, b]);
          setTimeout(() => {
            setCards(prev2 => prev2.map(c =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c
            ));
            setShakeIds([]);
            lockRef.current = false;
          }, 800);
          setFlippedIds([]);
        }
      } else {
        setFlippedIds(newFlipped);
      }

      return newCards;
    });
  }, [flippedIds, difficulty]);

  /* ── Cleanup ───────────────────────────────────────────── */
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const config = DIFF_CONFIG[difficulty];

  /* ─── Render ───────────────────────────────────────────── */
  return (
    <>
      <Head>
        <title>Memory Match | Alif Ujala</title>
        <meta name="description" content="Flip cards and match pairs of Urdu letters! A fun memory game for kids learning Urdu alphabets." />
      </Head>
      <Navbar />

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 35%,#064e3b 65%,#065f46 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: "88px", paddingBottom: "40px", paddingLeft: "12px", paddingRight: "12px",
      }}>
        {/* Back */}
        <div style={{ alignSelf: "flex-start", width: "100%", maxWidth: "700px", margin: "0 auto 8px" }}>
          <Link href="/games" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", fontFamily: "'Comic Neue',cursive", textDecoration: "none" }}>
            ← Back to Games
          </Link>
        </div>

        <h1 style={{
          fontFamily: "'Bubblegum Sans',cursive", fontSize: "clamp(1.5rem,5vw,2.4rem)",
          color: "white", textShadow: "0 2px 12px rgba(16,185,129,0.9)", marginBottom: "16px", textAlign: "center",
        }}>
          🧠 Memory Match
        </h1>

        {/* ──── MENU ──── */}
        {phase === "menu" && (
          <div style={{
            background: "rgba(255,255,255,0.07)", borderRadius: "24px", padding: "36px 28px",
            textAlign: "center", maxWidth: "480px", width: "100%", backdropFilter: "blur(14px)",
            border: "1.5px solid rgba(255,255,255,0.18)",
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "14px" }}>🃏</div>
            <h2 style={{ fontFamily: "'Comic Neue',cursive", color: "white", fontSize: "1.4rem", marginBottom: "14px" }}>How to Play</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Comic Neue',cursive", fontSize: "0.98rem", lineHeight: "1.68", marginBottom: "28px" }}>
              Tap a card to flip it and reveal the Urdu letter underneath.
              <br /><br />
              Find <strong style={{ color: "#4ADE80" }}>matching pairs</strong> by remembering where each letter is.
              Match all pairs to win! Try to do it in the fewest moves and fastest time.
            </p>

            <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Comic Neue',cursive", fontSize: "0.85rem", marginBottom: "14px" }}>
              Choose difficulty:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(Object.keys(DIFF_CONFIG) as Difficulty[]).map(d => (
                <button key={d} onClick={() => startGame(d)} style={{
                  background: d === "easy" ? "linear-gradient(135deg,#10B981,#059669)"
                    : d === "medium" ? "linear-gradient(135deg,#0EA5E9,#2563EB)"
                    : "linear-gradient(135deg,#EF4444,#DC2626)",
                  color: "white", fontFamily: "'Bubblegum Sans',cursive", fontSize: "1.1rem",
                  border: "none", borderRadius: "14px", padding: "14px 24px", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}>
                  {DIFF_CONFIG[d].emoji} {DIFF_CONFIG[d].label}
                </button>
              ))}
            </div>

            {/* Best times */}
            {(bestTimes.easy !== null || bestTimes.medium !== null || bestTimes.hard !== null) && (
              <div style={{ marginTop: "24px", padding: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "14px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Comic Neue',cursive", fontSize: "0.8rem", margin: "0 0 8px" }}>Best Times</p>
                {(Object.keys(DIFF_CONFIG) as Difficulty[]).map(d => bestTimes[d] !== null && (
                  <p key={d} style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Comic Neue',cursive", fontSize: "0.85rem", margin: "2px 0" }}>
                    {DIFF_CONFIG[d].emoji} {d}: {formatTime(bestTimes[d]!)}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ──── WON ──── */}
        {phase === "won" && (
          <div style={{
            background: "rgba(255,255,255,0.07)", borderRadius: "24px", padding: "36px 28px",
            textAlign: "center", maxWidth: "480px", width: "100%", backdropFilter: "blur(14px)",
            border: "1.5px solid rgba(74,222,128,0.4)",
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "10px" }}>🎉</div>
            <h2 style={{ fontFamily: "'Bubblegum Sans',cursive", color: "#4ADE80", fontSize: "1.7rem", marginBottom: "10px" }}>
              You Did It!
            </h2>
            <p style={{ fontFamily: "'Comic Neue',cursive", color: "rgba(255,255,255,0.8)", fontSize: "1rem", marginBottom: "4px" }}>
              Time: <strong style={{ color: "#FACC15" }}>{formatTime(timer)}</strong>
            </p>
            <p style={{ fontFamily: "'Comic Neue',cursive", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "24px" }}>
              Moves: {moves} · Difficulty: {difficulty}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => startGame(difficulty)} style={{
                background: "linear-gradient(135deg,#10B981,#059669)", color: "white",
                fontFamily: "'Bubblegum Sans',cursive", fontSize: "1.1rem",
                border: "none", borderRadius: "50px", padding: "12px 36px", cursor: "pointer",
              }}>
                Play Again
              </button>
              <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("menu"); }} style={{
                background: "rgba(255,255,255,0.1)", color: "white",
                fontFamily: "'Comic Neue',cursive", fontWeight: 700, fontSize: "0.95rem",
                border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: "50px",
                padding: "12px 28px", cursor: "pointer",
              }}>
                Change Difficulty
              </button>
            </div>
          </div>
        )}

        {/* ──── PLAYING ──── */}
        {phase === "playing" && (
          <div style={{ width: "100%", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* HUD */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
              background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "10px 18px",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              <span style={{ fontFamily: "'Comic Neue',cursive", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 700 }}>
                ⏱ {formatTime(timer)}
              </span>
              <span style={{ fontFamily: "'Bubblegum Sans',cursive", color: "white", fontSize: "1.1rem" }}>
                {matchedPairs} / {totalPairsRef.current} pairs
              </span>
              <span style={{ fontFamily: "'Comic Neue',cursive", color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 700 }}>
                {moves} moves
              </span>
            </div>

            {/* Card grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
              gap: "clamp(6px, 2vw, 12px)",
              padding: "12px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "20px",
              border: "2px solid rgba(255,255,255,0.1)",
            }}>
              {cards.map(card => {
                const isShaking = shakeIds.includes(card.id);
                const isSparkling = sparkleIds.includes(card.id);
                const isRevealed = card.flipped || card.matched;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      perspective: "600px",
                      cursor: card.matched ? "default" : "pointer",
                    }}
                  >
                    <div style={{
                      width: "100%", height: "100%",
                      transition: "transform 0.4s ease",
                      transformStyle: "preserve-3d",
                      transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
                      animation: isShaking ? "shake-x 0.4s ease" : isSparkling ? "glow-pulse 0.5s ease 2" : "none",
                    }}>
                      {/* Card back */}
                      <div style={{
                        position: "absolute", inset: 0,
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg,#4338ca,#7c3aed)",
                        borderRadius: "clamp(10px, 2.5vw, 16px)",
                        border: "2.5px solid rgba(255,255,255,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                      }}>
                        <span style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", opacity: 0.6 }}>❓</span>
                      </div>

                      {/* Card front */}
                      <div style={{
                        position: "absolute", inset: 0,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: card.matched
                          ? "linear-gradient(135deg,rgba(74,222,128,0.25),rgba(16,185,129,0.15))"
                          : `linear-gradient(135deg,${CARD_COLORS[card.id % CARD_COLORS.length]}22,${CARD_COLORS[card.id % CARD_COLORS.length]}11)`,
                        borderRadius: "clamp(10px, 2.5vw, 16px)",
                        border: card.matched
                          ? "2.5px solid rgba(74,222,128,0.6)"
                          : "2.5px solid rgba(255,255,255,0.35)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        boxShadow: card.matched
                          ? "0 0 20px rgba(74,222,128,0.3)"
                          : "0 4px 16px rgba(0,0,0,0.3)",
                        gap: "2px",
                      }}>
                        <span style={{
                          fontFamily: "'Noto Nastaliq Urdu',serif",
                          fontSize: "clamp(1.3rem, 4vw, 2rem)",
                          lineHeight: "1.3",
                          color: card.matched ? "#4ADE80" : "white",
                          direction: "rtl",
                          textShadow: card.matched ? "0 0 10px rgba(74,222,128,0.5)" : "0 1px 4px rgba(0,0,0,0.5)",
                        }}>
                          {card.letter.char}
                        </span>
                        <span style={{
                          fontFamily: "'Comic Neue',cursive",
                          fontSize: "clamp(0.5rem, 1.5vw, 0.7rem)",
                          color: card.matched ? "rgba(74,222,128,0.7)" : "rgba(255,255,255,0.5)",
                          fontWeight: 700,
                        }}>
                          {card.letter.name}
                        </span>
                      </div>
                    </div>

                    {/* Sparkle overlay */}
                    {isSparkling && (
                      <div style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 5,
                      }}>
                        <span style={{ fontSize: "1.8rem", animation: "score-float 0.6s ease-out forwards" }}>✨</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Restart / Quit */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={() => startGame(difficulty)} style={{
                background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                fontFamily: "'Comic Neue',cursive", fontWeight: 700, fontSize: "0.85rem",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
                padding: "8px 20px", cursor: "pointer",
              }}>
                🔄 Restart
              </button>
              <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("menu"); }} style={{
                background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)",
                fontFamily: "'Comic Neue',cursive", fontWeight: 700, fontSize: "0.85rem",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
                padding: "8px 20px", cursor: "pointer",
              }}>
                ← Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
