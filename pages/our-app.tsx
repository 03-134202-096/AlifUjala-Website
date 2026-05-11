import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"

const APP_SAMPLE_IMAGES = Array.from({ length: 11 }, (_, i) => `/images/AppSampleImages/${i + 1}.jpeg`)

const APP_FEATURES = [
  {
    emoji: "🎮",
    title: "Interactive Activities",
    description: "Fun games and activities to learn Urdu letters through play!",
  },
  {
    emoji: "📊",
    title: "Progress Tracker",
    description: "Track your child's learning journey and celebrate milestones!",
  },
  {
    emoji: "🗣️",
    title: "Voice Support",
    description: "Listen to correct pronunciations of Urdu letters and words!",
  },
  {
    emoji: "🎨",
    title: "Kid-Friendly Design",
    description: "Colorful, engaging interface designed especially for children!",
  },
  {
    emoji: "📱",
    title: "Offline Mode",
    description: "Learn anytime, anywhere - no internet required!",
  },
  {
    emoji: "🌟",
    title: "AI Assistive Writing",
    description: "Get smart writing suggestions and guided practice while learning Urdu!",
  },
]

function PageDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 left-[5%] text-5xl animate-float opacity-20">📱</div>
      <div className="absolute top-20 right-[8%] text-4xl animate-float-delay opacity-15">🎮</div>
      <div className="absolute bottom-20 left-[10%] text-4xl animate-bounce-slow opacity-15">⭐</div>
      <div className="absolute bottom-40 right-[12%] text-3xl animate-float opacity-20">🚀</div>
    </div>
  )
}

