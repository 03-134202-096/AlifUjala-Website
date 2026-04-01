
import HeroWithFire from "@/components/hero/HeroWithFire";
import WelcomeHeader from "@/components/home_except_hero/WelcomeHeader";
import SleepingCards from "@/components/home_except_hero/hoverToShowContent";
import VideoEmbed    from "@/components/home_except_hero/VideoEmbed";
import SEO from "@/components/SEO";

export const dynamic = "force-static";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

/* Floating decorative elements */
function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-20 left-[5%] text-4xl animate-float opacity-20">🌟</div>
      <div className="absolute top-40 right-[8%] text-3xl animate-float-delay opacity-20">🎈</div>
      <div className="absolute top-[60%] left-[3%] text-3xl animate-bounce-slow opacity-15">🦋</div>
      <div className="absolute top-[70%] right-[5%] text-4xl animate-float opacity-15">☁️</div>
      <div className="absolute bottom-40 left-[15%] text-2xl animate-float-delay opacity-15">⭐</div>
    </div>
  );
}

/* Quick access section for kids */
function QuickAccess() {
  const items = [
    { href: "/activity", emoji: "✨", label: "Activities!", bg: "from-indigo-500 to-purple-500", shadow: "shadow-lg" },
    { href: "/games", emoji: "🎮", label: "Play Games!", bg: "from-violet-500 to-purple-500", shadow: "shadow-lg" },
    { href: "/stories", emoji: "📖", label: "Read Stories!", bg: "from-purple-500 to-indigo-500", shadow: "shadow-lg" },
  ];
  return (
    <section className="py-10 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
        What do you want to do? 🤔
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {items.map((item, i) => (
          <Link key={i} href={item.href} className={`group bg-gradient-to-br ${item.bg} ${item.shadow} rounded-3xl p-6 sm:p-8 text-center text-white transition-all duration-300 hover:scale-105 hover:-rotate-1 border-2 border-white/30`}>
            <div className="text-5xl sm:text-6xl mb-3 group-hover:animate-wiggle">{item.emoji}</div>
            <p className="text-lg sm:text-xl font-bold" style={{fontFamily: "'Bubblegum Sans', cursive"}}>{item.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* Fun facts ticker */
function FunFacts() {
  const facts = [
    "🌟 Urdu has 39 letters in its alphabet!",
    "📝 Urdu is written from right to left!",
    "🎨 The word 'Urdu' means 'army' in Turkish!",
    "🌍 Over 230 million people speak Urdu!",
    "✨ Alif (ا) is the first Urdu letter!",
  ];
  return (
    <section className="py-8 px-4 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-2 border-indigo-200 dark:border-indigo-700 rounded-3xl p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-center mb-4" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
          Did You Know? 🤓
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facts.map((fact, i) => (
            <div key={i} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-3 text-sm sm:text-base font-bold text-gray-700 dark:text-gray-200 border border-indigo-100 dark:border-indigo-700" style={{fontFamily: "'Comic Neue', cursive"}}>
              {fact}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Alif Ujala",
    "url": "https://alifujala.ai",
    "description": "Alif Ujala is a fun, interactive platform for children to learn Urdu alphabets through games, stories, and activities.",
    "inLanguage": ["en", "ur"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://alifujala.ai/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alif Ujala",
      "url": "https://alifujala.ai",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alifujala.ai/images/logo.png"
      }
    }
  }

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Learn Urdu Alphabets for Kids — Fun Games & Stories"
        description="Alif Ujala is a free, interactive Urdu learning platform for children. Play matching games, watch stories, and learn all 39 Urdu letters — اردو سیکھیں!"
        ogUrl="https://alifujala.ai"
        structuredData={structuredData}
      />
      <FloatingDecorations />
      <Navbar />
      <HeroWithFire />
      <main className="relative z-10 flex-1">
        <div className="container mx-auto py-6 px-4 text-center">
          <WelcomeHeader />
        </div>
        <QuickAccess />
        <SleepingCards />
        <FunFacts />
        <div className="container mx-auto px-4 pb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
            Watch & Learn! 🎬
          </h2>
          <VideoEmbed
            src="https://www.youtube.com/embed/HKTHE_jDd60?autoplay=1&mute=1&controls=1&rel=0"
            title="Child Learning"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}


