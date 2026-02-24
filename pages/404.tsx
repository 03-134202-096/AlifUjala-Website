import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { NextPage } from 'next'

const NotFoundPage: NextPage = () => {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-24 left-[15%] text-6xl animate-float opacity-15">🔍</div>
        <div className="absolute top-48 right-[12%] text-5xl animate-float-delay opacity-15">❓</div>
        <div className="absolute bottom-40 left-[10%] text-4xl animate-bounce-slow opacity-10">🗺️</div>
        <div className="absolute bottom-20 right-[15%] text-5xl animate-float opacity-15">🧭</div>
      </div>

      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="text-center max-w-lg">
          {/* Big 404 */}
          <div className="mb-6">
            <span className="text-8xl sm:text-9xl font-bold animate-bounce-slow inline-block"
              style={{
                fontFamily: "'Bubblegum Sans', cursive",
                background: 'linear-gradient(135deg, #EC4899, #8B5CF6, #3B82F6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              404
            </span>
          </div>

          {/* Lost character */}
          <div className="text-7xl mb-4 animate-wiggle">🙈</div>

          {/* Message card */}
          <div className="bg-white/95 rounded-3xl shadow-candy-lg border-4 border-purple-200 p-6 sm:p-8 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 mb-3"
              style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              Oops! Page Not Found!
            </h2>
            <p className="text-gray-500 font-bold mb-6" style={{fontFamily: "'Comic Neue', cursive"}}>
              Looks like this page went on an adventure! 🌍<br/>
              Let&apos;s go back to somewhere fun!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-full border-3 border-white shadow-candy hover:scale-105 transition-all text-lg"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Go Home 🏠
              </a>
              <a href="/games"
                className="inline-block px-8 py-3 bg-gradient-to-r from-green-400 to-cyan-400 text-white font-bold rounded-full border-3 border-white shadow-candy hover:scale-105 transition-all text-lg"
                style={{fontFamily: "'Bubblegum Sans', cursive"}}>
                Play Games 🎮
              </a>
            </div>
          </div>

          {/* Fun bouncing emojis */}
          <div className="flex justify-center gap-4 text-3xl">
            <span className="animate-bounce-slow">🌟</span>
            <span className="animate-bounce-slow" style={{animationDelay: '0.2s'}}>📖</span>
            <span className="animate-bounce-slow" style={{animationDelay: '0.4s'}}>🎮</span>
            <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>🎨</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFoundPage
