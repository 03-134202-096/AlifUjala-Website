import React, { useState } from 'react';
import { motion } from "framer-motion";
import VisualStory from "./VisualStory";
import { rabbitTurtleScenes } from "@/data/rabbitTurtleScenes";
import { lionFoxScenes } from "@/data/lionFoxScenes";
import { crowWaterScenes } from "@/data/crowWaterScenes";

const storyColors = [
  'from-indigo-200 to-violet-100 border-indigo-300',
  'from-blue-200 to-cyan-100 border-blue-300',
  'from-green-200 to-emerald-100 border-green-300',
];

const storyEmojis = ['🐇🐢', '🦁🦊', '🐦💧'];

const stories = [
  {
    id: 'rabbit-turtle',
    title: 'خرگوش اور کچھوا!',
    text: `ایک جنگل میں ایک بہت چالاک اور تیز رفتار خرگوش رہتا تھا۔`,
    img: '/images/stories/sroty 1.png'
  },
  {
    id: "lion-fox",
    title: "شیر اور چلاک لومڑی",
    text: "ایک جنگل کا شیر طاقتور اور شرارتی تھا۔",
    img: "/images/stories/sroty 2.png"
  },
  {
    id: "crow-water",
    title: "کوا اور پانی",
    text: `گرمی کے دنوں میں ایک کوّا پانی کی تلاش میں بھٹکتا رہا۔`,
    img: '/images/stories/story 3.png'
  }
];

const Stories: React.FC = () => {
  const [openStory, setOpenStory] = useState<string | null>(null);

  return (
    <div className="flex flex-row flex-wrap gap-8 justify-center mt-4">
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          className={`relative w-72 sm:w-80 flex-shrink-0 rounded-3xl shadow-candy flex flex-col items-center justify-center p-5 bg-gradient-to-br ${storyColors[i]} cursor-pointer border-4 overflow-hidden group`}
          whileHover={{ y: -8, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenStory(story.id)}
        >
          {/* Emoji decoration */}
          <div className="absolute top-3 right-3 text-2xl opacity-40 group-hover:opacity-80 transition-opacity">
            {storyEmojis[i]}
          </div>
          
          <img src={story.img} alt={story.title} className="rounded-2xl drop-shadow-lg w-full h-52 object-contain mb-4 bg-white/50 p-2" />
          
          <span className="block mt-2 font-bold text-xl text-center drop-shadow-sm" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
            {story.title}
          </span>
          
          {/* Click prompt */}
          <div className="mt-3 bg-white/80 rounded-full px-4 py-1.5 text-sm font-bold text-purple-600 group-hover:bg-purple-100 transition-colors" style={{fontFamily: "'Comic Neue', cursive"}}>
            📖 Click to Read!
          </div>
        </motion.div>
      ))}

      {/* Story Viewers */}
      {openStory === 'rabbit-turtle' && (
        <VisualStory onClose={() => setOpenStory(null)} title="خرگوش اور کچھوا" scenes={rabbitTurtleScenes} />
      )}
      {openStory === 'lion-fox' && (
        <VisualStory onClose={() => setOpenStory(null)} title="شیر اور چلاک لومڑی" scenes={lionFoxScenes} />
      )}
      {openStory === 'crow-water' && (
        <VisualStory onClose={() => setOpenStory(null)} title="کوا اور پانی" scenes={crowWaterScenes} />
      )}
    </div>
  );
};

export default Stories;
