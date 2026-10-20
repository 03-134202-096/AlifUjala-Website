import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import alphabetsData from '@/data/alphabets.json';

const ALL_LETTERS = alphabetsData.letters;

export default function WhackALetter() {
  const [targetLetter, setTargetLetter] = useState(ALL_LETTERS[0]);
  const [holes, setHoles] = useState<Array<{ id: number; letter: any; active: boolean }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Initialize holes
  useEffect(() => {
    const initialHoles = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      letter: null,
      active: false,
    }));
    setHoles(initialHoles);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    pickNewTarget();
  };

  const pickNewTarget = () => {
    const randomLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
    setTargetLetter(randomLetter);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Game loop to show/hide letters in holes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setHoles((prevHoles) => {
          const newHoles = [...prevHoles];
          // Hide some randomly
          newHoles.forEach((hole) => {
            if (hole.active && Math.random() > 0.5) {
              hole.active = false;
            }
          });

          // Show a new letter in a random empty hole
          const emptyHoles = newHoles.filter((h) => !h.active);
          if (emptyHoles.length > 0) {
            const randomHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
            // 50% chance to be the target letter, 50% random other letter
            const showTarget = Math.random() > 0.5;
            let letterToShow = targetLetter;
            if (!showTarget) {
              letterToShow = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
            }
            randomHole.active = true;
            randomHole.letter = letterToShow;
          }
          return newHoles;
        });
      }, 1000); // Speed of popping up
    }
    return () => clearInterval(interval);
  }, [isPlaying, targetLetter]);

  const handleWhack = (holeId: number, letter: any) => {
    if (!isPlaying) return;

    if (letter && letter.char === targetLetter.char) {
      setScore((s) => s + 10);
      pickNewTarget();
    } else {
      setScore((s) => Math.max(0, s - 5)); // penalty
    }

    // Hide the whacked hole immediately
    setHoles((prev) =>
      prev.map((h) => (h.id === holeId ? { ...h, active: false } : h))
    );
  };

  return (
    <div className="kids-page-bg arcade-page min-h-screen flex flex-col font-sans relative">
      <Head>
        <title>Whack-a-Letter | Urdu Games</title>
      </Head>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-12">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl text-center">
          <h1 className="text-4xl text-white font-bold mb-2 shadow-sm" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Whack-a-Letter</h1>
          <p className="text-white/80 mb-6 font-medium text-lg">Whack the mole holding the correct letter!</p>

          <div className="flex justify-between items-center mb-6 text-white text-xl font-bold bg-white/10 p-4 rounded-xl">
             <div className="flex flex-col">
                <span className="text-sm text-white/70 uppercase tracking-wider">Score</span>
                <span className="text-3xl text-yellow-400">{score}</span>
             </div>
             
             {!isPlaying && !gameOver && (
                <button 
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-xl shadow-lg transition-transform transform hover:scale-105"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  Start Game
                </button>
             )}

             <div className="flex flex-col">
                <span className="text-sm text-white/70 uppercase tracking-wider">Time Left</span>
                <span className="text-3xl text-red-400">{timeLeft}s</span>
             </div>
          </div>

          {(isPlaying || gameOver) && (
            <div className="mb-6 p-4 bg-purple-600/30 rounded-xl border border-purple-400/30">
               <p className="text-white text-lg">Find and Whack:</p>
               <span className="text-6xl text-white block mt-2">{targetLetter.char}</span>
               <span className="text-white/80 text-sm">{targetLetter.name}</span>
            </div>
          )}

          {gameOver && (
            <div className="mb-8">
               <h2 className="text-3xl text-white font-bold mb-4">Game Over! Final Score: {score}</h2>
               <button 
                  onClick={startGame}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-xl shadow-lg transition-transform transform hover:scale-105"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  Play Again
                </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 max-w-[400px] mx-auto">
             {holes.map((hole) => (
                <div 
                  key={hole.id} 
                  className="aspect-square bg-black/40 rounded-[2rem] border-b-8 border-black/60 relative overflow-hidden cursor-pointer"
                  onClick={() => hole.active && handleWhack(hole.id, hole.letter)}
                >
                  {/* The Mole */}
                  <div 
                    className={`absolute bottom-0 left-[10%] w-[80%] h-[80%] bg-[#8B5A2B] rounded-t-[3rem] transition-transform duration-300 flex items-center justify-center border-[5px] border-b-0 border-[#5E3A1A] pb-4`}
                    style={{ transform: hole.active ? 'translateY(10%)' : 'translateY(100%)' }}
                  >
                     <span className="text-white font-bold text-6xl drop-shadow-md leading-none select-none">
                       {hole.letter?.char}
                     </span>
                  </div>
                </div>
             ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}