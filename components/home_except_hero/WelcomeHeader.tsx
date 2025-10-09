
"use client";

import { motion } from "framer-motion";

export default function WelcomeHeader() {
  return (
    <motion.h1
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-5xl font-bold text-pink-600 mb-6"
    >
      خوش آمدید!
    </motion.h1>
  );
}
