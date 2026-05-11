import React, { useState, useEffect, useRef, useCallback } from "react";

type Scene = {
  text: string;
  img?: string;
  ending?: boolean;
  redEnding?: boolean;
};

interface VisualStoryProps {
  onClose: () => void;
  title: string;
  scenes: Scene[];
  storyId: string;
  onPlayVideo?: () => void;
}

type Voice = "male" | "female";

interface Meta {
  male: number[];
  female: number[];
}

function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
const IconPlay = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconStop = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);
const IconSpeaker = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0013 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

/* ── Male avatar + ♂ badge ── */
const IconMale = () => (
  <svg viewBox="0 0 44 44" className="w-8 h-8" fill="none">
    {/* head */}
    <circle cx="18" cy="13" r="7" fill="currentColor" opacity="0.85" />
    {/* shoulders */}
    <path d="M4 38c0-7.732 6.268-12 14-12s14 4.268 14 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
    {/* ♂ badge circle */}
    <circle cx="35" cy="10" r="8" fill="#4f46e5" />
    {/* ♂ symbol inside badge */}
    <circle cx="33.5" cy="11.5" r="3.5" stroke="white" strokeWidth="1.6" fill="none" />
    <line x1="36.2" y1="8.8" x2="40" y2="5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    <polyline points="37.5,5 40,5 40,7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ── Female avatar + ♀ badge ── */
const IconFemale = () => (
  <svg viewBox="0 0 44 44" className="w-8 h-8" fill="none">
    {/* head */}
    <circle cx="18" cy="13" r="7" fill="currentColor" opacity="0.85" />
    {/* hair arc */}
    <path d="M11 12 Q10 5 18 5 Q26 5 25 12" fill="currentColor" opacity="0.85" />
    {/* shoulders */}
    <path d="M4 38c0-7.732 6.268-12 14-12s14 4.268 14 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
    {/* ♀ badge circle */}
    <circle cx="35" cy="10" r="8" fill="#ec4899" />
    {/* ♀ symbol inside badge */}
    <circle cx="35" cy="7.5" r="3.5" stroke="white" strokeWidth="1.6" fill="none" />
    <line x1="35" y1="11" x2="35" y2="16.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="32.5" y1="14" x2="37.5" y2="14" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// ── Per-scene Play / Pause / Resume button (icon only) ─────────────────────
function SceneBtn({
  state,
  onPlay, onPause, onResume,
}: {
  state: "idle" | "playing" | "paused";
  onPlay: () => void; onPause: () => void; onResume: () => void;
}) {
  if (state === "playing") {
    return (
      <button
        onClick={onPause}
        title="Pause"
        className="flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all bg-amber-400 hover:bg-amber-500 text-gray-900 hover:scale-110 active:scale-95"
      >
        <IconPause className="w-4 h-4" />
      </button>
    );
  }
  if (state === "paused") {
    return (
      <button
        onClick={onResume}
        title="Resume"
        className="flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all bg-green-400 hover:bg-green-500 text-white hover:scale-110 active:scale-95"
      >
        <IconPlay className="w-4 h-4" />
      </button>
    );
  }
  return (
    <button
      onClick={onPlay}
      title="Play"
      className="flex items-center justify-center w-8 h-8 rounded-full shadow-md transition-all bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-800/80 dark:hover:bg-indigo-700 dark:text-indigo-100 hover:scale-110 active:scale-95"
    >
      <IconSpeaker className="w-4 h-4" />
    </button>
  );
}

const VisualStory: React.FC<VisualStoryProps> = ({ onClose, title, scenes, storyId, onPlayVideo }) => {
  const [voice, setVoice]             = useState<Voice>("male");
  const [playing, setPlaying]         = useState(false);  // session active
  const [paused, setPaused]           = useState(false);  // audio paused mid-session
  const [activeScene, setActiveScene] = useState(-1);
  const [activeWord, setActiveWord]   = useState(-1);
  const [meta, setMeta]               = useState<Meta | null>(null);

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sceneRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const stoppedRef  = useRef(false);
  const msPWRef     = useRef(0); // ms-per-word for current scene (used by interval)

  // ── Load pre-generated durations metadata ──────────────────────────────
  useEffect(() => {
    fetch(`/sounds/stories/${storyId}/meta.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setMeta(d))
      .catch(() => {});
  }, [storyId]);

  useEffect(() => { return () => { doStop(); }; }, []); // eslint-disable-line

  // ── Stop (full reset) ─────────────────────────────────────────────────
  const doStop = useCallback(() => {
    stoppedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setPlaying(false);
    setPaused(false);
    setActiveScene(-1);
    setActiveWord(-1);
  }, []);

  // ── Pause ─────────────────────────────────────────────────────────────
  const doPause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    audioRef.current?.pause();
    setPaused(true);
  }, []);

  // ── Resume ────────────────────────────────────────────────────────────
  const doResume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!audioRef.current) return;
      const wi = Math.min(Math.floor((audioRef.current.currentTime * 1000) / msPWRef.current), 9999);
      setActiveWord(wi);
    }, 80);
    audio.play().catch(() => {});
  }, []);

  // ── Play a single scene; resolves when audio finishes ─────────────────
  const playScene = useCallback(
    (sceneIdx: number, v: Voice, m: Meta): Promise<void> =>
      new Promise<void>((resolve) => {
        if (stoppedRef.current) { resolve(); return; }
        const duration = m[v]?.[sceneIdx];
        if (!duration) { resolve(); return; }

        const url   = `/sounds/stories/${storyId}/scene-${sceneIdx}-${v}.mp3`;
        const words = splitWords(scenes[sceneIdx].text);
        const msPW  = duration / Math.max(words.length, 1);
        msPWRef.current = msPW;

        setActiveScene(sceneIdx);
        setActiveWord(0);
        setPaused(false);
        sceneRefs.current[sceneIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });

        const audio = new Audio(url);
        audioRef.current = audio;

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          if (!audioRef.current) return;
          const wi = Math.min(Math.floor((audioRef.current.currentTime * 1000) / msPW), words.length - 1);
          setActiveWord(wi);
        }, 80);

        const finish = () => { if (intervalRef.current) clearInterval(intervalRef.current); resolve(); };
        audio.onended = finish;
        audio.onerror = finish;
        audio.play().catch(finish);
      }),
    [storyId, scenes],
  );

  // ── Play entire story ─────────────────────────────────────────────────
  const handlePlayAll = useCallback(async () => {
    if (!meta) return;
    if (playing) { doStop(); return; }
    stoppedRef.current = false;
    setPlaying(true);
    for (let i = 0; i < scenes.length; i++) {
      if (stoppedRef.current) break;
      await playScene(i, voice, meta);
      if (stoppedRef.current) break;
      await new Promise<void>((r) => setTimeout(r, 350));
    }
    if (!stoppedRef.current) { setPlaying(false); setPaused(false); setActiveScene(-1); setActiveWord(-1); }
  }, [meta, playing, voice, scenes, playScene, doStop]);

  // ── Play single scene ─────────────────────────────────────────────────
  const handlePlayScene = useCallback(
    async (idx: number) => {
      if (!meta) return;
      doStop();
      await new Promise<void>((r) => setTimeout(r, 80));
      stoppedRef.current = false;
      setPlaying(true);
      await playScene(idx, voice, meta);
      if (!stoppedRef.current) { setPlaying(false); setPaused(false); setActiveScene(-1); setActiveWord(-1); }
    },
    [meta, voice, playScene, doStop],
  );

  const hasAudio = meta !== null;

  // Derive per-scene button state
  const sceneState = (idx: number): "idle" | "playing" | "paused" => {
    if (activeScene !== idx) return "idle";
    if (paused) return "paused";
    if (playing) return "playing";
    return "idle";
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full relative border-2 border-purple-200 dark:border-purple-800 overflow-y-auto"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-purple-100 dark:border-purple-900 px-6 pt-4 pb-3 rounded-t-3xl">
          <button
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-base font-bold hover:bg-indigo-700 hover:scale-110 transition-all shadow-lg"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <h2
            className="font-extrabold text-2xl text-indigo-700 dark:text-purple-300 text-center pr-10"
            style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl", lineHeight: "2" }}
          >
            {title}
          </h2>

          {/* Watch Video button */}
          {onPlayVideo && (
            <div className="flex justify-center mt-2">
              <button
                onClick={onPlayVideo}
                title="Watch Video"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Video</span>
              </button>
            </div>
          )}

          {/* ── Audio control bar ── */}
          {hasAudio && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">

              {/* Voice selector — clear labelled pills */}
              <div className="flex gap-2" role="group" aria-label="Choose narrator voice">
                <button
                  onClick={() => { doStop(); setVoice("male"); }}
                  title="Boy / Male voice (مرد)"
                  aria-pressed={voice === "male"}
                  className={`relative flex items-center gap-1.5 px-3 h-11 rounded-full border-2 transition-all shadow-sm select-none font-bold text-sm ${
                    voice === "male"
                      ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-blue-500 text-white scale-105 shadow-md shadow-indigo-300/60"
                      : "border-indigo-200 dark:border-indigo-700 bg-white dark:bg-gray-800 text-indigo-700 dark:text-indigo-200 hover:border-indigo-400 hover:scale-105"
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden>👦</span>
                  <span style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Boy</span>
                </button>

                <button
                  onClick={() => { doStop(); setVoice("female"); }}
                  title="Girl / Female voice (عورت)"
                  aria-pressed={voice === "female"}
                  className={`relative flex items-center gap-1.5 px-3 h-11 rounded-full border-2 transition-all shadow-sm select-none font-bold text-sm ${
                    voice === "female"
                      ? "border-pink-500 bg-gradient-to-br from-pink-500 to-rose-500 text-white scale-105 shadow-md shadow-pink-300/60"
                      : "border-pink-200 dark:border-pink-700/60 bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-200 hover:border-pink-400 hover:scale-105"
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden>👧</span>
                  <span style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Girl</span>
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

              {/* Play / Pause / Stop whole story — icons only */}
              <div className="flex items-center gap-2">
                {!playing ? (
                  /* Play all */
                  <button
                    onClick={handlePlayAll}
                    title="Play Full Story"
                    className="flex items-center justify-center w-11 h-11 rounded-2xl shadow-md transition-all bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-110 active:scale-95"
                  >
                    <IconSpeaker className="w-5 h-5" />
                  </button>
                ) : paused ? (
                  <>
                    {/* Resume */}
                    <button
                      onClick={doResume}
                      title="Resume"
                      className="flex items-center justify-center w-11 h-11 rounded-2xl shadow-md transition-all bg-gradient-to-br from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white hover:scale-110 active:scale-95"
                    >
                      <IconPlay className="w-5 h-5" />
                    </button>
                    {/* Stop */}
                    <button
                      onClick={doStop}
                      title="Stop"
                      className="flex items-center justify-center w-11 h-11 rounded-2xl shadow-md transition-all bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 hover:scale-110 active:scale-95"
                    >
                      <IconStop className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Pause */}
                    <button
                      onClick={doPause}
                      title="Pause"
                      className="flex items-center justify-center w-11 h-11 rounded-2xl shadow-md transition-all bg-gradient-to-br from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white hover:scale-110 active:scale-95"
                    >
                      <IconPause className="w-5 h-5" />
                    </button>
                    {/* Stop */}
                    <button
                      onClick={doStop}
                      title="Stop"
                      className="flex items-center justify-center w-11 h-11 rounded-2xl shadow-md transition-all bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200 hover:scale-110 active:scale-95"
                    >
                      <IconStop className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Scene progress — dot only */}
              {playing && activeScene >= 0 && (
                <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 rounded-full px-2.5 py-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    paused ? "bg-amber-400" : "bg-green-500 animate-pulse"
                  }`} />
                  <span className="text-xs font-bold tabular-nums text-indigo-600 dark:text-indigo-300">
                    {activeScene + 1}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Scenes ── */}
        <div className="space-y-8 p-6">
          {scenes.map((scene, idx) => {
            const isAct  = activeScene === idx;
            const sState = sceneState(idx);
            const words  = splitWords(scene.text);

            // Use stable word spans that do NOT shift layout:
            // – display stays inline (default <span>), no scale, no margin changes
            // – trailing space inside the span avoids needing mx gaps
            // – only color/background change → zero layout reflow
            const textNode = hasAudio && isAct ? (
              <span>
                {words.map((w, wi) => (
                  <span
                    key={wi}
                    style={{
                      background: wi === activeWord ? "#fef08a" : "transparent",
                      color:
                        wi === activeWord
                          ? "#111"
                          : wi < activeWord
                          ? "#6366f1"
                          : "inherit",
                      fontWeight: wi === activeWord ? "bold" : "inherit",
                      borderRadius: "3px",
                      padding: "0 2px",
                      transition: "background 0.1s, color 0.1s",
                    }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </span>
            ) : (
              <span>{scene.text}</span>
            );

            /* ── ending card (indigo) ── */
            if (scene.ending) {
              return (
                <div
                  key={idx}
                  ref={(el) => { sceneRefs.current[idx] = el; }}
                  className={`rounded-2xl transition-shadow ${
                    isAct ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  <div
                    className="relative w-full text-center text-lg text-indigo-900 dark:text-indigo-200 font-bold bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-2xl p-6 pb-10 shadow-md border border-indigo-200 dark:border-indigo-700"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl", lineHeight: "2.2" }}
                  >
                    {textNode}
                    {hasAudio && (
                      <span className="absolute bottom-2 left-3">
                        <SceneBtn
                          state={sState}
                          onPlay={() => handlePlayScene(idx)}
                          onPause={doPause}
                          onResume={doResume}
                        />
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            /* ── ending card (red) ── */
            if (scene.redEnding) {
              return (
                <div
                  key={idx}
                  ref={(el) => { sceneRefs.current[idx] = el; }}
                  className={`rounded-2xl transition-shadow ${
                    isAct ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  <div
                    className="relative w-full text-center text-lg text-red-800 dark:text-red-300 font-bold bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/60 dark:to-rose-950/60 rounded-2xl p-6 pb-10 shadow-md border border-red-200 dark:border-red-700"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl", lineHeight: "2.2" }}
                  >
                    {textNode}
                    {hasAudio && (
                      <span className="absolute bottom-2 left-3">
                        <SceneBtn
                          state={sState}
                          onPlay={() => handlePlayScene(idx)}
                          onPause={doPause}
                          onResume={doResume}
                        />
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            /* ── normal scene (image + text, alternating sides) ── */
            return (
              <div
                key={idx}
                ref={(el) => { sceneRefs.current[idx] = el; }}
                className={`flex flex-col md:flex-row items-stretch gap-5 rounded-2xl transition-shadow ${
                  isAct ? "ring-2 ring-yellow-400" : ""
                } ${idx % 2 === 0 ? "" : "md:flex-row-reverse"}`}
              >
                {/* Text block — fixed size, no layout shift, speaker button inside */}
                <div className={`${scene.img ? "md:w-1/2" : "w-full"} w-full`}>
                  <div
                    className="relative h-full min-h-[120px] text-gray-800 dark:text-gray-200 text-lg text-right bg-white/70 dark:bg-gray-800/70 rounded-2xl p-4 pb-10 shadow-sm border border-gray-100 dark:border-gray-700"
                    style={{ fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif", direction: "rtl", lineHeight: "2.3" }}
                  >
                    {textNode}
                    {hasAudio && (
                      <span className="absolute bottom-2 left-3">
                        <SceneBtn
                          state={sState}
                          onPlay={() => handlePlayScene(idx)}
                          onPause={doPause}
                          onResume={doResume}
                        />
                      </span>
                    )}
                  </div>
                </div>

                {/* Image — fixed dimensions, never shrinks */}
                {scene.img ? (
                  <div className="md:w-1/2 w-full flex-shrink-0">
                    <img
                      src={scene.img}
                      alt={`Scene ${idx + 1}`}
                      className="w-full h-48 md:h-full object-cover rounded-2xl shadow-md bg-gray-50 dark:bg-gray-800"
                      style={{ minHeight: "160px", maxHeight: "260px" }}
                    />
                  </div>
                ) : (
                  /* text-only scene: full width */
                  <></>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VisualStory;
