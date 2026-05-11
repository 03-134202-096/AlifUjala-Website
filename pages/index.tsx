

import HeroWithFire from "@/components/hero/HeroWithFire";
import WelcomeHeader from "@/components/home_except_hero/WelcomeHeader";
import SleepingCards from "@/components/home_except_hero/hoverToShowContent";
import VideoEmbed    from "@/components/home_except_hero/VideoEmbed";
import SEO from "@/components/SEO";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs } from "@/components/ui";

/* Quick access section for kids — bigger, animated cards with shine sweep */
function QuickAccess() {
  const items = [
    { href: "/activity",  emoji: "✨", label: "Activities",   sub: "Worksheets & fun tasks", grad: "from-fuchsia-500 via-purple-500 to-indigo-500", glow: "hover:shadow-glow-purple" },
    { href: "/games",     emoji: "🎮", label: "Play Games",   sub: "14+ playful Urdu games", grad: "from-emerald-500 via-teal-500 to-cyan-500",     glow: "hover:shadow-glow-green" },
    { href: "/stories",   emoji: "📖", label: "Read Stories", sub: "Animated visual tales",  grad: "from-rose-500 via-pink-500 to-fuchsia-500",      glow: "hover:shadow-glow-pink" },
    { href: "/edu-videos",emoji: "🎬", label: "Edu Videos",   sub: "Watch & learn",          grad: "from-amber-400 via-orange-500 to-rose-500",      glow: "hover:shadow-candy-lg" },
  ];
  return (
    <section className="relative py-12 px-4">
      <SectionHeader
        eyebrow="Pick your adventure"
        emoji="🤔"
        title="What do you want to do?"
        subtitle="Tap any card to start exploring — every section is bursting with fun!"
        tone="rainbow"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className={`group relative overflow-hidden rounded-3xl border-[3px] border-white/40 dark:border-white/10 shadow-candy ${item.glow} p-5 sm:p-6 text-center text-white transition-all duration-500 hover:-translate-y-2 hover:rotate-[-1deg] focus:-translate-y-2 focus:rotate-[-1deg]`}
            style={{
              backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
          >
            <span className={`absolute inset-0 bg-gradient-to-br ${item.grad} -z-0`} />
            {/* shine sweep */}
            <span className="pointer-events-none absolute -inset-y-2 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-[260%] transition-all duration-700 ease-out" />
            <div className="relative">
              <div className="text-5xl sm:text-6xl mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:animate-wiggle drop-shadow-md">
                {item.emoji}
              </div>
              <p className="text-lg sm:text-xl font-bold drop-shadow" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{item.label}</p>
              <p className="text-xs sm:text-sm font-bold opacity-90 mt-1" style={{ fontFamily: "'Comic Neue', cursive" }}>{item.sub}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold bg-white/25 backdrop-blur px-3 py-1 rounded-full border border-white/40 group-hover:bg-white/40 transition" style={{ fontFamily: "'Comic Neue', cursive" }}>
                Start <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* Stats strip — gives the page authority and "real product" feel */
function StatsStrip() {
  const stats = [
    { num: "39",   label: "Urdu letters", emoji: "🔤" },
    { num: "14+",  label: "Fun games",    emoji: "🎮" },
    { num: "100+", label: "Activities",   emoji: "✨" },
    { num: "Free", label: "Forever",      emoji: "🆓" },
  ];
  return (
    <section className="relative px-4 -mt-2">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <KidsCard key={i} variant="glass" tone="purple" padding="sm" className="text-center">
            <div className="text-2xl sm:text-3xl mb-1">{s.emoji}</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gradient" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{s.num}</div>
            <div className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 mt-0.5" style={{ fontFamily: "'Comic Neue', cursive" }}>{s.label}</div>
          </KidsCard>
        ))}
      </div>
    </section>
  );
}

/* Fun facts ticker — refreshed with gradient cards */
function FunFacts() {
  const facts = [
    { icon: "🌟", text: "Urdu has 39 letters in its alphabet!" },
    { icon: "📝", text: "Urdu is written from right to left!" },
    { icon: "🎨", text: "The word 'Urdu' means 'army' in Turkish!" },
    { icon: "🌍", text: "Over 230 million people speak Urdu worldwide!" },
    { icon: "✨", text: "Alif (ا) is the very first Urdu letter!" },
    { icon: "📚", text: "Urdu shares its script family with Arabic & Persian!" },
  ];
  return (
    <section className="py-10 px-4 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="Fun facts"
        emoji="🤓"
        title="Did you know?"
        subtitle="A few magical facts about the beautiful Urdu language."
        tone="cool"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact, i) => (
          <KidsCard key={i} variant="glass" tone={["purple","pink","blue","green","amber","indigo"][i % 6] as any} padding="md" className="flex items-start gap-3">
            <div className="text-3xl flex-shrink-0 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{fact.icon}</div>
            <p className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-100 leading-snug" style={{ fontFamily: "'Comic Neue', cursive" }}>
              {fact.text}
            </p>
          </KidsCard>
        ))}
      </div>
    </section>
  );
}

/* App promo strip just above the footer */
function AppPromo() {
  return (
    <section className="px-4 py-12">
      <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden border-[3px] border-white/40 dark:border-white/10 shadow-candy-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 -z-10" />
        <div className="absolute inset-0 bg-aurora opacity-60 mix-blend-screen pointer-events-none" />
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 sm:p-10 text-white">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur border border-white/30 rounded-full px-3 py-1" style={{ fontFamily: "'Comic Neue', cursive" }}>
              📱 Mobile App
            </p>
            <h3 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight drop-shadow" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              Take AlifUjala on the go!
            </h3>
            <p className="mt-2 text-white/90 text-base sm:text-lg font-bold" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Free Android app with games, voice support, and offline learning.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <KidsButton href="/our-app" variant="ghost" size="md" iconRight={<span>→</span>}>
                See app features
              </KidsButton>
              <KidsButton
                href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
                external
                variant="warm"
                size="md"
                iconLeft={<span>▶</span>}
              >
                Get on Google Play
              </KidsButton>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-white/20 blur-2xl animate-pulse" />
              <div className="relative w-44 h-44 rounded-[2rem] bg-white/95 dark:bg-white/90 grid place-items-center shadow-2xl border-4 border-white/70 animate-float">
                <span className="text-7xl">📱</span>
              </div>
            </div>
          </div>
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
      <DecorativeBlobs variant="soft" emojis={["🌟","🎈","🦋","☁️","⭐"]} />
      <Navbar />
      <HeroWithFire />
      <main className="relative z-10 flex-1">
        <div className="container mx-auto py-6 px-4 text-center">
          <WelcomeHeader />
        </div>

        <StatsStrip />
        <QuickAccess />
        <SleepingCards />
        <FunFacts />

        <div className="container mx-auto px-4 pb-10">
          <SectionHeader
            eyebrow="Watch & learn"
            emoji="🎬"
            title="A taste of our learning videos"
            subtitle="Short, lively videos kids love — and parents trust."
            tone="warm"
          />
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-[3px] border-white/60 dark:border-white/10 shadow-candy-lg">
            <VideoEmbed
              src="https://www.youtube.com/embed/HKTHE_jDd60?autoplay=1&mute=1&controls=1&rel=0"
              title="Child Learning"
            />
          </div>
        </div>

        <AppPromo />
      </main>
      <Footer />
    </div>
  );
}


