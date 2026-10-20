import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import alphabetsData from '@/data/alphabets.json';

const ALL_LETTERS = alphabetsData.letters;

export default function UrduBalloonPop() {
  const [targetLetter, setTargetLetter] = useState(ALL_LETTERS[0]);
  const [balloons, setBalloons] = useState<Array<{ id: number; letter: any; left: string; color: string }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-400', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
  ];

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setIsPlaying(true);
    setGameOver(false);
    setBalloons([]);
    pickNewTarget();
  };

  const pickNewTarget = () => {
    const randomLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
    setTargetLetter(randomLetter);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
      setBalloons([]);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Spawn balloons
  useEffect(() => {
    let spawnInterval: NodeJS.Timeout;
    if (isPlaying) {
      spawnInterval = setInterval(() => {
        setBalloons((prev) => {
          const newId = Date.now();
          const leftPercent = Math.random() * 80 + 10; // 10% to 90%
          const showTarget = Math.random() > 0.4;
          const letter = showTarget ? targetLetter : ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return [...prev, { id: newId, letter, left: `${leftPercent}%`, color }];
        });
      }, 1200);
    }
    return () => clearInterval(spawnInterval);
  }, [isPlaying, targetLetter]);

  // Remove old balloons automatically (they float up out of screen due to CSS mostly, but we should clear memory)
  useEffect(() => {
    if (isPlaying) {
      const cleanupInterval = setInterval(() => {
        setBalloons((prev) => prev.filter(b => Date.now() - b.id < 6000)); // Remove balloons after 6s
      }, 2000);
      return () => clearInterval(cleanupInterval);
    }
  }, [isPlaying]);

  const handlePop = (id: number, letter: any) => {
    if (!isPlaying) return;

    if (letter.char === targetLetter.char) {
      setScore((s) => s + 15);
      pickNewTarget();
    } else {
      setScore((s) => Math.max(0, s - 5));
    }

    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="kids-page-bg arcade-page min-h-screen flex flex-col font-sans relative">
      <Head>
        <title>Balloon Pop | Urdu Games</title>
        <style>{`
          @keyframes floatUp {
            0% { transform: translateY(100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-20vh); opacity: 0; }
          }
          .balloon-anim {
            animation: floatUp 6s linear forwards;
          }
        `}</style>
      </Head>
      <Navbar />

      <main className="flex-1 relative flex flex-col items-center p-4 pt-24 pb-8 w-full max-w-5xl mx-auto min-h-[calc(100dvh-76px)]">
        {/* Game UI Overlay */}
        <div className="w-full z-20 flex-shrink-0 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl relative">
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl text-white font-bold mb-1 shadow-sm" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>🎈 Balloon Pop</h1>
            <p className="text-white/80 font-medium">Pop balloons with the correct letter</p>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <span className="block text-sm text-white/70 uppercase tracking-widest">Score</span>
              <span className="text-3xl font-bold text-yellow-400">{score}</span>
            </div>
            
            <div className="text-center p-3 bg-purple-600/40 rounded-xl border border-purple-400/50 min-w-[120px]">
              <span className="block text-sm text-white/80 uppercase">Target</span>
              <span className="text-4xl text-white font-bold">{targetLetter.char}</span>
            </div>

            <div className="text-center">
              <span className="block text-sm text-white/70 uppercase tracking-widest">Time</span>
              <span className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            {!isPlaying && !gameOver && (
              <button onClick={startGame} className="bg-gradient-to-r from-green-400 to-emerald-600 hover:scale-105 text-white px-8 py-3 rounded-full text-xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                Start Game
              </button>
            )}
            {gameOver && (
              <button onClick={startGame} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 text-white px-8 py-3 rounded-full text-xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                Play Again
              </button>
            )}
          </div>
        </div>

        {gameOver && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 z-20 text-center shadow-2xl border-4 border-purple-500">
             <h2 className="text-4xl text-purple-600 font-bold mb-4" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Time's Up!</h2>
             <p className="text-2xl text-gray-700 mb-6">You popped <strong>{score}</strong> points!</p>
             <button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-xl shadow-lg font-bold">
                Play Again
             </button>
          </div>
        )}

        {/* Play Area */}
        <div className="relative mt-4 w-full flex-1 min-h-[360px] md:min-h-[520px] overflow-hidden pointer-events-none border-t-2 border-white/[0.15] rounded-2xl">
           {balloons.map((b) => (
             <div 
               key={b.id}
               className={`balloon-anim absolute ${b.color} w-20 h-24 rounded-full shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer pointer-events-auto transform hover:scale-110 active:scale-90 transition-transform`}
               style={{ left: b.left, borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}
               onClick={() => handlePop(b.id, b.letter)}
             >
               <div className="text-white text-4xl font-bold drop-shadow-md pb-2">{b.letter.char}</div>
               {/* Balloon tie */}
               <div className={`absolute -bottom-2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent ${b.color.replace('bg-', 'border-b-')}`} style={{ filter: 'brightness(0.9)' }}></div>
               {/* String */}
               <div className="absolute -bottom-10 w-[1px] h-10 bg-white/50"></div>
             </div>
           ))}
        </div>

      </main>

      {!isPlaying && <Footer />}
    </div>
  );
}