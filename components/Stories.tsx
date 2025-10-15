import React, { useState } from 'react';
import { motion } from "framer-motion";

const stories = [
  {
    id: 'rabbit-turtle',
    title: 'خرگوش اور کچھوا!',
    text: `ایک جنگل میں ایک بہت چالاک اور تیز رفتار خرگوش رہتا تھا۔ وہ ہمیشہ کچھوے کی سست رفتاری پر ہنستا اور اس کا مذاق اڑاتا۔ کچھوا خاموشی سے اپنے راستے چلتا رہتا۔ ایک دن دونوں میں دوڑ کا مقابلہ ہوا۔ شروع ہوتے ہی خرگوش بہت آگے نکل گیا اور راستے میں ایک سایہ دار درخت کے نیچے آرام کر لیا — سوچا کچھوا ابھی بہت پیچھے ہے۔ کیوں کہ وہ خود پر بھروسہ کرتا تھا، اس کی آنکھ لگ گئی۔ کچھوا آہستگی سے مگر لگاتار چلتا رہا، اور جب خرگوش نیند سے جاگا تو دیکھا کہ کچھوا ہی پہلے منزل پر پہنچ چکا تھا۔ نتیجہ: غرور اور خود پر حد سے زیادہ اعتماد نقصان کا باعث بنتا ہے؛ مستقل مزاجی اکثر تیز رفتاری پر غالب آتی ہے۔`,
    img: '/images/stories/sroty 1.png'
  },
  {
    id: "lion-fox",
    title: "شیر اور چلاک لومڑی",
    text: `ایک بار جنگل میں شیر تھا جو خود کو بادشاہ سمجھتا تھا۔ وہ دوسروں کو ڈراتا اور جلدی سے فیصلہ کر لیتا۔ ایک دن وہ کسی چالاک لومڑی کے چالاکی سے متاثر ہوا—لومڑی نے شیر کو سمجھایا کہ وہ جنگل کے جانوروں کے ساتھ مل جل کر رہ سکتا ہے اور غیر ضروری جھگڑے نہیں کرنے چاہئیں۔ لومڑی نے ایک موقع پر شیر کی مدد کی اور پھر شیر نے بھی اسے عزت دی۔ کہانی ہمیں بتاتی ہے کہ طاقت کے ساتھ حکمت اور دوسروں کی عزت ضروری ہے؛ چالاکی اور مذاق کبھی کبھار مسئلے حل کر دیتی ہے مگر ایمانداری اور احترام بہتر راستہ ہیں۔`,
    img: '/images/stories/sroty 2.png'
  },
  {
    id: "crow-water",
    title: "کوا اور پانی",
    text: `گرمی کے دنوں میں ایک کوّا پانی کی تلاش میں بھٹکتا رہا۔ وہ ایک باغ میں پہنچا اور ایک گھڑا پایا جس میں تھوڑا سا ہی پانی تھا — اتنا کم کہ کوے کی چونچ تک نہیں پہنچ رہا تھا۔ کوئے نے پھرتی سے آس پاس چھوٹے کنکر جمع کیے اور انہیں گھڑے میں ڈالنا شروع کر دیا۔ جیسے جیسے کنکر گھڑے میں پڑتے گئے، پانی اوپر اٹھنے لگا اور آخر کار پانی اتنا اوپر آ گیا کہ کوے نے پی لیا اور پیاس بجھائی۔ سبق: عقل و ہوشیاری اور ایجادِ حل سے مشکلات کا حل نکل آتا ہے — "ضرورت ایجاد کی ماں ہے"۔`,
    img: '/images/stories/story 3.png'
  }
];

const Stories: React.FC = () => {
  const [openStory, setOpenStory] = useState<string | null>(null);

  return (
    <div className="flex flex-row flex-wrap gap-8 justify-center mt-8">
      {stories.map((story, i) => (
        <motion.div
          key={story.id}
          className={`relative w-72 h-96 flex-shrink-0 rounded-2xl shadow-xl flex flex-col items-center justify-center p-5 bg-gradient-to-br from-blue-100 to-white cursor-pointer`}
          whileHover={{ y: -10, scale: 1.04 }}
          onClick={() => setOpenStory(story.id)}
        >
          <img src={story.img} alt={story.title} className="rounded-md drop-shadow-lg w-90 h-90 object-contain mb-4" />
          <span className="block mt-2 font-bold text-xl text-pink-700 text-center drop-shadow-sm">
            {story.title}
          </span>
        </motion.div>
      ))}

      {/* Glassmorphism Popup */}
      {openStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-right relative border border-pink-200"
          >
            <button
              className="absolute left-4 top-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm"
              onClick={() => setOpenStory(null)}
            >بند کریں</button>
            <h2 className="font-extrabold text-2xl text-pink-700 mb-4">{stories.find(s => s.id === openStory)?.title}</h2>
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {stories.find(s => s.id === openStory)?.text}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Stories;
