import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import alphabetsData from '@/data/alphabets.json';

const ALL_LETTERS = alphabetsData.letters;

export default function UrduTrainPuzzle() {
  const [sequence, setSequence] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [missingIndex, setMissingIndex] = useState(2); // Last carriage is missing
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(1);

  const generatePuzzle = () => {
    // Pick a random starting index, ensuring we have enough letters for the sequence
    const startIndex = Math.floor(Math.random() * (ALL_LETTERS.length - 3));
    const currentSeq = [
      ALL_LETTERS[startIndex],
      ALL_LETTERS[startIndex + 1],
      ALL_LETTERS[startIndex + 2],
    ];

    setSequence(currentSeq);
    setMissingIndex(2); // Always hide the 3rd letter for simplicity
    setMessage('');

    // Generate options: 1 correct, 3 wrong
    let incorrectOptions: any[] = [];
    while(incorrectOptions.length < 3) {
      const rand = ALL_LETTERS[Math.floor(Math.random() * ALL_LETTERS.length)];
      if (rand.char !== currentSeq[2].char && !incorrectOptions.find(o => o.char === rand.char)) {
        incorrectOptions.push(rand);
      }
    }

    const allOptions = [currentSeq[2], ...incorrectOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useEffect(() => {
    generatePuzzle();
  }, [level]);

  const handleOptionClick = (letter: any) => {
    if (letter.char === sequence[missingIndex].char) {
      setScore(s => s + 20);
      setMessage('🎉 Correct! Choo Choo! 🚂');
      setMissingIndex(-1); // Reveal it
      setTimeout(() => {
        setLevel(l => l + 1);
      }, 2000);
    } else {
      setScore(s => Math.max(0, s - 5));
      setMessage('❌ Oops! Try again.');
    }
  };

  return (
    <div className="kids-page-bg min-h-screen flex flex-col font-sans relative">
      <Head>
        <title>Train Puzzle | Urdu Games</title>
      </Head>
      <Navbar />

      <main className="flex-1 flex flex-col items-center p-4 pt-24 pb-12">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border border-white/20 shadow-2xl relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl text-white font-bold mb-2 drop-shadow-lg" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>🚂 Alphabet Train</h1>
              <p className="text-white/80 font-medium text-lg">What comes next in the Urdu alphabet sequence?</p>
            </div>
            <div className="bg-white/20 p-4 rounded-2xl text-center shadow-inner">
               <span className="block text-sm text-white/80 uppercase">Score</span>
               <span className="text-3xl font-bold text-yellow-400">{score}</span>
            </div>
          </div>

          {/* The Train Area */}
          <div className="flex items-end justify-center gap-2 mb-12 mt-8 overflow-x-auto py-4">
            {/* Engine */}
            <div className="relative">
              <div className="w-24 h-32 bg-red-600 rounded-t-3xl rounded-br-3xl flex flex-col items-center justify-end pb-4 shadow-xl border-4 border-red-800">
                 <div className="w-12 h-16 bg-blue-300 rounded-t-full mb-2 border-2 border-slate-500"></div>
              </div>
              <div className="absolute -top-6 left-4 text-3xl animate-bounce">💨</div>
              <div className="flex justify-between px-2 mt-1">
                 <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-400"></div>
                 <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-400"></div>
              </div>
            </div>

            {/* Linker */}
            <div className="w-4 h-2 bg-slate-600 mb-4"></div>

            {/* Carriages */}
            {sequence.map((letter, idx) => (
              <React.Fragment key={idx}>
                <div className="relative">
                  <div className={`w-28 h-24 ${idx === missingIndex ? 'bg-slate-300/50 border-dashed border-2' : 'bg-blue-500 border-4 border-blue-700'} rounded-lg flex items-center justify-center shadow-lg transition-all`}>
                    {idx === missingIndex ? (
                      <span className="text-5xl text-white/50 font-bold">?</span>
                    ) : (
                      <span className="text-5xl text-white font-bold drop-shadow-md">{letter.char}</span>
                    )}
                  </div>
                  <div className="flex justify-between px-4 mt-1">
                     <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-400 animate-[spin_3s_linear_infinite]"></div>
                     <div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-slate-400 animate-[spin_3s_linear_infinite]"></div>
                  </div>
                </div>
                {idx < sequence.length - 1 && <div className="w-4 h-2 bg-slate-600 mb-4"></div>}
              </React.Fragment>
            ))}
          </div>

          {/* Options */}
          <div className="bg-white/5 rounded-2xl p-6 mb-4">
            <h3 className="text-white text-center text-xl mb-6">Select the missing letter:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pointer-events-auto">
               {options.map((opt, i) => (
                 <button 
                    key={i}
                    onClick={() => handleOptionClick(opt)}
                    disabled={missingIndex === -1}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 text-white p-6 rounded-2xl shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all text-center border-2 border-white/20"
                 >
                    <span className="text-6xl font-bold block mb-2">{opt.char}</span>
                    <span className="text-sm font-medium opacity-80">{opt.name}</span>
                 </button>
               ))}
            </div>
          </div>

          {message && (
             <div className="text-center text-2xl mt-4 font-bold text-white bg-black/30 py-3 rounded-xl animate-pulse">
                {message}
             </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}