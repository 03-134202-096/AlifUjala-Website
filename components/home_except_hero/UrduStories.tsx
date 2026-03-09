"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

const STORIES = [
  {
    id: "rabbit-turtle",
    title: "خرگوش اور کچھوا",
    content:
      "ایک دن خرگوش اور کچھوا دوڑ لگانے نکلے۔ خرگوش بہت تیز بھاگا اور آگے نکل گیا، لیکن وہ راستے میں سو گیا۔ کچھوا آہستہ آہستہ چلتا رہا اور جیت گیا۔ سبق: سست روی سے لیکن مستقل مزاجی سے کامیابی حاصل ہوتی ہے۔",
  },
  {
    id: "lion-fox",
    title: "شیر اور چالاک لومڑی",
    content:
      "ایک دفعہ کا ذکر ہے کہ ایک شیر جنگل کا بادشاہ تھا۔ وہ ہر جانور کو دھمکاتا۔ ایک دن لومڑی نے چالاکی سے شیر کو کنویں میں گرا دیا۔ سبق: عقل طاقت سے بڑی ہوتی ہے۔",
  },
  {
    id: "crow-water",
    title: "کوا اور پانی",
    content:
      "گرمی کا موسم تھا اور ایک پیاسا کوا پانی کی تلاش میں تھا۔ اسے ایک گھڑا ملا جس میں تھوڑا سا پانی تھا۔ کوا کنکر ڈال کر پانی کو اوپر لایا اور اپنی پیاس بجھائی۔ سبق: محنت کا پھل ملتا ہے۔",
  },
  {
    id: "greedy-dog",
    title: "لالچی کتا",
    content:
      "ایک کتے کو ہڈی ملی اور وہ خوشی سے گھر کی طرف بھاگا۔ راستے میں ایک پل پر اسے پانی میں اپنا عکس نظر آیا۔ اس نے سمجھا کہ کوئی اور کتا ہڈی لیے ہوئے ہے۔ اس نے بھونکا اور اپنی ہڈی گنوا بیٹھا۔ سبق: لالچ بری بلا ہے۔",
  },
  {
    id: "ant-grasshopper",
    title: "چیونٹی اور ٹڈی",
    content:
      "گرمیوں میں چیونٹی نے دن رات محنت کر کے خوراک جمع کی۔ ٹڈی گاتی اور ناچتی رہی۔ جب سردیاں آئیں تو ٹڈی بھوکی رہی لیکن چیونٹی آرام سے رہی۔ سبق: محنت آج کرو، کل کی فکر آج سے کرو۔",
  },
];

// Split Urdu text into individual words (split on whitespace)
function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

type TTSStatus = "idle" | "loading" | "playing" | "error";

interface StoryTTSState {
  status: TTSStatus;
  activeWord: number; // index of currently highlighted word (-1 = none)
  error?: string;
}

