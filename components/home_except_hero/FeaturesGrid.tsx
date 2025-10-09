"use client";

import { motion } from "framer-motion";
import styles from "./FeaturesGrid.module.css";

const FEATURES = [
  {
    title: "Math Games",
    desc:  "Count, add, subtract—and win with numbers!",
  },
  {
    title: "Language Games",
    desc:  "Spell, match words & build your vocabulary.",
  },
  {
    title: "Science Games",
    desc:  "Explore nature, experiments & fun facts.",
  },
];

export default function FeaturesGrid() {
  return (
    <div className={styles.grid}>
      {FEATURES.map((f, idx) => (
        <motion.div
          key={idx}
          className={styles.card}
          whileHover={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: "mirror" }}
        >
          <h3 className={styles.title}>{f.title}</h3>
          <p className={styles.desc}>{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
