import React, { useState } from 'react';
import { motion } from "framer-motion";
import VisualStory from "./VisualStory";
import VideoPlayer from "./VideoPlayer";
import { rabbitTurtleScenes } from "@/data/rabbitTurtleScenes";
import { lionFoxScenes } from "@/data/lionFoxScenes";
import { crowWaterScenes } from "@/data/crowWaterScenes";
import { greedyDogScenes } from "@/data/greedyDogScenes";
import { antGrasshopperScenes } from "@/data/antGrasshopperScenes";
import { foxGrapesScenes } from "@/data/foxGrapesScenes";
import { sheepWolfScenes } from "@/data/sheepWolfScenes";
import { hardworkingFarmerScenes } from "@/data/hardworkingFarmerScenes";

const storyColors = [
  'from-indigo-200 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 border-indigo-300 dark:border-indigo-700',
  'from-blue-200 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 border-blue-300 dark:border-blue-700',
  'from-green-200 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border-green-300 dark:border-green-700',
  'from-yellow-200 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 border-yellow-300 dark:border-yellow-700',
  'from-pink-200 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 border-pink-300 dark:border-pink-700',
  'from-teal-200 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 border-teal-300 dark:border-teal-700',
  'from-purple-200 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 border-purple-300 dark:border-purple-700',
  'from-lime-200 to-green-100 dark:from-lime-900/50 dark:to-green-900/50 border-lime-300 dark:border-lime-700',
];

const storyEmojis = ['🐇🐢', '🦁🦊', '🐦💧', '🐕🦴', '🐜🦗', '🦊🍇', '🐑🐺', '👨‍🌾🌾'];

const stories = [
  {
    id: 'rabbit-turtle',
    title: 'خرگوش اور کچھوا',
    text: `ایک جنگل میں ایک بہت چالاک اور تیز رفتار خرگوش رہتا تھا۔`,
    img: '/images/stories/sroty 1.webp'
  },
  {
    id: "lion-fox",
    title: "شیر اور چلاک لومڑی",
    text: "ایک جنگل کا شیر طاقتور اور شرارتی تھا۔",
    img: "/images/stories/sroty 2.webp"
  },
  {
    id: "crow-water",
    title: "کوا اور پانی",
    text: `گرمی کے دنوں میں ایک کوّا پانی کی تلاش میں بھٹکتا رہا۔`,
    img: '/images/stories/story 3.webp'
  },
  {
    id: "greedy-dog",
    title: "لالچی کتا",
    text: "ایک کتے کو ہڈی مل گئی اور وہ گھر بھاگا مگر لالچ نے اسے نقصان پہنچایا۔",
    img: "/images/stories/story 4/thumbnail.webp"
  },
  {
    id: "ant-grasshopper",
    title: "چیونٹی اور ٹڈی",
    text: "گرمیوں میں چیونٹی نے محنت کی اور ٹڈی نے کھیل کود میں وقت ضائع کیا۔",
    img: "/images/stories/ant-grasshopper/thumnnail.webp"
  },
  {
    id: "fox-grapes",
    title: "لومڑی اور انگور",
    text: "ایک بھوکی لومڑی کو اونچے انگوروں کا گچھا نظر آیا مگر وہ حاصل نہ کر پائی۔",
    img: "/images/stories/fox/thumbnail.webp"
  },
  {
    id: "sheep-wolf",
    title: "بھیڑیا آیا! بھیڑیا آیا!",
    text: "احمد نے بار بار جھوٹا شور مچایا — اور جب سچ میں خطرہ آیا تو کوئی نہ آیا۔",
    img: "/images/stories/sheep-story/thumbnail.webp"
  },
  {
    id: "hardworking-farmer",
    title: "محنتی کسان",
    text: "ایک بوڑھا کسان اپنے تین لڑاکو بیٹوں کو اتحاد کا سبق دینا چاہتا تھا۔",
    img: "/images/stories/farmer/thumbnail.webp"
  },
];

const scenesMap: Record<string, any[]> = {
  'rabbit-turtle': rabbitTurtleScenes,
  'lion-fox': lionFoxScenes,
  'crow-water': crowWaterScenes,
  'greedy-dog': greedyDogScenes,
  'ant-grasshopper': antGrasshopperScenes,
  'fox-grapes': foxGrapesScenes,
  'sheep-wolf': sheepWolfScenes,
  'hardworking-farmer': hardworkingFarmerScenes,
};

const Stories: React.FC = () => {
  const [openStory, setOpenStory] = useState<string | null>(null);
  const [videoStory, setVideoStory] = useState<string | null>(null);

  return (
    <div className="flex flex-row flex-wrap gap-8 justify-center mt-4">
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          className={`relative w-72 sm:w-80 flex-shrink-0 rounded-3xl shadow-candy flex flex-col items-center justify-center p-5 bg-gradient-to-br ${storyColors[i % storyColors.length]} cursor-pointer border-4 overflow-hidden group`}
          whileHover={{ y: -8, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenStory(story.id)}
        >
          {/* Emoji decoration */}
          <div className="absolute top-3 right-3 text-2xl opacity-40 group-hover:opacity-80 transition-opacity">
            {storyEmojis[i % storyEmojis.length]}
          </div>

          {(story as any).img ? (
            <div className="relative w-full">
              <img src={(story as any).img} alt={story.title} className="rounded-2xl drop-shadow-lg w-full h-52 object-cover mb-4 bg-white/50 dark:bg-gray-800/50" />
              {/* Video play icon overlay */}
              <button
                onClick={(e) => { e.stopPropagation(); setVideoStory(story.id); }}
                title="Watch Video"
                className="absolute bottom-6 right-2 w-10 h-10 rounded-full bg-black/50 hover:bg-indigo-600 text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 active:scale-95 border-2 border-white/40"
              >
                <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl w-full h-52 mb-4 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center text-8xl">
              {storyEmojis[i % storyEmojis.length]}
            </div>
          )}

          <span className="block mt-2 font-bold text-xl text-center drop-shadow-sm" style={{fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", color: '#6366f1', direction: 'rtl', lineHeight: '2'}}>
            {story.title}
          </span>

          {/* Click prompt */}
          <div className="mt-3 bg-white/80 dark:bg-gray-800/80 rounded-full px-4 py-1.5 text-sm font-bold text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors" style={{fontFamily: "'Comic Neue', cursive"}}>
            📖 Click to Read!
          </div>
        </motion.div>
      ))}

      {/* Story Viewers */}
      {openStory && scenesMap[openStory] && (
        <VisualStory
          onClose={() => setOpenStory(null)}
          title={stories.find(s => s.id === openStory)?.title ?? ''}
          scenes={scenesMap[openStory]}
          storyId={openStory}
          onPlayVideo={() => { setVideoStory(openStory); }}
        />
      )}

      {/* Video Player */}
      {videoStory && (
        <VideoPlayer
          storyId={videoStory}
          title={stories.find(s => s.id === videoStory)?.title ?? ''}
          onClose={() => setVideoStory(null)}
        />
      )}
    </div>
  );
};

export default Stories;
