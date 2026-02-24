import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { NextPage } from 'next'
import { useState } from 'react'
import Link from 'next/link'

const About: NextPage = () => {
  const [lang, setLang] = useState<'en' | 'ur'>('en')
  const [open, setOpen] = useState<number | null>(null)
  const [quizState, setQuizState] = useState<{ answered: boolean; correct?: boolean }>({ answered: false })

  const toggle = (i: number) => setOpen(open === i ? null : i)

  const content = {
    en: {
      title: 'About AlifUjala',
      tagline: 'A playful platform to learn Urdu through games, stories and activities! 🎉',
      missionTitle: '🎯 Our Mission',
      mission: 'AlifUjala was created to celebrate, preserve and promote the Urdu language by making learning fun for children and beginners. We combine interactive games, visual aids, and culturally relevant content to build confidence and joy while learning Urdu.',
      featuresTitle: '🌟 What you can do here',
      features: [
        { title: '🎮 Play & Learn', body: 'Match letters, pictures and sounds. Our games are designed to make repetition feel like play!', emoji: '🎮' },
        { title: '📖 Stories & Worksheets', body: 'Short stories written in simple Urdu and printable worksheets for practice.', emoji: '📖' },
        { title: '👩‍🏫 Teacher Tools', body: 'Track progress, assign worksheets, and use the platform in classrooms.', emoji: '👩‍🏫' },
      ],
      quizQ: 'Which Urdu letter is the first in the Urdu alphabet?',
      quizOptions: ['ا (Alif)', 'ب (Bay)', 'ت (Tay)'],
      playCTA: '🎮 Try a sample game!',
      contribute: 'Want to help? Add content, translate, or suggest features. Reach out through the profile page! 💪'
    },
    ur: {
      title: 'الف اُجاﻻ کے بارے میں',
      tagline: 'کھیلوں، کہانیوں اور سرگرمیوں کے ذریعے اردو سیکھنے کا ایک دلچسپ پلیٹ فارم! 🎉',
      missionTitle: '🎯 ہمارا مقصد',
      mission: 'الف اُجاﻻ کو اردو زبان کو محفوظ کرنے، اس کی ترویج کرنے اور بچوں اور ابتدائی طلبہ کے لیے سیکھنے کو مزید دلچسپ اور آسان بنانے کے لیے بنایا گیا ہے۔',
      featuresTitle: '🌟 یہاں آپ کیا کر سکتے ہیں',
      features: [
        { title: '🎮 کھیلیں اور سیکھیں', body: 'حروف، تصاویر اور آوازوں کو ملائیں۔ ہمارے کھیل دہرانے کو مزید دلچسپ بناتے ہیں!', emoji: '🎮' },
        { title: '📖 کہانیاں اور ورکشیٹس', body: 'آسان اردو میں مختصر کہانیاں اور عمل کے لیے ورکشیٹس فراہم کی جاتی ہیں۔', emoji: '📖' },
        { title: '👩‍🏫 اساتذہ کے لیے ٹولز', body: 'پیش رفت کو ٹریک کریں، ورکشیٹس تفویض کریں، اور کلاس روم میں پلیٹ فارم کا استعمال کریں۔', emoji: '👩‍🏫' },
      ],
      quizQ: 'اردو حروفِ تہجی کا پہلا حرف کون سا ہے؟',
      quizOptions: ['ا (الف)', 'ب (ب)', 'ت (ت)'],
      playCTA: '🎮 ایک نمونہ کھیل کھیلیں!',
      contribute: 'مدد کرنا چاہتے ہیں؟ مواد شامل کریں، ترجمہ کریں، یا نئے فیچرز تجویز کریں۔ 💪'
    }
  }

  const c = content[lang]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 flex-1 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header card */}
          <div className="bg-white/90 rounded-3xl shadow-candy-lg p-6 sm:p-8 border-4 border-purple-200 mb-6">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
                  {c.title} ✨
                </h1>
                <p className="mt-2 text-lg text-blue-600 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>{c.tagline}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-indigo-500 font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>Language / زبان 🌍</div>
                <div className="flex gap-2">
                  <button
                    aria-pressed={lang === 'en'}
                    onClick={() => setLang('en')}
                    className={`px-4 py-2 rounded-full font-bold transition-all duration-300 border-2 ${lang === 'en' ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white border-white scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
                    style={{fontFamily: "'Comic Neue', cursive"}}
                  >
                    English
                  </button>
                  <button
                    aria-pressed={lang === 'ur'}
                    onClick={() => setLang('ur')}
                    className={`px-4 py-2 rounded-full font-bold transition-all duration-300 border-2 ${lang === 'ur' ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white border-white scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                    style={{fontFamily: "'Comic Neue', cursive"}}
                  >
                    اردو
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mission section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-candy p-6 sm:p-8 border-4 border-green-200 mb-6">
            <h2 className="text-2xl font-bold text-green-700 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>{c.missionTitle}</h2>
            <p className="text-gray-700 leading-relaxed text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>{c.mission}</p>
          </div>

          {/* Features accordion */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl shadow-candy p-6 sm:p-8 border-4 border-indigo-200 mb-6">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4" style={{fontFamily: "'Bubblegum Sans', cursive"}}>{c.featuresTitle}</h3>
            <div className="space-y-3">
              {c.features.map((f, i) => (
                <div key={i} className="bg-white/80 border-3 border-indigo-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full text-left px-5 py-4 flex justify-between items-center border-0 bg-transparent"
                  >
                    <span className="font-bold text-lg text-gray-700" style={{fontFamily: "'Comic Neue', cursive"}}>{f.title}</span>
                    <span className={`text-2xl transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                      {open === i ? '✕' : '➕'}
                    </span>
                  </button>
                  {open === i && (
                    <div className="px-5 pb-4 text-gray-600 text-lg border-t-2 border-indigo-100 pt-3" style={{fontFamily: "'Comic Neue', cursive"}}>
                      {f.body}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quiz & Game section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Quiz */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl shadow-candy p-6 border-4 border-yellow-200">
              <h4 className="font-bold text-xl text-purple-600 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>🧠 Quick Quiz!</h4>
              {!quizState.answered ? (
                <div>
                  <p className="text-gray-700 font-bold mb-3" style={{fontFamily: "'Comic Neue', cursive"}}>{c.quizQ}</p>
                  <div className="space-y-2">
                    {c.quizOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuizState({ answered: true, correct: idx === 0 })}
                        className="block w-full text-left px-4 py-3 bg-white border-3 border-purple-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50 hover:scale-[1.02] transition-all duration-300 font-bold text-gray-700"
                        style={{fontFamily: "'Comic Neue', cursive"}}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  {quizState.correct ? (
                    <>
                      <div className="text-6xl mb-3">🎉</div>
                      <p className="text-green-600 font-bold text-xl" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                        {lang === 'en' ? 'Correct — amazing job!' : 'صحیح — شاباش!'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-6xl mb-3">🤔</div>
                      <p className="text-purple-600 font-bold text-lg mb-3" style={{fontFamily: "'Comic Neue', cursive"}}>
                        {lang === 'en' ? 'Not quite — the correct answer is ا (Alif)!' : 'درست نہیں — درست جواب ا (الف) ہے!'}
                      </p>
                      <button
                        onClick={() => setQuizState({ answered: false })}
                        className="px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full font-bold border-2 border-white hover:scale-105 transition-all"
                        style={{fontFamily: "'Comic Neue', cursive"}}
                      >
                        {lang === 'en' ? '🔄 Try again!' : '🔄 دوبارہ کوشش کریں!'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Try a game */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-candy p-6 border-4 border-blue-200 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xl text-blue-600 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                  🎮 {lang === 'en' ? 'Ready to Play?' : 'کھیلنے کے لیے تیار؟'}
                </h4>
                <p className="text-gray-600 text-lg" style={{fontFamily: "'Comic Neue', cursive"}}>
                  {lang === 'en' ? 'Jump in and play a fun matching game! Match Urdu letters and have a blast!' : 'ایک مزیدار میچنگ گیم کھیلیں اور اردو حروف سیکھیں!'}
                </p>
                <div className="flex gap-3 mt-4 text-4xl justify-center">
                  <span className="animate-bounce-slow">🎲</span>
                  <span className="animate-bounce-slow" style={{animationDelay: '0.3s'}}>🧩</span>
                  <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>🏆</span>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/games" className="block w-full text-center px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg border-3 border-white hover:scale-105 transition-all duration-300 shadow-candy" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                  {c.playCTA}
                </Link>
              </div>
            </div>
          </div>

          {/* Get involved & Contact */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl shadow-candy p-6 sm:p-8 border-4 border-purple-200 mb-6">
            <h4 className="font-bold text-xl text-purple-600 mb-3" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              🤝 {lang === 'en' ? 'Get Involved!' : 'شمولیت اختیار کریں!'}
            </h4>
            <p className="text-gray-600 text-lg mb-4" style={{fontFamily: "'Comic Neue', cursive"}}>{c.contribute}</p>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <a href="https://www.instagram.com/alifujala.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full font-bold hover:scale-105 transition-all text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram
              </a>
              <a href="https://www.facebook.com/profile.php?id=61579001649615" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold hover:scale-105 transition-all text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <a href="mailto:aiearlyedge@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold hover:scale-105 transition-all text-sm" style={{fontFamily: "'Comic Neue', cursive"}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Email Us
              </a>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="text-center py-4">
            <p className="text-purple-400 text-sm font-bold" style={{fontFamily: "'Comic Neue', cursive"}}>
              {lang === 'en'
                ? '🌈 AlifUjala — built with love for Urdu. Made for kids, teachers and families! 🌈'
                : '🌈 الف اُجاﻻ — اردو کے جذبے کے ساتھ بنایا گیا۔ بچوں، اساتذہ اور خاندانوں کے لیے! 🌈'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default About
