"use client";
import { motion } from "framer-motion";
export default function WelcomeHeader() {
  return (
    <div className="relative py-4">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="mb-3"
      >
        <span
          className="welcome-title-gradient block text-2xl sm:text-3xl md:text-4xl font-bold"
          style={{
            fontFamily: "'Bubblegum Sans', cursive",
          }}
        >
          Learn Urdu Alphabets for Kids
        </span>
        <span
          className="welcome-title-gradient block text-4xl sm:text-5xl md:text-6xl font-bold"
          style={{
            fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
            lineHeight: '2.2',
            padding: '0.3em 0',
            overflow: 'visible',
          }}
          lang="ur"
          dir="rtl"
          data-testid="urdu-welcome"
        >
          {'خوش آمدید!'}
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg sm:text-xl text-indigo-600 dark:text-purple-300 font-bold max-w-md mx-auto"
        style={{ fontFamily: "'Comic Neue', cursive" }}
      >
        Let&apos;s have fun learning Urdu together!
      </motion.p>
    </div>
  );
}
