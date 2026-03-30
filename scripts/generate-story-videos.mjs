#!/usr/bin/env node
/**
 * generate-story-videos.mjs
 * ─────────────────────────
 * Generates 8 professional Urdu story videos with word-by-word karaoke
 * highlighting, scene images, and TTS audio.
 *
 * Usage:
 *   node scripts/generate-story-videos.mjs
 *   node scripts/generate-story-videos.mjs --voice male
 *   node scripts/generate-story-videos.mjs --story rabbit-turtle
 */

import puppeteer from "puppeteer";
import ffmpegPath from "ffmpeg-static";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const TEMP = path.join(ROOT, "temp-video-gen");
const OUTPUT = path.join(PUBLIC, "videos");

// ── CLI args ──
const args = process.argv.slice(2);
const VOICE = args.includes("--voice")
  ? args[args.indexOf("--voice") + 1] || "female"
  : "female";
const ONLY_STORY = args.includes("--story")
  ? args[args.indexOf("--story") + 1]
  : null;
const WIDTH = 1280;
const HEIGHT = 720;

// ═══════════════════════════════════════════════════════════════════════════
//  STORY DATA
// ═══════════════════════════════════════════════════════════════════════════
const stories = [
  {
    id: "rabbit-turtle",
    title: "خرگوش اور کچھوا",
    emoji: "🐇🐢",
    thumbnail: "/images/stories/sroty 1.webp",
    scenes: [
      { text: "ایک جنگل میں ایک بہت چالاک اور تیز رفتار خرگوش رہتا تھا۔ وہ ہمیشہ کچھوے کی سست رفتاری پر ہنستا اور اس کا مذاق اڑاتا۔", img: "/images/stories/story 1/scene 1.webp" },
      { text: "کچھوا خاموشی سے اپنے راستے چلتا رہتا۔ ایک دن دونوں میں دوڑ کا مقابلہ ہوا۔", img: "/images/stories/story 1/scene 2.webp" },
      { text: "شروع ہوتے ہی خرگوش بہت آگے نکل گیا۔", img: "/images/stories/story 1/scene 3.webp" },
      { text: "وہ جب مُڑ کر دیکھنے لگا، تو اسے کچھوے کا کہیں نام و نشان نہ ملا۔راستے میں خرگوش نے ایک سایہ دار درخت دیکھا۔", img: "/images/stories/story 1/scene 4.webp" },
      { text: "پھر خرگوش نے سوچا کہ اگر وہ تھوڑی دیر آرام کرے، تو بعد میں آسانی سے مقابلہ جیت جائے گا۔ وہ ایک سایہ دار درخت کے نیچے لیٹ گیا اور وہیں سو گیا۔", img: "/images/stories/story 1/scene 5.webp" },
      { text: "اسی دوران، کچھوا آہستہ آہستہ مگر مسلسل چلتا رہا، کبھی رکا نہیں، اُدھر وہ درخت کے نیچے سوئے ہوئے خرگوش سے آگے نکل گیا۔", img: "/images/stories/story 1/scene 6.webp" },
      { text: "آخرکار وہ منزل کی لائن پر پہنچ گیا۔", img: "/images/stories/story 1/scene 7.webp" },
      { text: "جب خرگوش کی نیند کھلی اور وہ دوڑ لگا کر آیا، تو وہاں اس کو دیکھ کر حیرت ہوئی کہ کچھوا پہلے سے موجود ہے۔ خرگوش بہت شرمندہ ہوا۔", img: "/images/stories/story 1/scene 8.webp" },
      { text: "نتیجہ یہ نکلا کہ آہستہ مگر مسلسل کوشش کرنے والا آخرکار کامیاب ہوتا ہے۔", ending: true },
      { text: "غرور کا سر ہمیشہ نیچا ہوتا ہے۔", redEnding: true },
    ],
  },
  {
    id: "lion-fox",
    title: "شیر اور چلاک لومڑی",
    emoji: "🦁🦊",
    thumbnail: "/images/stories/sroty 2.webp",
    scenes: [
      { text: "ایک جنگل کا شیر طاقتور اور شرارتی تھا۔ وہ ہر روز شکار جاتا اور جانور ڈر کر رہتے۔", img: "/images/stories/story 2/scene 1.webp" },
      { text: "آخرکار جانوروں نے طے کیا کہ ہر روز ایک جانور خود شیر کے پاس جائے گا تاکہ وہ جنگل میں نہ آئے۔", img: "/images/stories/story 2/scene 2.webp" },
      { text: "جب باری لومڑی کی آئی تو اس نے ایک چال چل دی اور جان بوجھ کر دیر سے پہنچی۔", img: "/images/stories/story 2/scene 3.webp" },
      { text: "لومڑی نے کہا راستے میں ایک اور شیر نے روک رکھا تھا، آؤ میں دکھاتی ہوں کہاں ہے۔", img: "/images/stories/story 2/scene 4.webp" },
      { text: "وہ اسے کنویں کے پاس لے گئی اور بولی: وہی اندر ہے!", img: "/images/stories/story 2/scene 5.webp" },
      { text: "شیر نے پانی میں جھانکا، اپنا عکس دیکھا، دھاڑا اور اسے دوسرا شیر سمجھ لیا۔ وہ غصے میں کنویں میں چھلانگ لگا بیٹھا۔", img: "/images/stories/story 2/scene 6.webp" },
      { text: "لومڑی خوش ہوئی اور سب جانوروں نے جشن منایا کہ ظلم کا انجام برا ہوا۔", img: "/images/stories/story 2/scene 7.webp" },
      { text: "سبق: طاقت سے پہلے عقل کام آتی ہے۔", ending: true },
    ],
  },
  {
    id: "crow-water",
    title: "کوا اور پانی",
    emoji: "🐦💧",
    thumbnail: "/images/stories/story 3.webp",
    scenes: [
      { text: "گرمی کے دنوں میں ایک کوّا پانی کی تلاش میں بھٹکتا رہا۔", img: "/images/stories/story 3/scene 1.webp" },
      { text: "وہ ایک باغ میں پہنچا اور ایک گھڑا پایا جس میں تھوڑا سا ہی پانی تھا۔", img: "/images/stories/story 3/scene 2.webp" },
      { text: "پانی اتنا کم تھا کہ کوے کی چونچ تک نہیں پہنچ رہا تھا۔", img: "/images/stories/story 3/scene 3.webp" },
      { text: "کوئے نے پھرتی سے آس پاس چھوٹے کنکر جمع کیے۔", img: "/images/stories/story 3/scene 4.webp" },
      { text: "اس نے کنکروں کو گھڑے میں ڈالنا شروع کر دیا۔", img: "/images/stories/story 3/scene 5.webp" },
      { text: "جیسے جیسے کنکر گھڑے میں پڑتے گئے، پانی اوپر اٹھنے لگا۔ آخر کار پانی اتنا اوپر آ گیا کہ کوے نے پی لیا اور پیاس بجھائی۔", img: "/images/stories/story 3/scene 6.webp" },
      { text: "اُس نے اللہ کا شکر ادا کیا اور خوشی خوشی اڑ گیا۔", img: "/images/stories/story 3/scene 7.webp" },
      { text: 'سبق: عقل و ہوشیاری اور ایجادِ حل سے مشکلات کا حل نکل آتا ہے — "ضرورت ایجاد کی ماں ہے"۔', ending: true },
    ],
  },
  {
    id: "greedy-dog",
    title: "لالچی کتا",
    emoji: "🐕🦴",
    thumbnail: "/images/stories/story 4/thumbnail.webp",
    scenes: [
      { text: "ایک بار ایک کتے کو ہڈی مل گئی۔ وہ بہت خوش ہوا اور اپنے گھر کی طرف بھاگا۔", img: "/images/stories/story 4/scene1.webp" },
      { text: "راستے میں ایک پُل آیا۔ کتے نے پانی میں اپنا عکس دیکھا۔", img: "/images/stories/story 4/scene2.webp" },
      { text: "اسے لگا کہ پانی میں کوئی اور کتا ہے جس کے منہ میں بڑی ہڈی ہے۔", img: "/images/stories/story 4/scene3.webp" },
      { text: "وہ لالچ میں آ گیا اور اس کتے کی ہڈی چھیننے کے لیے بھونکنے لگا۔", img: "/images/stories/story 4/scene4.webp" },
      { text: "جب اس نے منہ کھولا تو اس کی اپنی ہڈی پانی میں گر گئی اور ڈوب گئی۔", img: "/images/stories/story 4/scene5.webp" },
      { text: "کتا پچھتاتا رہا۔ نہ اپنی ہڈی رہی اور نہ وہ ہڈی جو اسے پانی میں نظر آئی تھی۔", img: "/images/stories/story 4/lastscene.webp" },
      { text: "سبق: لالچ بُری بلا ہے۔ جو ہے اس پر شکر کرو ورنہ وہ بھی چلا جاتا ہے۔", ending: true },
    ],
  },
  {
    id: "ant-grasshopper",
    title: "چیونٹی اور ٹڈی",
    emoji: "🐜🦗",
    thumbnail: "/images/stories/ant-grasshopper/thumnnail.webp",
    scenes: [
      { text: "گرمیوں کے دنوں میں ایک چھوٹی سی چیونٹی دن رات محنت کرتی تھی۔ وہ کھانا جمع کر رہی تھی۔", img: "/images/stories/ant-grasshopper/scene1.webp" },
      { text: "قریب ہی ایک ٹڈی گانا گاتی اور اچھلتی کودتی پھرتی تھی۔ اسے سردی کی فکر نہیں تھی۔", img: "/images/stories/ant-grasshopper/scene2.webp" },
      { text: "ٹڈی نے چیونٹی سے کہا: 'اتنی محنت کیوں کرتی ہو؟ آؤ میرے ساتھ کھیلو!'۔", img: "/images/stories/ant-grasshopper/scene3.webp" },
      { text: "چیونٹی نے کہا: 'سردی آنے والی ہے، مجھے کھانا جمع کرنا ہے۔' لیکن ٹڈی ہنستی رہی۔", img: "/images/stories/ant-grasshopper/scene4.webp" },
      { text: "جب سردیاں آئیں تو زمین برف سے ڈھک گئی۔ ٹڈی کے پاس کچھ نہ تھا اور وہ بھوک سے کانپنے لگی۔", img: "/images/stories/ant-grasshopper/scene5.webp" },
      { text: "چیونٹی کے گھر میں کھانے کا ڈھیر تھا۔ وہ گرم اور خوش تھی۔ ٹڈی کو اپنی غلطی کا احساس ہوا۔", img: "/images/stories/ant-grasshopper/scene6.webp" },
      { text: "سبق: آج کی محنت کل کی آسانی ہے۔ کل پر کام مت چھوڑو — ابھی سے تیاری کرو!", ending: true },
    ],
  },
  {
    id: "fox-grapes",
    title: "لومڑی اور انگور",
    emoji: "🦊🍇",
    thumbnail: "/images/stories/fox/thumbnail.webp",
    scenes: [
      { text: "ایک دن سخت گرمی ہوئی۔ ایک بھوکی لومڑی جنگل میں گھوم رہی تھی۔ اسے کھانے کی تلاش تھی۔", img: "/images/stories/fox/scene1.webp" },
      { text: "اس نے ایک بیل پر لٹکے ہوئے خوبصورت، کالے، رسیلے انگوروں کا گچھا دیکھا۔", img: "/images/stories/fox/scene2.webp" },
      { text: "اس کے منہ میں پانی آ گیا۔ اس نے انگور توڑنے کے لیے اچھل کر کوشش کی، لیکن وہ بہت اونچے تھے۔", img: "/images/stories/fox/scene3.webp" },
      { text: "لومڑی نے بار بار چھلانگ لگائی مگر ہر بار ناکام رہی۔ وہ تھک گئی اور ہانپنے لگی۔", img: "/images/stories/fox/scene4.webp" },
      { text: "آخرکار وہ ناامید ہو گئی اور واپس مڑ گئی۔ جاتے جاتے اس نے ناک چڑھاتے ہوئے کہا:", img: "/images/stories/fox/scene5.webp" },
      { text: "'یہ انگور تو کچے اور کھٹّے ہیں! میں ایسے انگور کھاتی بھی نہیں!' — جب کہ اسے معلوم تھا کہ وہ لینے سے قاصر ہے۔", img: "/images/stories/fox/scene6.webp" },
      { text: "سبق: جو چیز ہم حاصل نہ کر سکیں اسے برا کہنا غلط ہے۔ ہمیشہ سچ بولو اور محنت جاری رکھو۔", ending: true },
    ],
  },
  {
    id: "sheep-wolf",
    title: "بھیڑیا آیا! بھیڑیا آیا!",
    emoji: "🐑🐺",
    thumbnail: "/images/stories/sheep-story/thumbnail.webp",
    scenes: [
      { text: "پہاڑ کے قریب ایک گاؤں میں احمد نام کا ایک چرواہا لڑکا رہتا تھا۔ وہ روز بھیڑیں چرانے جاتا۔", img: "/images/stories/sheep-story/scene1.webp" },
      { text: "ایک دن اسے شرارت سوجھی۔ اس نے زور سے چلّایا: 'بھیڑیا آیا! بھیڑیا آیا!'۔", img: "/images/stories/sheep-story/scene2.webp" },
      { text: "گاؤں کے لوگ لاٹھیاں لے کر بھاگے آئے۔ مگر کوئی بھیڑیا نہ تھا۔ احمد کھلکھلا کر ہنسنے لگا۔", img: "/images/stories/sheep-story/scene3.webp" },
      { text: "اگلے دن اس نے پھر وہی حرکت کی — پھر سب بھاگے آئے اور پھر ہنسا۔", img: "/images/stories/sheep-story/scene4.webp" },
      { text: "تیسرے دن سچ میں بھیڑیا آ گیا! احمد نے چلّایا: 'بھیڑیا آیا! مدد کرو!'۔", img: "/images/stories/sheep-story/scene5.webp" },
      { text: "مگر اس بار کوئی نہ آیا — کیونکہ سب سمجھتے تھے کہ وہ پھر جھوٹ بول رہا ہے۔ بھیڑیے نے بھیڑیں مار دیں۔", img: "/images/stories/sheep-story/scene6.webp" },
      { text: "احمد روتا رہا۔ اب اسے معلوم ہوا کہ جو بار بار جھوٹ بولے اس کا سچ بھی نہیں مانا جاتا۔", img: "/images/stories/sheep-story/scene7.webp" },
      { text: "سبق: ہمیشہ سچ بولو۔ جھوٹ بولنے والے کا اعتبار ختم ہو جاتا ہے۔", ending: true },
    ],
  },
  {
    id: "hardworking-farmer",
    title: "محنتی کسان",
    emoji: "👨‍🌾🌾",
    thumbnail: "/images/stories/farmer/thumbnail.webp",
    scenes: [
      { text: "ایک بوڑھے کسان کے تین بیٹے تھے۔ وہ ہر وقت آپس میں جھگڑتے رہتے تھے۔ کسان بہت پریشان تھا۔", img: "/images/stories/farmer/scene1.webp" },
      { text: "جب کسان کی وفات کا وقت قریب آیا تو اس نے تینوں کو بلایا اور تین لکڑیوں کا گٹھا دیا۔", img: "/images/stories/farmer/scene2.webp" },
      { text: "اس نے کہا: 'جو اس گٹھے کو توڑ دے اسے میری ساری جمع پونجی ملے گی!' تینوں نے کوشش کی مگر گٹھا نہ ٹوٹا۔", img: "/images/stories/farmer/scene3.webp" },
      { text: "پھر کسان نے گٹھا کھول کر ایک ایک لکڑی دی۔ تینوں نے آسانی سے لکڑی توڑ دی۔", img: "/images/stories/farmer/scene4.webp" },
      { text: "کسان نے مسکراتے ہوئے کہا: 'اکیلی لکڑی کمزور ہوتی ہے لیکن مل کر ناقابلِ شکست ہو جاتی ہیں — تم تینوں بھی ایسے ہی ہو!'", img: "/images/stories/farmer/scene5.webp" },
      { text: "تینوں بھائیوں کو اپنی غلطی کا احساس ہوا۔ انہوں نے مل کر کام کیا اور کھیت کو سر سبز و شاداب کر دیا۔", img: "/images/stories/farmer/scene6.webp" },
      { text: "سبق: اتحاد میں برکت ہے۔ ایک دوسرے کا ساتھ دو — مل کر ہر مشکل آسان ہو جاتی ہے!", ending: true },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function splitWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function toFileUrl(absPath) {
  return "file:///" + absPath.replace(/\\/g, "/").replace(/ /g, "%20");
}

/** Convert a local image file to a base64 data URI */
function imageToDataUri(absPath) {
  const data = fs.readFileSync(absPath);
  const ext = path.extname(absPath).toLowerCase();
  const mime = ext === ".webp" ? "image/webp" : ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/webp";
  return `data:${mime};base64,${data.toString("base64")}`;
}

async function ffmpeg(args) {
  try {
    const { stdout, stderr } = await execFileAsync(ffmpegPath, args, {
      maxBuffer: 50 * 1024 * 1024,
      timeout: 120000,
    });
    return { stdout, stderr };
  } catch (err) {
    console.error("  ⚠ ffmpeg error:", err.stderr?.slice(-500) || err.message);
    throw err;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ═══════════════════════════════════════════════════════════════════════════
//  HTML TEMPLATES  (system fonts only — NO external @import to avoid hangs)
// ═══════════════════════════════════════════════════════════════════════════

const BASE_CSS = `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    font-family: 'Jameel Noori Nastaleeq', 'Urdu Typesetting', 'Noto Nastaliq Urdu', 'Alvi Nastaleeq', 'Nafees Nastaleeq', 'Traditional Arabic', 'Segoe UI', serif;
  }

  .frame {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    position: relative;
    overflow: hidden;
  }

  .scene-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gradient-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 55%;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.95) 100%);
  }

  .top-overlay {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);
  }

  .title-badge {
    position: absolute;
    top: 14px; right: 20px;
    background: rgba(99,102,241,0.85);
    color: white;
    padding: 4px 18px;
    border-radius: 20px;
    font-size: 18px;
    font-weight: 700;
    direction: rtl;
    line-height: 2;
    box-shadow: 0 2px 12px rgba(99,102,241,0.4);
  }

  .scene-counter {
    position: absolute;
    top: 16px; left: 20px;
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .scene-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.35);
  }
  .scene-dot.active {
    background: #fbbf24;
    width: 24px;
    border-radius: 6px;
    box-shadow: 0 0 8px rgba(251,191,36,0.6);
  }
  .scene-dot.past { background: rgba(165,180,252,0.7); }

  .text-panel {
    position: absolute;
    bottom: 20px;
    left: 30px;
    right: 30px;
    background: rgba(15, 15, 35, 0.75);
    border: 1px solid rgba(165,180,252,0.25);
    border-radius: 20px;
    padding: 22px 30px;
    direction: rtl;
    text-align: right;
    line-height: 2.4;
    font-size: 26px;
    color: rgba(255,255,255,0.92);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .word {
    display: inline;
    padding: 1px 5px;
    border-radius: 6px;
    white-space: nowrap;
  }
  .word.active {
    background: linear-gradient(135deg, #fef08a, #fde047);
    color: #1e1b4b;
    font-weight: 700;
    font-size: 30px;
    padding: 2px 8px;
    border-radius: 8px;
    box-shadow: 0 0 16px rgba(253,224,71,0.5), 0 2px 6px rgba(0,0,0,0.2);
  }
  .word.past { color: #c7d2fe; }
  .word.future { color: rgba(255,255,255,0.85); }

  .ending-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #6d28d9 100%);
  }
  .red-ending-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #450a0a 0%, #7f1d1d 30%, #991b1b 60%, #dc2626 100%);
  }

  .ending-card {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 80%; max-width: 900px;
    background: rgba(255,255,255,0.08);
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 30px;
    padding: 40px 50px;
    text-align: center;
    direction: rtl;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }

  .ending-label {
    font-family: 'Segoe UI', sans-serif;
    font-size: 16px; font-weight: 800;
    color: rgba(255,255,255,0.5);
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .ending-emoji { font-size: 42px; margin-bottom: 12px; }
  .ending-text { font-size: 30px; line-height: 2.4; color: rgba(255,255,255,0.95); }
  .ending-text .word.active { font-size: 34px; }

  .star { position: absolute; color: rgba(255,255,255,0.15); font-size: 28px; }

  .title-card-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0f0a2e 0%, #1e1b4b 30%, #312e81 55%, #4338ca 100%);
  }
  .title-content {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center; width: 80%;
  }
  .title-brand {
    font-family: 'Segoe UI', sans-serif;
    font-size: 22px; font-weight: 800;
    color: rgba(165,180,252,0.7);
    letter-spacing: 6px;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .title-emoji-large { font-size: 64px; margin-bottom: 20px; }
  .title-text {
    font-size: 52px; font-weight: 700;
    color: white; direction: rtl; line-height: 2;
  }
  .title-divider {
    width: 120px; height: 4px;
    background: linear-gradient(90deg, transparent, #818cf8, transparent);
    border-radius: 2px; margin: 20px auto;
  }
  .title-sub {
    font-family: 'Segoe UI', sans-serif;
    font-size: 16px; color: rgba(199,210,254,0.6); letter-spacing: 2px;
  }

  .outro-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0f0a2e 0%, #1e1b4b 40%, #312e81 100%);
  }
  .outro-content {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center; width: 80%;
  }
  .outro-brand {
    font-family: 'Segoe UI', sans-serif;
    font-size: 48px; font-weight: 800;
    color: white; margin-bottom: 12px;
  }
  .outro-tagline {
    font-size: 28px; color: rgba(199,210,254,0.8);
    direction: rtl; line-height: 2; margin-bottom: 20px;
  }
  .outro-url {
    font-family: 'Segoe UI', sans-serif;
    font-size: 20px; color: rgba(165,180,252,0.6); letter-spacing: 2px;
  }
  .outro-divider {
    width: 200px; height: 3px;
    background: linear-gradient(90deg, transparent, #6366f1, transparent);
    border-radius: 2px; margin: 24px auto;
  }
</style>
`;

function sceneHTML(imgDataUri, words, title, sceneIdx, totalScenes) {
  const dots = Array.from({ length: totalScenes }, (_, i) => {
    const cls = i === sceneIdx ? "active" : i < sceneIdx ? "past" : "";
    return `<div class="scene-dot ${cls}"></div>`;
  }).join("");
  const wordSpans = words
    .map((w, i) => `<span class="word future" id="w${i}">${w} </span>`)
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${BASE_CSS}</head><body>
<div class="frame">
  <img class="scene-bg" src="${imgDataUri}" />
  <div class="top-overlay"></div>
  <div class="gradient-overlay"></div>
  <div class="title-badge">${title}</div>
  <div class="scene-counter">${dots}</div>
  <div class="text-panel">${wordSpans}</div>
</div>
</body></html>`;
}

function endingHTML(words, title, sceneIdx, totalScenes, isRed) {
  const bgClass = isRed ? "red-ending-bg" : "ending-bg";
  const wordSpans = words
    .map((w, i) => `<span class="word future" id="w${i}">${w} </span>`)
    .join("");
  const stars = [
    { top: "12%", left: "8%", s: "✦" },
    { top: "18%", right: "12%", s: "✧" },
    { top: "75%", left: "15%", s: "✦" },
    { top: "68%", right: "8%", s: "⭐" },
    { top: "25%", left: "85%", s: "✧" },
    { top: "82%", left: "45%", s: "✦" },
  ]
    .map(
      (st) =>
        `<div class="star" style="top:${st.top};${st.left ? "left:" + st.left : "right:" + st.right}">${st.s}</div>`
    )
    .join("");
  const dots = Array.from({ length: totalScenes }, (_, i) => {
    const cls = i === sceneIdx ? "active" : i < sceneIdx ? "past" : "";
    return `<div class="scene-dot ${cls}"></div>`;
  }).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${BASE_CSS}</head><body>
<div class="frame">
  <div class="${bgClass}"></div>
  ${stars}
  <div class="title-badge" style="background:rgba(255,255,255,0.12)">${title}</div>
  <div class="scene-counter">${dots}</div>
  <div class="ending-card">
    <div class="ending-label">${isRed ? "REMEMBER" : "MORAL"}</div>
    <div class="ending-emoji">${isRed ? "⚠️" : "📖"}</div>
    <div class="ending-text">${wordSpans}</div>
  </div>
</div>
</body></html>`;
}

function titleCardHTML(title, emoji, thumbnailDataUri) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${BASE_CSS}</head><body>
<div class="frame">
  ${thumbnailDataUri
    ? `<img class="scene-bg" src="${thumbnailDataUri}" />
       <div style="position:absolute;inset:0;background:rgba(0,0,0,0.45);"></div>`
    : `<div class="title-card-bg"></div>`}
  <div class="title-content">
    <div class="title-brand">ALIF UJALA</div>
    <div class="title-emoji-large">${emoji}</div>
    <div class="title-text">${title}</div>
    <div class="title-divider"></div>
    <div class="title-sub">📖 Story Time ✨</div>
  </div>
</div>
</body></html>`;
}

function outroHTML() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${BASE_CSS}</head><body>
<div class="frame">
  <div class="outro-bg"></div>
  <div class="outro-content">
    <div class="outro-brand">✨ Alif Ujala ✨</div>
    <div class="outro-tagline">سبق سیکھیں، کہانیاں سنیں</div>
    <div class="outro-divider"></div>
    <div class="outro-url">https://alifujala.ai/</div>
  </div>
</div>
</body></html>`;
}

// ═══════════════════════════════════════════════════════════════════════════
//  FRAME GENERATION
// ═══════════════════════════════════════════════════════════════════════════

async function renderSceneFrames(page, scene, sceneIdx, totalScenes, title, durationMs, storyTemp) {
  const words = splitWords(scene.text);
  const msPerWord = durationMs / Math.max(words.length, 1);
  const frameDir = path.join(storyTemp, `scene-${sceneIdx}`);
  fs.mkdirSync(frameDir, { recursive: true });

  const isEnding = !!scene.ending;
  const isRedEnding = !!scene.redEnding;

  let html;
  if (isEnding || isRedEnding) {
    html = endingHTML(words, title, sceneIdx, totalScenes, isRedEnding);
  } else {
    const imgAbs = path.join(PUBLIC, scene.img);
    const imgDataUri = imageToDataUri(imgAbs);
    html = sceneHTML(imgDataUri, words, title, sceneIdx, totalScenes);
  }

  await page.setContent(html, { waitUntil: "load", timeout: 15000 });
  await sleep(150);

  const frames = [];

  for (let w = 0; w < words.length; w++) {
    await page.evaluate((activeIdx) => {
      document.querySelectorAll(".word").forEach((el, i) => {
        if (i < activeIdx) el.className = "word past";
        else if (i === activeIdx) el.className = "word active";
        else el.className = "word future";
      });
    }, w);

    const framePath = path.join(frameDir, `w${String(w).padStart(4, "0")}.png`);
    await page.screenshot({ path: framePath, type: "png" });

    frames.push({
      path: framePath,
      durationSec: msPerWord / 1000,
    });
  }

  return frames;
}

async function renderStaticFrame(page, html, outputPath) {
  await page.setContent(html, { waitUntil: "load", timeout: 15000 });
  await sleep(150);
  await page.screenshot({ path: outputPath, type: "png" });
  return outputPath;
}

// ═══════════════════════════════════════════════════════════════════════════
//  VIDEO ASSEMBLY
// ═══════════════════════════════════════════════════════════════════════════

function writeConcatFile(frames, outputPath) {
  let content = "";
  for (const frame of frames) {
    content += `file '${frame.path.replace(/\\/g, "/")}'\n`;
    content += `duration ${frame.durationSec.toFixed(4)}\n`;
  }
  if (frames.length > 0) {
    content += `file '${frames[frames.length - 1].path.replace(/\\/g, "/")}'\n`;
  }
  fs.writeFileSync(outputPath, content, "utf8");
  return outputPath;
}

async function assembleSceneClip(frames, audioPath, outputPath) {
  const concatFile = outputPath.replace(".mp4", "-concat.txt");
  writeConcatFile(frames, concatFile);

  await ffmpeg([
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatFile,
    "-i", audioPath,
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-ar", "44100",
    "-ac", "2",
    "-shortest",
    "-movflags", "+faststart",
    outputPath,
  ]);
}

async function createSilentClip(imagePath, durationSec, outputPath) {
  await ffmpeg([
    "-y",
    "-loop", "1",
    "-i", imagePath,
    "-f", "lavfi",
    "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "23",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-ar", "44100",
    "-ac", "2",
    "-t", String(durationSec),
    "-shortest",
    "-movflags", "+faststart",
    outputPath,
  ]);
}

async function concatenateClips(clipPaths, outputPath) {
  // Convert each clip to .ts (MPEG Transport Stream) for reliable concat
  const tsPaths = [];
  for (let i = 0; i < clipPaths.length; i++) {
    const tsPath = clipPaths[i].replace(".mp4", ".ts");
    await ffmpeg([
      "-y",
      "-i", clipPaths[i],
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "23",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "128k",
      "-ar", "44100",
      "-ac", "2",
      "-bsf:v", "h264_mp4toannexb",
      "-f", "mpegts",
      tsPath,
    ]);
    tsPaths.push(tsPath);
  }

  // Concat via concat protocol (joins TS streams seamlessly)
  const concatInput = "concat:" + tsPaths.map((p) => p.replace(/\\/g, "/")).join("|");

  await ffmpeg([
    "-y",
    "-i", concatInput,
    "-c", "copy",
    "-movflags", "+faststart",
    outputPath,
  ]);

  // Clean up .ts files
  for (const ts of tsPaths) {
    try { fs.unlinkSync(ts); } catch {}
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  const startTime = Date.now();
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║   📖  Alif Ujala — Story Video Generator  📖       ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log(`  Voice: ${VOICE} | Resolution: ${WIDTH}x${HEIGHT}`);
  console.log(`  Output: ${OUTPUT}\n`);

  fs.mkdirSync(TEMP, { recursive: true });
  fs.mkdirSync(OUTPUT, { recursive: true });

  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
      "--allow-file-access-from-files",
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
  console.log("  ✓ Browser ready\n");

  // Pre-render outro card
  const outroImagePath = path.join(TEMP, "outro.png");
  await renderStaticFrame(page, outroHTML(), outroImagePath);
  console.log("  ✓ Outro frame cached\n");

  const storiesToProcess = ONLY_STORY
    ? stories.filter((s) => s.id === ONLY_STORY)
    : stories;

  if (storiesToProcess.length === 0) {
    console.error(`Story "${ONLY_STORY}" not found!`);
    await browser.close();
    process.exit(1);
  }

  for (let si = 0; si < storiesToProcess.length; si++) {
    const story = storiesToProcess[si];
    const storyTemp = path.join(TEMP, story.id);
    fs.mkdirSync(storyTemp, { recursive: true });

    console.log(`\n${"═".repeat(56)}`);
    console.log(`📖  [${si + 1}/${storiesToProcess.length}] ${story.title}  (${story.id})`);
    console.log(`${"═".repeat(56)}`);

    const metaPath = path.join(PUBLIC, "sounds", "stories", story.id, "meta.json");
    if (!fs.existsSync(metaPath)) {
      console.log("  ⚠ No meta.json, skipping...");
      continue;
    }
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    const durations = meta[VOICE];
    if (!durations) {
      console.log(`  ⚠ No ${VOICE} voice, skipping...`);
      continue;
    }

    const allClips = [];

    // 1. Title card
    process.stdout.write("  🎬 Title card...");
    const titleImgPath = path.join(storyTemp, "title.png");
    const thumbDataUri = story.thumbnail ? imageToDataUri(path.join(PUBLIC, story.thumbnail)) : null;
    await renderStaticFrame(page, titleCardHTML(story.title, story.emoji, thumbDataUri), titleImgPath);
    const titleClipPath = path.join(storyTemp, "clip-title.mp4");
    await createSilentClip(titleImgPath, 3, titleClipPath);
    allClips.push(titleClipPath);
    console.log(" ✓");

    // 2. Scene clips
    for (let s = 0; s < story.scenes.length; s++) {
      const scene = story.scenes[s];
      const duration = durations[s];
      if (!duration) {
        console.log(`  ⚠ Scene ${s}: no duration, skip`);
        continue;
      }

      const words = splitWords(scene.text);
      process.stdout.write(`  🎨 Scene ${s + 1}/${story.scenes.length} [${words.length}w ${(duration/1000).toFixed(1)}s]...`);

      if (scene.img) {
        const imgPath = path.join(PUBLIC, scene.img);
        if (!fs.existsSync(imgPath)) {
          scene.img = null;
          scene.ending = true;
        }
      }

      const frames = await renderSceneFrames(page, scene, s, story.scenes.length, story.title, duration, storyTemp);

      const audioPath = path.join(PUBLIC, "sounds", "stories", story.id, `scene-${s}-${VOICE}.mp3`);
      const clipPath = path.join(storyTemp, `clip-${String(s).padStart(2, "0")}.mp4`);

      if (fs.existsSync(audioPath)) {
        await assembleSceneClip(frames, audioPath, clipPath);
        allClips.push(clipPath);
        console.log(" ✓");
      } else {
        await createSilentClip(frames[0].path, duration / 1000, clipPath);
        allClips.push(clipPath);
        console.log(" ✓ (silent)");
      }
    }

    // 3. Outro
    process.stdout.write("  🎬 Outro...");
    const outroClipPath = path.join(storyTemp, "clip-outro.mp4");
    await createSilentClip(outroImagePath, 3, outroClipPath);
    allClips.push(outroClipPath);
    console.log(" ✓");

    // 4. Concatenate
    process.stdout.write("  🎞️  Joining clips...");
    const outputPath = path.join(OUTPUT, `${story.id}.mp4`);
    await concatenateClips(allClips, outputPath);
    const sizeMB = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(1);
    console.log(` ✅ ${story.id}.mp4 (${sizeMB} MB)`);
  }

  await browser.close();
  console.log("\n🧹 Cleaning temp...");
  fs.rmSync(TEMP, { recursive: true, force: true });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n╔══════════════════════════════════════════════════════╗`);
  console.log(`║   🎉  All done in ${elapsed}s!  🎉                       ║`);
  console.log(`╚══════════════════════════════════════════════════════╝`);
  console.log(`📁 ${OUTPUT}`);
  storiesToProcess.forEach((s) => console.log(`   • ${s.id}.mp4`));
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
