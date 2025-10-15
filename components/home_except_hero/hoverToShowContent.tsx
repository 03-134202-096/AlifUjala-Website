"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import lion from "public/images/lion_worksheet.png";
import camel from "public/images/camel_youtube.png";
import croco from "public/images/croco_app.png";

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
];

const frontVariants = {
  rest: { y: 0, zIndex: 20 },
  hover: { y: -120, zIndex: 10 },
};

const backVariants = {
  rest: { opacity: 0, y: 60, zIndex: 10 },
  hover: { opacity: 1, y: 0, zIndex: 20 },
};

export default function FeatureCards() {
  return (
    <div className="mt-0 mb-16 flex justify-center gap-8 flex-wrap">
      {CARDS.map((c, i) => {
        const card = (
          <motion.div
            key={i}
            className="relative w-72 h-96"
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
              <span className="block sm:hidden mt-4 text-white text-center drop-shadow-sm text-2xl">
                {c.title}
              </span>
            </motion.div>

            {/* Back Content Panel */}
            <motion.div
              variants={backVariants}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <h3 className="font-extrabold text-xl text-purple-700 mb-4 tracking-wide drop-shadow-sm">
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
            <Link key={"link-" + i} href="/games" className="block" aria-label="Open games section">
              {card}
            </Link>
          );
        }

        // Optionally wrap other cards with external links (preserve hover/motion)
        let linkUrl: string | null = null;
        if (c.title && c.title.includes("Mobile App")) {
          linkUrl = "https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala";
        } else if (c.title && c.title.includes("Educational Videos")) {
          linkUrl = "https://youtube.com/@urdukayrung?si=_TST10F6NnsMKIbr";
        }

        if (linkUrl) {
          return (
            <a
              key={"link-" + i}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
              aria-label={c.title ? `Open ${c.title}` : 'Open external link'}
            >
              {card}
            </a>
          );
        }

        return card;
      })}
    </div>
  );
}
