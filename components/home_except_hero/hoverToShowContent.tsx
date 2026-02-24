"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import lion from "public/images/lion_worksheet.png";
import camel from "public/images/camel_youtube.png";
import croco from "public/images/croco_app.png";
import catStories from "public/images/cat_stories.png";

const CARDS = [
  {
    title: "📄 Worksheets",
    img: lion,
    color: "bg-yellow-400",
    list: [
      "🖨️ Printable Worksheet",
      "🎨 Customized Logo",
      "📚 Interactive Learning",
    ],
  },
  {
    title: "🎥 Educational Videos",
    img: camel,
    color: "bg-pink-400",
    list: [
      "🎉 Fun Learning",
      "📖 Urdu Stories",
      "⚔️ Letters Fighting",
    ],
  },
  {
    title: "📱 Mobile App",
    img: croco,
    color: "bg-green-400",
    list: [
      "🎮 Interactive Activites",
      "📊 Progress Tracker",
      "🗣️ Voice Support",
    ],
  },
  {
    title: "🐱 Stories",
    img: catStories,
    color: "bg-blue-500",
    list: [
      "📖 Fun Stories",
      "😺 Cute Illustrations",
      "🌟 Imaginative Reading",
    ],
  },
];

const frontVariants = {
  rest: { y: 0, zIndex: 20 },
  hover: { y: -120, zIndex: 10 },
};

const backVariants = {
  rest: { opacity: 0, y: 60, zIndex: 10 },
  hover: { opacity: 1, y: 0, zIndex: 20 },
};

const APP_SAMPLE_IMAGES = Array.from({ length: 7 }, (_, i) => `/images/AppSampleImages/${i + 1}.jpeg`);

export default function FeatureCards() {
  const [showAppPopup, setShowAppPopup] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  return (
  <>
  <div className="mt-0 mb-16 flex flex-col sm:flex-row justify-center items-center sm:items-stretch gap-6 sm:gap-8 flex-wrap lg:flex-nowrap px-4">
      {CARDS.map((c, i) => {
        const card = (
          <motion.div
            key={i}
            className="relative w-full h-80 sm:h-96"
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            {/* Front Image Panel */}
            <motion.div
              variants={frontVariants}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`absolute inset-0 rounded-2xl ${c.color} shadow-xl flex flex-col items-center justify-center p-5`}
            >
              <Image
                src={c.img}
                alt={c.title}
                className="rounded-md drop-shadow-lg"
                width={150}
                height={150}
              />
              {/* Show card title below image on mobile screens */}
              <span className="block sm:hidden mt-4 text-white text-center drop-shadow-sm text-xl font-bold">
                {c.title}
              </span>
            </motion.div>

            {/* Back Content Panel */}
            <motion.div
              variants={backVariants}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <h3 className="font-extrabold text-xl text-indigo-700 mb-4 tracking-wide drop-shadow-sm">
                {c.title}
              </h3>
              <ul className="list-none text-left w-full text-gray-700 text-sm sm:text-base space-y-2 font-medium">
                {c.list.map((item, idx) => (
                  <li
                    key={idx}
                    className="hover:translate-x-1 transition-transform duration-300 flex gap-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        );

        // Internal navigation: Worksheets -> /games
        if (c.title && c.title.includes("Worksheets")) {
          return (
            <Link key={"link-" + i} href="/games" className="block w-full sm:w-72 flex-shrink-0" aria-label="Open games section">
              {card}
            </Link>
          );
        }

        // Internal navigation: Stories -> /stories
        if (c.title && c.title.includes("Stories")) {
          return (
            <Link key={"link-" + i} href="/stories" className="block w-full sm:w-72 flex-shrink-0" aria-label="Open stories section">
              {card}
            </Link>
          );
        }

        // Optionally wrap other cards with external links (preserve hover/motion)
        if (c.title && c.title.includes("Mobile App")) {
          return (
            <div key={"link-" + i} className="block w-full sm:w-72 flex-shrink-0 cursor-pointer" onClick={() => setShowAppPopup(true)}>
              {card}
            </div>
          );
        }
        
        let linkUrl: string | null = null;
        if (c.title && c.title.includes("Educational Videos")) {
          linkUrl = "https://youtube.com/@urdukayrung?si=_TST10F6NnsMKIbr";
        }

        if (linkUrl) {
          return (
            <a
              key={"link-" + i}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-72 flex-shrink-0"
              aria-label={c.title ? `Open ${c.title}` : 'Open external link'}
            >
              {card}
            </a>
          );
        }

        return card;
      })}
    </div>

    {/* Mobile App Sample Images Popup */}
    <AnimatePresence>
      {showAppPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowAppPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <h3 className="text-lg font-bold" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                📱 AlifUjala Mobile App
              </h3>
              <button
                onClick={() => setShowAppPopup(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all text-lg"
              >
                ✕
              </button>
            </div>

            {/* Main image */}
            <div className="relative w-full aspect-[9/16] max-h-[55vh] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              <img
                src={APP_SAMPLE_IMAGES[activeImg]}
                alt={`App Screenshot ${activeImg + 1}`}
                className="w-full h-full object-contain"
              />
              {/* Navigation arrows */}
              <button
                onClick={() => setActiveImg((p) => (p - 1 + APP_SAMPLE_IMAGES.length) % APP_SAMPLE_IMAGES.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all text-xl"
              >
                ‹
              </button>
              <button
                onClick={() => setActiveImg((p) => (p + 1) % APP_SAMPLE_IMAGES.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all text-xl"
              >
                ›
              </button>
            </div>

            {/* Thumbnails + download link */}
            <div className="p-4 space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {APP_SAMPLE_IMAGES.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === activeImg ? 'border-purple-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <a
                href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
                style={{fontFamily: "'Comic Neue', cursive"}}
              >
                📥 Download on Google Play
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
