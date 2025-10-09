"use client";

import { useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "./HeroWithFire.module.css";

/* Wooden–box text data --------------------------------------------------- */
const ROWS = [
  // bottom row first (this catches fire first)
  [
    { id: "easy", label: "Fun Learning" },
    { id: "logo", label: "Interactive Worksheets" },
  ],
  // top row
  [
    { id: "learn", label: "Personalized Learning", highlight: true },
    { id: "video", label: "Educational videos" },
    { id: "print", label: "Customized Worksheets" },
  ],
];

export default function HeroWithFire() {
  /* which rows are burning? */
  const [rowOnFire, setRowOnFire] = useState([false, false]);
  const [mute, setMute] = useState(false);
  const soundRef = useRef(null);

  // sequential ignition & sound
  useEffect(() => {
    /* ignite bottom immediately, top after 2.5 s */
    const t1 = setTimeout(() => setRowOnFire([true, false]), 400);
    const t2 = setTimeout(() => setRowOnFire([true, true]), 2900);

    /* crackle sound */
    const s = new Howl({
      src: ["/sounds/fire-crackle.mp3"],
      volume: 0.5,
      loop: true,
      autoplay: true,
    });
    soundRef.current = s;

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      s && s.stop();
    };
  }, []);

  const toggleMute = () => {
    if (!soundRef.current) return;
    const next = !mute;
    soundRef.current.mute(next);
    setMute(next);
  };

  return (
    <section className={styles.hero}>
      {/* top “roof” line that boards hang from */}
      <span className={styles.roofLine} />

      {/* BOARD GRID ------------------------------------------------------ */}
      <div className={styles.grid}>
        {/* map two rows */}
        {ROWS.map((row, rIdx) => (
          <div key={rIdx} className={styles.row}>
            {row.map((item, iIdx) => (
              <motion.div
                key={item.id}
                className={styles.column}
                animate={{ rotate: [-2, 2, -2] }}
                transition={{
                  duration: 7,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: iIdx * 0.2,
                }}
              >
                {/* rope from roof */}
                <span
                  className={clsx(
                    styles.rope,
                    rowOnFire[rIdx] && styles.ropeBurnt
                  )}
                />

                {/* wooden board */}
                <div
                  className={clsx(
                    styles.board,
                    item.highlight && styles.boardHighlight,
                    rowOnFire[rIdx] && styles.boardBurnt
                  )}
                >
                  {item.label}
                </div>

                {/* FLAME GIF (shows only if row is burning) */}
                {rowOnFire[rIdx] && (
                  <motion.img
                    src="/flame.gif"
                    alt="flame"
                    className={styles.flame}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      {/* mute / un‑mute --------------------------------------------------- */}
      <button
        onClick={toggleMute}
        className={styles.soundBtn}
        aria-label={mute ? "un‑mute fire sound" : "mute fire sound"}
      >
        {mute ? "🔇" : "🔊"}
      </button>
    </section>
  );
}
