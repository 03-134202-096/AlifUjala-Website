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

  // Flattened items for slider (order: Fun Learning, Interactive Worksheets, Personalized Learning, Educational videos, Customized Worksheets)
  const ITEMS = [
    ROWS[0][0], // Fun Learning
    ROWS[0][1], // Interactive Worksheets
    ROWS[1][0], // Personalized Learning
    ROWS[1][1], // Educational videos
    ROWS[1][2], // Customized Worksheets
  ];

  // slider state
  const [index, setIndex] = useState(0); // center index in ITEMS
  const startX = useRef(null);

  const prev = () => setIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
  const nextItem = () => setIndex((i) => (i + 1) % ITEMS.length);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX.current;
    const threshold = 30; // px
    if (dx > threshold) {
      // swipe right -> previous
      prev();
    } else if (dx < -threshold) {
      // swipe left -> next
      nextItem();
    }
    startX.current = null;
  };

  return (
    <section className={styles.hero}>
      {/* top “roof” line that boards hang from */}
      <span className={styles.roofLine} />

      {/* BOARD GRID ------------------------------------------------------ */}
  <div className={clsx(styles.grid, styles.hideOnMobile)}>
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
      {/* Mobile slider: glass window with three buttons (left, center, right) */}
      <div
        className={styles.mobileSliderWrap}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.mobileSlider}>
          {/* left */}
          <button
            className={styles.sliderBtn + " " + styles.left}
            onClick={prev}
            aria-label="previous"
          >
            {ITEMS[(index - 1 + ITEMS.length) % ITEMS.length].label}
            <img src="/flame.gif" alt="flame" className={styles.sliderFlame} aria-hidden="true" />
          </button>

          {/* center */}
          <button
            className={styles.sliderBtn + " " + styles.center}
            aria-label="current"
          >
            {ITEMS[index].label}
            <img src="/flame.gif" alt="flame" className={styles.sliderFlame} aria-hidden="true" />
          </button>

          {/* right */}
          <button
            className={styles.sliderBtn + " " + styles.right}
            onClick={nextItem}
            aria-label="next"
          >
            {ITEMS[(index + 1) % ITEMS.length].label}
            <img src="/flame.gif" alt="flame" className={styles.sliderFlame} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