export default function UrduStories() {
  const [open, setOpen] = useState<number | null>(null);

  // Per-story TTS state
  const [tts, setTts] = useState<Record<number, StoryTTSState>>({});

  // Audio element refs per story index
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});
  // Tracking interval ref per story
  const intervalRefs = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  const stop = useCallback((idx: number) => {
    const audio = audioRefs.current[idx];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    clearInterval(intervalRefs.current[idx]);
    setTts((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] ?? {}), status: "idle", activeWord: -1 },
    }));
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      Object.keys(audioRefs.current).forEach((k) => {
        const idx = Number(k);
        const audio = audioRefs.current[idx];
        if (audio) { audio.pause(); }
        clearInterval(intervalRefs.current[idx]);
      });
    };
  }, []);

  const handleSpeak = useCallback(
    async (idx: number, story: typeof STORIES[0]) => {
      // If already playing this story → stop
      if (tts[idx]?.status === "playing") {
        stop(idx);
        return;
      }

      // Stop any other playing story first
      Object.keys(tts).forEach((k) => {
        if (Number(k) !== idx && tts[Number(k)]?.status === "playing") {
          stop(Number(k));
        }
      });

      setTts((prev) => ({
        ...prev,
        [idx]: { status: "loading", activeWord: -1 },
      }));

      // Make sure the story is expanded so user can see word highlighting
      setOpen(idx);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: story.content, id: story.id }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }

        const { audioUrl, duration } = (await res.json()) as {
          audioUrl: string;
          duration: number;
        };

        const words = splitWords(story.content);
        const msPerWord = duration > 0 ? duration / words.length : 500;

        // Build (or reuse) audio element
        let audio = audioRefs.current[idx];
        if (!audio) {
          audio = new Audio();
          audioRefs.current[idx] = audio;
        }
        audio.src = audioUrl + "?t=" + Date.now(); // bust cache if re-generated
        audio.load();

        setTts((prev) => ({
          ...prev,
          [idx]: { status: "playing", activeWord: 0 },
        }));

        // Start word-by-word highlighting tied to audio.currentTime
        clearInterval(intervalRefs.current[idx]);
        intervalRefs.current[idx] = setInterval(() => {
          if (!audio) return;
          const ct = audio.currentTime * 1000; // ms
          const wordIdx = Math.min(
            Math.floor(ct / msPerWord),
            words.length - 1,
          );
          setTts((prev) => ({
            ...prev,
            [idx]: { ...(prev[idx] ?? { status: "playing" as const, activeWord: -1 }), activeWord: wordIdx },
          }));
        }, 80);

        audio.onended = () => {
          clearInterval(intervalRefs.current[idx]);
          setTts((prev) => ({
            ...prev,
            [idx]: { status: "idle", activeWord: -1 },
          }));
        };

        audio.onerror = () => {
          clearInterval(intervalRefs.current[idx]);
          setTts((prev) => ({
            ...prev,
            [idx]: { status: "error", activeWord: -1, error: "Audio playback failed" },
          }));
        };

        await audio.play();
      } catch (err: any) {
        clearInterval(intervalRefs.current[idx]);
        setTts((prev) => ({
          ...prev,
          [idx]: { status: "error", activeWord: -1, error: err.message },
        }));
      }
    },
    [tts, stop],
  );

  return (
    <div className="mt-20 grid grid-cols-1 gap-6 text-right" dir="rtl">
      {STORIES.map((story, idx) => {
        const storyTts = tts[idx] ?? { status: "idle", activeWord: -1 };
        const isPlaying = storyTts.status === "playing";
        const isLoading = storyTts.status === "loading";
        const words = splitWords(story.content);

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-md border border-yellow-300 p-4 relative overflow-hidden"
          >
            {/* Header row */}
            <div className="flex justify-between items-center mb-2" dir="rtl">
              <h2 className="text-xl font-bold text-pink-700">{story.title}</h2>

              <div className="flex items-center gap-2">
                {/* 🔊 TTS Speak Button */}
                <button
                  title={isPlaying ? "روکیں" : "سنیں"}
                  disabled={isLoading}
                  onClick={() => handleSpeak(idx, story)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full shadow transition-all
                    ${isPlaying
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : isLoading
                      ? "bg-yellow-400 text-white cursor-wait"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
                >
                  {isLoading ? (
                    // spinner SVG
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : isPlaying ? (
                    // stop square
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    // speaker / play icon
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0013 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Read / Hide button */}
                <button
                  className="bg-pink-500 text-white px-4 py-1 rounded-full hover:bg-pink-600 transition text-sm"
                  onClick={() => setOpen(open === idx ? null : idx)}
                >
                  {open === idx ? "چھپائیں" : "پڑھیں"}
                </button>
              </div>
            </div>

            {/* Error banner */}
            {storyTts.status === "error" && storyTts.error && (
              <p className="text-xs text-red-500 mb-1 text-right">
                ⚠️ {storyTts.error}
              </p>
            )}

            {/* Expanded text with word-by-word highlighting */}
            {open === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-2"
              >
                <p
                  className="text-lg leading-loose text-gray-800"
                  dir="rtl"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: "2.4" }}
                >
                  {words.map((word, wi) => (
                    <span
                      key={wi}
                      className={`transition-all duration-150 rounded px-0.5 mx-0.5 inline-block ${
                        isPlaying && storyTts.activeWord === wi
                          ? "bg-yellow-300 text-gray-900 scale-110 font-bold shadow-sm"
                          : isPlaying && wi < storyTts.activeWord
                          ? "text-indigo-600"
                          : "text-gray-800"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              </motion.div>
            )}

            {/* "Playing…" indicator when audio is on but story is collapsed */}
            {isPlaying && open !== idx && (
              <p className="text-xs text-indigo-500 mt-1 animate-pulse text-right">
                🔊 آواز چل رہی ہے…
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
