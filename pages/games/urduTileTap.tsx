import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import alphabetsData from '@/data/alphabets.json';

const ALL_LETTERS = alphabetsData.letters;

export default function UrduTileTap() {
  const [targetLetter, setTargetLetter] = useState(ALL_LETTERS[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Row of 4 columns, we spawn rows that move down
  const [rows, setRows] = useState<Array<{ id: number, tiles: any[], top: number }>>([]);
  const requestRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    setRows([]);
    pickNewTarget();
    lastSpawnRef.current = Date.now();
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
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Main game loop
  const lastTimeRef = useRef<number>(0);
  
  const updateLoop = () => {
    if (!isPlaying) return;

    const now = Date.now();
    if (lastTimeRef.current === 0) lastTimeRef.current = now;
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Spawn new row
    const baseSpeed = 1800;
    const speed = Math.max(800, baseSpeed - score * 10); 
    
    if (now - lastSpawnRef.current > speed) {
       spawnRow();
       lastSpawnRef.current = now;
    }

    // Move rows down consistently regardless of screen refresh rate (60Hz vs 120Hz)
    setRows(prevRows => {
       const fallRate = (12 + (score * 0.4)) / 1000; // 12% of screen height per second
       const distance = fallRate * delta;
       const newRows = prevRows.map(r => ({ ...r, top: r.top + distance })); 
       return newRows.filter(r => r.top < 110); 
    });

    requestRef.current = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(updateLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, score]);

  const spawnRow = () => {
     // Create 4 tiles
     const randomTargetIndex = Math.floor(Math.random() * 4);
     const newTiles = [];
     for(let i = 0; i < 4; i++) {
        if(i === randomTargetIndex) {
            newTiles.push({ letter: targetLetter, isTarget: true, tapped: false });
        } else {
            let fakeLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
            // ensure it's not the target
            while(fakeLetter.char === targetLetter.char) {
                fakeLetter = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
            }
            newTiles.push({ letter: fakeLetter, isTarget: false, tapped: false });
        }
     }

     setRows(prev => [...prev, { id: Date.now(), tiles: newTiles, top: -20 }]);
  };

  const handleTap = (rowId: number, colIndex: number, isTarget: boolean, tapped: boolean) => {
      if(!isPlaying || tapped) return;

      if(isTarget) {
         setScore(s => s + 5);
         // Mark as tapped
         setRows(prev => prev.map(r => {
             if(r.id === rowId) {
                const newTiles = [...r.tiles];
                newTiles[colIndex].tapped = true;
                newTiles[colIndex].correct = true;
                return { ...r, tiles: newTiles };
             }
             return r;
         }));
      } else {
         // Penalize
         setScore(s => Math.max(0, s - 3));
         setRows(prev => prev.map(r => {
             if(r.id === rowId) {
                const newTiles = [...r.tiles];
                newTiles[colIndex].tapped = true;
                newTiles[colIndex].wrong = true;
                return { ...r, tiles: newTiles };
             }
             return r;
         }));
      }
  };

  return (
    <div className="kids-page-bg arcade-page min-h-screen flex flex-col font-sans relative">
      <Head>
        <title>Tile Tap | Urdu Games</title>
      </Head>
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-4 pt-24 pb-8 w-full max-w-lg mx-auto min-h-[calc(100dvh-76px)]">
        {/* Game UI Overlay */}
        <div className="w-full z-20 flex-shrink-0 flex flex-col pb-4 bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-2xl relative mb-4">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-3xl text-white font-bold shadow-sm" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>🎹 Tile Tap</h1>
            <div className="flex gap-4">
              <div className="text-center bg-white/10 px-3 py-1 rounded-xl">
                 <span className="block text-xs text-white/70 uppercase">Score</span>
                 <span className="text-xl font-bold text-yellow-400">{score}</span>
              </div>
              <div className="text-center bg-white/10 px-3 py-1 rounded-xl">
                 <span className="block text-xs text-white/70 uppercase">Time</span>
                 <span className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          {(isPlaying || gameOver) && (
             <div className="mt-4 flex items-center justify-center gap-4 bg-purple-600/30 rounded-xl p-2 border border-purple-400/30">
               <span className="text-white">Tap the letter:</span>
               <div className="bg-white rounded-lg px-4 py-1 text-3xl font-bold text-slate-800 shadow-inner" dir="rtl">{targetLetter.char}</div>
             </div>
          )}
        </div>

        {/* Start / Game Over Screens */}
        {!isPlaying && (
          <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center text-white border border-white/20 z-20">
             {gameOver && (
                <>
                   <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>Game Over!</h2>
                   <p className="text-2xl mb-8">Score: {score}</p>
                </>
             )}
             {!gameOver && <p className="text-xl mb-8">Tap the tiles containing the target letter before they hit the bottom!</p>}
             <button onClick={startGame} className="bg-gradient-to-r from-green-400 to-emerald-600 text-white px-10 py-4 rounded-full text-2xl shadow-lg transition-transform font-bold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                {gameOver ? 'Play Again' : 'Start Game'}
             </button>
          </div>
        )}

        {/* Play Area */}
        {isPlaying && (
            <div className="relative flex-1 w-full min-h-[360px] md:min-h-[460px] overflow-hidden bg-black/40 border-t-4 border-slate-700 mx-auto max-w-lg shadow-[inset_0_20px_50px_rgba(0,0,0,0.5)] rounded-t-2xl touch-none">
               
               {/* 4 Lanes Background */}
               <div className="absolute inset-0 flex">
                   <div className="flex-1 border-r border-white/10"></div>
                   <div className="flex-1 border-r border-white/10"></div>
                   <div className="flex-1 border-r border-white/10"></div>
                   <div className="flex-1"></div>
               </div>
               
               {/* Falling Rows */}
               {rows.map((row) => (
                 <div 
                   key={row.id}
                   className="absolute w-full flex h-24 sm:h-32"
                   style={{ top: `${row.top}%` }}
                 >
                    {row.tiles.map((tile, i) => (
                       <div 
                          key={i} 
                          className="flex-1 p-2 sm:p-3"
                          onTouchStart={(e) => {
                             e.preventDefault(); 
                             handleTap(row.id, i, tile.isTarget, tile.tapped);
                          }}
                          onClick={(e) => {
                             e.preventDefault(); 
                             handleTap(row.id, i, tile.isTarget, tile.tapped);
                          }}
                       >
                          <div className={`w-full h-full rounded-xl flex items-center justify-center text-4xl sm:text-5xl font-bold cursor-pointer transition-all duration-100 shadow-xl border-b-[6px] border-r-4 select-none
                             ${tile.tapped && tile.correct ? 'bg-green-500 border-green-700 text-white scale-95 opacity-50' : 
                               tile.tapped && tile.wrong ? 'bg-red-500 border-red-700 text-white scale-95 opacity-80' : 
                               'bg-sky-400 border-sky-600 text-blue-950 hover:bg-sky-300'}`}
                             dir="rtl"
                          >
                             {tile.letter.char}
                          </div>
                       </div>
                    ))}
                 </div>
               ))}

               {/* Bottom Fade */}
               <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-red-600/50 to-transparent pointer-events-none"></div>

            </div>
        )}

      </main>

         {!isPlaying && <Footer />}
    </div>
  );
}