
"use client";

import { motion } from "framer-motion";

export default function WelcomeHeader() {
  return (
    <div className="relative py-4">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3"
        style={{ 
          fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: '2.2',
          padding: '0.3em 0',
          overflow: 'visible',
        }}
      >
       !خوش آمدید
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
