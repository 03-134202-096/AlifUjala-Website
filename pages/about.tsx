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
      tagline: 'A playful platform to learn Urdu through games, stories and activities.',
      missionTitle: 'Our Mission',
      mission:
        'AlifUjala was created to celebrate, preserve and promote the Urdu language by making learning fun for children and beginners. We combine interactive games, visual aids, and culturally relevant content to build confidence and joy while learning Urdu.',
      featuresTitle: 'What you can do here',
      features: [
        {
          title: 'Play & Learn',
          body: 'Match letters, pictures and sounds. Our games are designed to make repetition feel like play.'
        },
        {
          title: 'Stories & Worksheets',
          body: 'Short stories written in simple Urdu and printable worksheets for practice.'
        },
        {
          title: 'Teacher Tools',
          body: 'Track progress, assign worksheets, and use the platform in classrooms.'
        }
      ],
      quizQ: 'Which Urdu letter is the first in the Urdu alphabet?',
      quizOptions: ['ا (Alif)', 'ب (Bay)', 'ت (Tay)'],
      playCTA: 'Try a sample game',
      contribute: 'Want to help? Add content, translate, or suggest features. Reach out through the profile page.'
    },
    ur: {
      title: 'الف اُجاﻻ کے بارے میں',
      tagline: 'کھیلوں، کہانیوں اور سرگرمیوں کے ذریعے اردو سیکھنے کا ایک دلچسپ پلیٹ فارم۔',
      missionTitle: 'ہمارا مقصد',
      mission:
        'الف اُجاﻻ کو اردو زبان کو محفوظ کرنے، اس کی ترویج کرنے اور بچوں اور ابتدائی طلبہ کے لیے سیکھنے کو مزید دلچسپ اور آسان بنانے کے لیے بنایا گیا ہے۔ ہم تعلیمی کھیل، بصری مواد اور ثقافتی طور پر مناسب مواد کو یکجا کرتے ہیں تاکہ اردو سیکھنے میں بچوں کے اعتماد اور خوشی کو بڑھا سکیں۔',
      featuresTitle: 'یہاں آپ کیا کر سکتے ہیں',
      features: [
        { title: 'کھیلیں اور سیکھیں', body: 'حروف، تصاویر اور آوازوں کو ملائیں۔ ہمارے کھیل دہرانے کو مزید دلچسپ بناتے ہیں۔' },
        { title: 'کہانیاں اور ورکشیٹس', body: 'آسان اردو میں مختصر کہانیاں اور عمل کے لیے ورکشیٹس فراہم کی جاتی ہیں۔' },
        { title: 'اساتذہ کے لیے ٹولز', body: 'پیش رفت کو ٹریک کریں، ورکشیٹس تفویض کریں، اور کلاس روم میں پلیٹ فارم کا استعمال کریں۔' }
      ],
      quizQ: 'اردو حروفِ تہجی کا پہلا حرف کون سا ہے؟',
      quizOptions: ['ا (الف)', 'ب (ب)', 'ت (ت)'],
      playCTA: 'ایک نمونہ کھیل کھیلیں',
      contribute: 'مدد کرنا چاہتے ہیں؟ مواد شامل کریں، ترجمہ کریں، یا نئے فیچرز تجویز کریں۔ پروفائل صفحے کے ذریعے ہم سے رابطہ کریں۔'
    }
  }

  const c = content[lang]

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-6">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-300">{c.title}</h1>
              <p className="mt-2 text-sky-200">{c.tagline}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-fuchsia-200">Language / زبان</div>
              <div className="flex gap-2">
                <button
                  aria-pressed={lang === 'en'}
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  English
                </button>
                <button
                  aria-pressed={lang === 'ur'}
                  onClick={() => setLang('ur')}
                  className={`px-3 py-1 rounded ${lang === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  اردو
                </button>
              </div>
            </div>
          </header>

          <section className="mt-6">
            <h2 className="text-xl font-semibold text-emerald-200">{c.missionTitle}</h2>
            <p className="mt-2 text-sky-200 leading-relaxed">{c.mission}</p>
          </section>

          <section className="mt-6">
            <h3 className="text-lg font-semibold text-rose-200">{c.featuresTitle}</h3>
              <div className="mt-3 space-y-2">
              {c.features.map((f, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full text-left px-4 py-3 flex justify-between items-center">
                    <span className="font-medium">{f.title}</span>
                    <span className="text-cyan-200">{open === i ? '−' : '+'}</span>
                  </button>
                  {open === i && <div className="px-4 pb-3 text-sky-200">{f.body}</div>}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded">
              <h4 className="font-semibold text-amber-200">Interactive Quiz</h4>
              {!quizState.answered ? (
                <div className="mt-3">
                  <div className="text-sm text-cyan-100">{c.quizQ}</div>
                  <div className="mt-3 space-y-2">
                    {c.quizOptions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuizState({ answered: true, correct: idx === 0 })}
                        className="block w-full text-left px-3 py-2 border rounded hover:bg-gray-50">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  {quizState.correct ? (
                    <p className="text-lime-200 font-medium">{lang === 'en' ? 'Correct — well done!' : 'صحیح — شاباش!'}</p>
                  ) : (
                    <>
                      <p className="text-rose-200 font-medium">{lang === 'en' ? 'Not quite — the correct answer is ا (Alif).' : 'درست نہیں — درست جواب ا (الف) ہے۔'}</p>
                      <button
                        onClick={() => setQuizState({ answered: false })}
                        className="mt-3 inline-block px-3 py-1 bg-blue-600 text-white rounded">
                        {lang === 'en' ? 'Try again' : 'دوبارہ کوشش کریں'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-amber-200">{lang === 'en' ? 'Try a Game' : 'ایک کھیل آزمائیں'}</h4>
                <p className="mt-2 text-cyan-100">{lang === 'en' ? 'Play a short matching game to experience how learning here feels.' : 'یہاں سیکھنے کا تجربہ حاصل کرنے کے لیے ایک مختصر میچنگ کھیل کھیلیں۔'}</p>
              </div>
              <div className="mt-4">
                <Link href="/games" className="inline-block px-4 py-2 bg-green-600 text-white rounded">{c.playCTA}</Link>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <h4 className="font-semibold text-emerald-200">{lang === 'en' ? 'Get Involved' : 'شمولیت اختیار کریں'}</h4>
            <p className="mt-2 text-cyan-100">{c.contribute}</p>

            <div className="mt-3">
              <div className="text-sm text-fuchsia-200 font-medium">{lang === 'en' ? 'Follow / Contact' : 'ہم سے رابطہ کریں'}</div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                <a href="https://www.instagram.com/alifujala.ai/" target="_blank" rel="noopener noreferrer" className="text-sky-200 hover:underline">Instagram</a>
                <a href="https://www.facebook.com/profile.php?id=61579001649615" target="_blank" rel="noopener noreferrer" className="text-sky-200 hover:underline">Facebook</a>
                <a href="mailto:aiearlyedge@gmail.com" className="text-sky-200 hover:underline">aiearlyedge@gmail.com</a>
              </div>
            </div>
          </section>

          <footer className="mt-6 text-sm text-violet-200">
            <div>
              {lang === 'en'
                ? 'AlifUjala — built with love for Urdu. Made for kids, teachers and families.'
                : 'الف اُجاﻻ — اردو کے جذبے کے ساتھ بنایا گیا۔ بچوں، اساتذہ اور خاندانوں کے لیے۔'}
            </div>
          </footer>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default About
