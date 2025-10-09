"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const STORIES = [
  {
    title: "خرگوش اور کچھوا",
    content:
      "ایک دن خرگوش اور کچھوا دوڑ لگانے نکلے۔ خرگوش بہت تیز بھاگا اور آگے نکل گیا، لیکن وہ راستے میں سو گیا۔ کچھوا آہستہ آہستہ چلتا رہا اور جیت گیا۔ سبق: سست روی سے لیکن مستقل مزاجی سے کامیابی حاصل ہوتی ہے۔",
  },
  {
    title: "شیر اور چالاک لومڑی",
    content:
      "ایک دفعہ کا ذکر ہے کہ ایک شیر جنگل کا بادشاہ تھا۔ وہ ہر جانور کو دھمکاتا۔ ایک دن لومڑی نے چالاکی سے شیر کو کنویں میں گرا دیا۔ سبق: عقل طاقت سے بڑی ہوتی ہے۔",
  },
  {
    title: "کوا اور پانی",
    content:
      "گرمی کا موسم تھا اور ایک پیاسا کوا پانی کی تلاش میں تھا۔ اسے ایک گھڑا ملا جس میں تھوڑا سا پانی تھا۔ کوا کنکر ڈال کر پانی کو اوپر لایا اور اپنی پیاس بجھائی۔ سبق: محنت کا پھل ملتا ہے۔",
  },
];

export default function UrduStories() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-20 grid grid-cols-1 gap-6 text-right">
      {STORIES.map((story, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-xl shadow-md border border-yellow-300 p-4 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-pink-700">{story.title}</h2>
            <button
              className="bg-pink-500 text-white px-4 py-1 rounded-full hover:bg-pink-600 transition"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              {open === idx ? "چھپائیں" : "پڑھیں"}
            </button>
          </div>
          {open === idx && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg mt-2 leading-relaxed text-gray-800"
            >
              {story.content}
            </motion.p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
