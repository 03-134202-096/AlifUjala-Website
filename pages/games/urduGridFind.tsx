import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import alphabetsData from '@/data/alphabets.json';

const ALL_LETTERS = alphabetsData.letters;

export default function UrduGridFind() {
  const [targetLetter, setTargetLetter] = useState(ALL_LETTERS[0]);
  const [grid, setGrid] = useState<any[]>([]);
  const [foundCount, setFoundCount] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameOver(false);
    generateGrid();
  };

  const generateGrid = () => {
    const newTarget = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
    setTargetLetter(newTarget);

    const gridSize = 16; // 4x4
    const targetsToPlace = Math.floor(Math.random() * 3) + 2; // 2 to 4 targets
    setTotalTargets(targetsToPlace);
    setFoundCount(0);

    let newGrid: any[] = [];
    
    // Add targets
    for (let i = 0; i < targetsToPlace; i++) {
        newGrid.push({ ...newTarget, isTarget: true, id: i, found: false });
    }

    // Fill the rest with random (non-target) letters
    while (newGrid.length < gridSize) {
        const randLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
        if (randLetter.char !== newTarget.char) {
            newGrid.push({ ...randLetter, isTarget: false, id: newGrid.length, found: false });
        }
    }

    // Shuffle
    newGrid = newGrid.sort(() => Math.random() - 0.5);
    setGrid(newGrid);
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

  useEffect(() => {
     if (isPlaying && foundCount === totalTargets && totalTargets > 0) {
         setScore(s => s + 50);
         setTimeLeft(t => t + 5); // Bonus time
         setTimeout(() => {
             generateGrid();
         }, 800);
     }
  }, [foundCount, isPlaying, totalTargets]);

  const handleCardClick = (index: number) => {
    if (!isPlaying) return;
    
    const card = grid[index];
    if (card.found) return;

    if (card.isTarget) {
       const newGrid = [...grid];
       newGrid[index].found = true;
       setGrid(newGrid);
       setFoundCount(c => c + 1);
       setScore(s => s + 10);
    } else {
       setScore(s => Math.max(0, s - 5));
       // Visual penalty could be added here
       const newGrid = [...grid];
       newGrid[index].wrong = true;
       setGrid(newGrid);
       setTimeout(() => {
          setGrid(currentGrid => {
             const restored = [...currentGrid];
             if(restored[index]) restored[index].wrong = false;
             return restored;
          });
       }, 500);
    }
  };

  return (
    <div className="kids-page-bg min-h-screen flex flex-col font-sans relative">
      <Head><title>Grid Find | Urdu Games</title></Head>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-12 w-full max-w-4xl mx-auto h-full">
        <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl relative flex flex-col items-center">
            
            <div className="flex w-full items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div>
                   <h1 className="text-3xl md:text-5xl text-white font-bold mb-1 drop-shadow-sm" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>🔍 Grid Find</h1>
                   <p className="text-white/80 font-medium">Find all the matching letters!</p>
                </div>
                <div className="flex gap-6">
                    <div className="text-center bg-white/10 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-white/70 uppercase">Score</span>
                        <span className="text-2xl font-bold text-yellow-400">{score}</span>
                    </div>
                    <div className="text-center bg-white/10 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-white/70 uppercase">Time</span>
                        <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
                    </div>
                </div>
            </div>

            {!isPlaying && !gameOver ? (
                <div className="text-center py-12">
                   <p className="text-2xl text-white mb-8">Ready to test your scanning skills?</p>
                   <button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 text-white px-10 py-4 rounded-full text-2xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                      Start Game
                   </button>
                </div>
            ) : gameOver ? (
                <div className="text-center py-12">
                   <h2 className="text-5xl text-white font-bold mb-4" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Time's Up!</h2>
                   <p className="text-2xl text-white/80 mb-8">You scored <strong>{score}</strong> points!</p>
                   <button onClick={startGame} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 text-white px-10 py-4 rounded-full text-2xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                      Play Again
                   </button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-6 mb-8 bg-blue-500/30 p-4 rounded-2xl border border-blue-400/30">
                        <span className="text-white text-xl">Find every:</span>
                        <div className="bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center border-2 border-white/50">
                            <span className="text-4xl text-white font-bold" dir="rtl">{targetLetter.char}</span>
                        </div>
                        <span className="text-white text-xl font-bold px-4 py-1 bg-white/20 rounded-full">
                           {foundCount} / {totalTargets} Found
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg w-full">
                        {grid.map((card, index) => (
                            <button
                                key={index}
                                onClick={() => handleCardClick(index)}
                                className={`aspect-square rounded-2xl text-4xl md:text-5xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 
                                  ${card.found ? 'bg-green-500 border-b-4 border-green-700 text-white scale-95 opacity-50 cursor-default' : 
                                    card.wrong ? 'bg-red-500 border-b-4 border-red-700 text-white animate-shake' : 
                                    'bg-white border-b-4 border-slate-300 text-slate-800 hover:bg-slate-50 hover:-translate-y-1'}`}
                                dir="rtl"
                            >
                                {card.char}
                            </button>
                        ))}
                    </div>
                </>
            )}

        </div>
      </main>
      <Footer />
    </div>
  );
}