export default function OurAppPage() {
  // Duplicate the list so the marquee can loop seamlessly
  const marqueeImages = [...APP_SAMPLE_IMAGES, ...APP_SAMPLE_IMAGES]

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Our App — AlifUjala Mobile App for Learning Urdu"
        description="Download the AlifUjala mobile app! Learn Urdu alphabets through interactive games, track progress, and enjoy voice support. Free on Google Play!"
        ogUrl="https://alifujala.ai/our-app"
        keywords="AlifUjala app, Urdu learning app, Urdu alphabet app for kids, learn Urdu mobile app"
      />
      <PageDecorations />
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce-slow">📱</div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "'Bubblegum Sans', cursive", color: "#10B981" }}
          >
            AlifUjala Mobile App
          </h1>
          <p
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-bold max-w-xl mx-auto"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Learn Urdu on the go! Download our free app and start your learning adventure!
          </p>
        </div>

        {/* Download CTA */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl shadow-candy p-6 sm:p-8 border-4 border-green-200 dark:border-green-800 text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-3"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              🎉 Download Free!
            </h2>
            <p
              className="text-gray-600 dark:text-gray-300 mb-5 text-base sm:text-lg"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Get the AlifUjala app on your phone and let your child learn Urdu anywhere, anytime!
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-candy hover:scale-105 hover:shadow-xl transition-all duration-300 border-3 border-white"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span>Get on Google Play</span>
            </a>

            <p
              className="text-gray-400 dark:text-gray-500 text-sm mt-4 font-bold"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              📲 Available for Android devices
            </p>

            <div className="grid grid-cols-3 gap-3 mt-6 max-w-md mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-3 text-center border-2 border-purple-100 dark:border-purple-800">
                <div className="text-2xl mb-1">🆓</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300" style={{ fontFamily: "'Comic Neue', cursive" }}>Free</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-3 text-center border-2 border-indigo-100 dark:border-indigo-800">
                <div className="text-2xl mb-1">👶</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300" style={{ fontFamily: "'Comic Neue', cursive" }}>Ages 3+</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-3 text-center border-2 border-blue-100 dark:border-blue-800">
                <div className="text-2xl mb-1">🎓</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300" style={{ fontFamily: "'Comic Neue', cursive" }}>Educational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Screenshots Showcase — 3D auto-scrolling phone coverflow */}
        <section className="mb-14" aria-label="App Screenshots Showcase">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-2"
            style={{ fontFamily: "'Bubblegum Sans', cursive", color: "#10B981" }}
          >
            ✨ A Peek Inside the App
          </h2>
          <p
            className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base font-bold"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Swipe-free tour — see all the magic at once!
          </p>

          <div className="phone-marquee-wrapper">
            {/* Side fades */}
            <div className="phone-marquee-fade phone-marquee-fade-left" />
            <div className="phone-marquee-fade phone-marquee-fade-right" />

            <div className="phone-marquee-track">
              {marqueeImages.map((src, idx) => (
                <div
                  key={idx}
                  className="phone-card"
                  style={{ ['--i' as any]: idx % APP_SAMPLE_IMAGES.length }}
                >
                  <div className="phone-frame">
                    <div className="phone-notch" />
                    <div className="phone-screen">
                      <img
                        src={src}
                        alt={`AlifUjala app screenshot ${(idx % APP_SAMPLE_IMAGES.length) + 1}`}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="phone-shine" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div className="max-w-5xl mx-auto mb-10">
          <h2 
            className="text-2xl sm:text-3xl font-bold text-center mb-8"
            style={{ fontFamily: "'Bubblegum Sans', cursive", color: "#7C3AED" }}
          >
             App Features 
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {APP_FEATURES.map((feature, i) => (
              <div 
                key={i}
                className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-5 border-3 border-purple-100 dark:border-purple-800 shadow-candy hover:shadow-candy-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div className="text-4xl mb-3">{feature.emoji}</div>
                <h3 
                  className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-2"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-gray-600 dark:text-gray-300 text-sm"
                  style={{ fontFamily: "'Comic Neue', cursive" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-center text-white shadow-xl border-4 border-white/20">
            <h3 
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              🚀 Start Learning Today!
            </h3>
            <p 
              className="text-white/90 text-base mb-5"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Join thousands of kids learning Urdu with AlifUjala. Download now and begin the adventure!
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-purple-700 font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              📥 Download Now
            </a>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .phone-marquee-wrapper {
          position: relative;
          width: 100%;
          padding: 32px 0 24px;
          overflow: hidden;
          perspective: 1400px;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 8%,
            #000 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 8%,
            #000 92%,
            transparent 100%
          );
        }

        .phone-marquee-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 5;
          pointer-events: none;
        }
        .phone-marquee-fade-left {
          left: 0;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.6),
            transparent
          );
        }
        .phone-marquee-fade-right {
          right: 0;
          background: linear-gradient(
            to left,
            rgba(255, 255, 255, 0.6),
            transparent
          );
        }
        :global(.dark) .phone-marquee-fade-left {
          background: linear-gradient(to right, rgba(17, 24, 39, 0.7), transparent);
        }
        :global(.dark) .phone-marquee-fade-right {
          background: linear-gradient(to left, rgba(17, 24, 39, 0.7), transparent);
        }

        .phone-marquee-track {
          display: flex;
          gap: 28px;
          width: max-content;
          animation: phoneMarquee 50s linear infinite;
          transform-style: preserve-3d;
          will-change: transform;
          padding: 24px 16px;
        }
        .phone-marquee-wrapper:hover .phone-marquee-track {
          animation-play-state: paused;
        }

        @keyframes phoneMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .phone-card {
          flex: 0 0 auto;
          width: 360px;
          transform: translateY(calc((var(--i, 0) % 2) * -14px));
          transition: transform 0.5s ease, filter 0.5s ease;
          filter: drop-shadow(0 18px 28px rgba(16, 185, 129, 0.25))
            drop-shadow(0 8px 12px rgba(124, 58, 237, 0.18));
        }
        .phone-card:hover {
          transform: translateY(-10px) scale(1.05);
          filter: drop-shadow(0 24px 36px rgba(16, 185, 129, 0.45))
            drop-shadow(0 10px 16px rgba(124, 58, 237, 0.3));
          z-index: 10;
        }

        @media (min-width: 640px) {
          .phone-card { width: 420px; }
        }
        @media (min-width: 1024px) {
          .phone-card { width: 480px; }
        }

        .phone-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: linear-gradient(145deg, #1f2937, #0b1220 60%, #111827);
          border-radius: 32px;
          padding: 10px;
          box-shadow:
            inset 0 0 0 2px rgba(255, 255, 255, 0.08),
            inset 0 0 0 4px rgba(255, 255, 255, 0.04),
            0 6px 20px rgba(0, 0, 0, 0.35);
          overflow: hidden;
        }

        .phone-notch {
          position: absolute;
          top: 50%;
          left: 8px;
          transform: translateY(-50%);
          width: 14px;
          height: 38%;
          background: #000;
          border-radius: 0 14px 14px 0;
          z-index: 3;
        }

        .phone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 22px;
          overflow: hidden;
          background: #0f172a;
        }
        .phone-screen img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          user-select: none;
          background: #0f172a;
        }

        .phone-shine {
          position: absolute;
          inset: 0;
          border-radius: 32px;
          background: linear-gradient(
            115deg,
            transparent 0%,
            transparent 38%,
            rgba(255, 255, 255, 0.18) 50%,
            transparent 62%,
            transparent 100%
          );
          pointer-events: none;
          mix-blend-mode: screen;
        }

        @media (prefers-reduced-motion: reduce) {
          .phone-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
