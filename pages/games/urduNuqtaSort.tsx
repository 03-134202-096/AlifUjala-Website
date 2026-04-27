import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import alphabetsData from '@/data/alphabets.json';

const ALL_LETTERS = alphabetsData.letters;

export default function UrduNuqtaSort() {
  const [currentLetter, setCurrentLetter] = useState(ALL_LETTERS[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flash, setFlash] = useState<'green' | 'red' | null>(null);

  // Urdu letters with Nuqta (dots)
  const NUQTA_LETTERS = ["ب", "پ", "ت", "ث", "ج", "چ", "خ", "ذ", "ز", "ژ", "ش", "ض", "ظ", "غ", "ف", "ق", "ن"];

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setIsPlaying(true);
    setGameOver(false);
    nextLetter();
  };

  const nextLetter = () => {
    const randomLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
    setCurrentLetter(randomLetter);
    setFlash(null);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleSort = (choice: 'nuqta' | 'no-nuqta') => {
    if (!isPlaying) return;

    const hasNuqta = NUQTA_LETTERS.includes(currentLetter.char);
    const isCorrect = (choice === 'nuqta' && hasNuqta) || (choice === 'no-nuqta' && !hasNuqta);

    if (isCorrect) {
      setScore(s => s + 10);
      setFlash('green');
    } else {
      setScore(s => Math.max(0, s - 5));
      setFlash('red');
    }

    setTimeout(() => {
      nextLetter();
    }, 400); 
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: "var(--bg-gradient)" }}>
      <Head>
        <title>Nuqta Sorter | Urdu Games</title>
      </Head>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-12 w-full max-w-4xl mx-auto h-full">
        <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl relative flex flex-col items-center overflow-hidden">
            
            <div className="flex w-full items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div>
                   <h1 className="text-3xl md:text-5xl text-white font-bold mb-1 drop-shadow-sm" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>⚖️ Nuqta Sorter</h1>
                   <p className="text-white/80 font-medium">Does the letter have dots (Nuqta)?</p>
                </div>
                <div className="flex gap-6">
                    <div className="text-center bg-white/10 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-white/70 uppercase">Score</span>
                        <span className="text-3xl font-bold text-yellow-400">{score}</span>
                    </div>
                </div>
            </div>

            {!isPlaying && !gameOver ? (
                <div className="text-center py-12">
                   <p className="text-2xl text-white mb-8">Sort the letters fast!</p>
                   <button onClick={startGame} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 text-white px-10 py-4 rounded-full text-2xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                      Start Game
                   </button>
                </div>
            ) : gameOver ? (
                <div className="text-center py-12">
                   <h2 className="text-5xl text-white font-bold mb-4" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Time's Up!</h2>
                   <p className="text-2xl text-white/80 mb-8">You sorted <strong>{score}</strong> correctly!</p>
                   <button onClick={startGame} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 text-white px-10 py-4 rounded-full text-2xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                      Play Again
                   </button>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full max-w-2xl px-4 py-8">
                    
                    {/* Progress clock */}
                    <div className="w-full bg-black/20 rounded-full h-4 mb-12 border-2 border-white/20 overflow-hidden relative">
                       <div 
                           className={`h-full rounded-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                           style={{ width: `${(timeLeft / 45) * 100}%` }}
                       />
                       <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10 drop-shadow-md">
                         {timeLeft}s
                       </span>
                    </div>

                    {/* Central Letter */}
                    <div className="relative mb-16">
                        <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-[3rem] flex items-center justify-center border-[8px]  
                            ${flash === 'green' ? 'bg-green-400 border-green-200 scale-105' : 
                              flash === 'red' ? 'bg-red-500 border-red-300 scale-95' : 
                              'bg-white border-blue-200 shadow-[0_20px_50px_rgba(8,_112,_184,_0.5)]'} 
                             transition-all duration-200 transform`}
                        >
                            <span 
                                className={`text-9xl sm:text-[10rem] font-bold pb-6 ${flash ? 'text-white' : 'text-slate-800'}`} 
                                dir="rtl"
                                style={{ lineHeight: 0 }}
                            >
                                {currentLetter.char}
                            </span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full">
                        <button 
                            onClick={() => handleSort('no-nuqta')}
                            disabled={!!flash}
                            className="bg-gradient-to-br from-rose-400 to-red-600 hover:from-rose-500 hover:to-red-700 disabled:opacity-50 text-white rounded-[2rem] p-6 shadow-xl border-4 border-red-300/30 transform hover:-translate-y-2 hover:shadow-2xl transition-all"
                        >
                            <div className="text-4xl mb-2">⭕</div>
                            <div className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>No Dots</div>
                            <div className="text-sm opacity-80 mt-1">(Bina Nuqta)</div>
                        </button>
                        
                        <button 
                            onClick={() => handleSort('nuqta')}
                            disabled={!!flash}
                            className="bg-gradient-to-br from-teal-400 to-emerald-600 hover:from-teal-500 hover:to-emerald-700 disabled:opacity-50 text-white rounded-[2rem] p-6 shadow-xl border-4 border-emerald-300/30 transform hover:-translate-y-2 hover:shadow-2xl transition-all"
                        >
                            <div className="text-4xl mb-2">●</div>
                            <div className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Has Dots</div>
                            <div className="text-sm opacity-80 mt-1">(Nuqta)</div>
                        </button>
                    </div>

                </div>
            )}

        </div>
      </main>
      <Footer />
    </div>
  );
}