import LearningHero from "@/components/hero/LearningHero";
import WelcomeHeader from "@/components/home_except_hero/WelcomeHeader";
import SleepingCards from "@/components/home_except_hero/hoverToShowContent";
import VideoEmbed    from "@/components/home_except_hero/VideoEmbed";
import SEO from "@/components/SEO";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs, LearningIcon, IconBadge, type LearningIconName } from "@/components/ui";
import { blogPosts } from "@/data/blogPosts";
import { GAME_GUIDES } from "@/data/gameGuides";
import { storyGuides } from "@/data/storyGuides";

/* Real counts taken from the site's own data, so the numbers on the page always stay accurate. */
const GAME_COUNT = Object.keys(GAME_GUIDES).length;
const STORY_COUNT = storyGuides.length;

/* FAQ content — used for both the visible FAQ section and the FAQPage structured data. */
const FAQS = [
  { q: "Is Alif Ujala free to use?", a: "Yes. All of Alif Ujala's games, worksheets, stories, videos and parent guides are free, and you do not need an account to start learning." },
  { q: "What age group is Alif Ujala designed for?", a: "Alif Ujala is designed for children aged roughly 3 to 10 who are learning to recognise, sound out and write Urdu letters, and for the parents and teachers helping them. Each game page says which ages it suits best." },
  { q: "How many letters are in the Urdu alphabet?", a: "Most Pakistani school primers teach 39 letters, from alif (ا) to bari yay (ے). Some charts count 37, because ھ (do-chashmi hay) and ں (noon ghunna) are treated as special forms. Our Urdu alphabet guide explains every letter with its sound and an example word." },
  { q: "Where should we start?", a: "Start with alif and the first letter family (ب پ ت ٹ ث) from our Urdu alphabet guide, play a few minutes of Alphabet Match, then print a tracing worksheet. Our article on teaching Urdu letters by family sets out a simple 12-week plan." },
  { q: "Can kids learn Urdu online without a tutor?", a: "Children can practise a lot on their own with games, stories and worksheets, but they learn fastest with an adult nearby to say the sounds aloud, praise effort and talk about the pictures. Our parent guides show how to help in about ten minutes a day." },
  { q: "Is there a mobile app for Alif Ujala?", a: "Yes, Alif Ujala has a free Android app with offline learning support, available on Google Play." },
];

/* Quick access section for kids — bigger, animated cards with shine sweep */
function QuickAccess() {
  const items = [
    { href: "/activity",  icon: 'worksheet', label: "Activities",   sub: "Worksheets & fun tasks", grad: "from-fuchsia-700 via-purple-700 to-indigo-700", glow: "hover:shadow-glow-purple" },
    { href: "/games",     icon: 'gamepad', label: "Play Games",   sub: "Letter games for every skill", grad: "from-emerald-700 via-teal-700 to-cyan-800",     glow: "hover:shadow-glow-green" },
    { href: "/stories",   icon: 'book', label: "Read Stories", sub: "Illustrated moral stories", grad: "from-rose-700 via-pink-700 to-fuchsia-700",      glow: "hover:shadow-glow-pink" },
    { href: "/edu-videos",icon: 'play', label: "Edu Videos",   sub: "Watch & learn",          grad: "from-amber-800 via-orange-800 to-rose-700",      glow: "hover:shadow-candy-lg" },
  ];
  return (
    <section className="relative py-12 px-4">
      <SectionHeader
        eyebrow="Pick your adventure"
        icon="puzzle"
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
            <span className="pointer-events-none absolute -inset-y-2 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-[260%] transition-all duration-700 ease-out" />
            <div className="relative">
              <div className="text-5xl sm:text-6xl mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:animate-wiggle drop-shadow-md">
                <IconBadge name={item.icon as LearningIconName} size="lg" />
              </div>
              <p className="text-lg sm:text-xl font-bold drop-shadow" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{item.label}</p>
              <p className="text-xs sm:text-sm font-bold text-white mt-1" style={{ fontFamily: "'Comic Neue', cursive" }}>{item.sub}</p>
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

/* Stats strip — real numbers from the site data */
function StatsStrip() {
  const stats = [
    { num: "39",                label: "Urdu letters",        icon: 'letters' },
    { num: String(GAME_COUNT),  label: "Games & activities",  icon: 'gamepad' },
    { num: String(STORY_COUNT), label: "Illustrated stories", icon: 'book' },
    { num: "Free",              label: "No sign-up needed",   icon: 'heart' },
  ];
  return (
    <section className="relative px-4 -mt-2">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <KidsCard key={i} variant="glass" tone="purple" padding="sm" className="text-center">
            <div className="mb-2"><IconBadge name={s.icon as LearningIconName} /></div>
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
    { icon: 'letters', text: "Most Urdu primers teach 39 letters, from alif (ا) to bari yay (ے)!" },
    { icon: 'pencil', text: "Urdu is written from right to left, but numbers go left to right!" },
    { icon: 'book', text: "The name 'Urdu' comes from a Turkic word for an army camp!" },
    { icon: 'sparkles', text: "Many letters share one shape — only their dots (نقطے) are different!" },
    { icon: 'bulb', text: "Ten Urdu letters never join to the letter after them!" },
    { icon: 'book', text: "Urdu shares its script family with Arabic & Persian!" },
  ];
  return (
    <section className="py-10 px-4 max-w-5xl mx-auto">
      <SectionHeader
        eyebrow="Fun facts"
        icon="bulb"
        title="Did you know?"
        subtitle="A few magical facts about the beautiful Urdu language."
        tone="cool"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((fact, i) => (
          <KidsCard key={i} variant="glass" tone={["purple","pink","blue","green","amber","indigo"][i % 6] as any} padding="md" className="flex items-start gap-3">
            <IconBadge name={fact.icon as LearningIconName} />
            <p className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-100 leading-snug" style={{ fontFamily: "'Comic Neue', cursive" }}>
              {fact.text}
            </p>
          </KidsCard>
        ))}
      </div>
    </section>
  );
}

/* FAQ section — the same FAQS list also feeds the FAQPage structured data in Home(). */
function FAQSection() {
  const faqs = FAQS;
  return (
    <section className="py-10 px-4 max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Got questions?"
        icon="question"
        title="Frequently Asked Questions"
        subtitle="Everything parents ask us about learning Urdu with Alif Ujala."
        tone="cool"
      />
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <details key={i} className="group rounded-2xl border-2 border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4">
            <summary className="cursor-pointer font-bold text-gray-800 dark:text-gray-100 list-none flex justify-between items-center" style={{ fontFamily: "'Comic Neue', cursive" }}>
              {item.q}
              <span className="ml-2 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* Guides for parents & teachers — links the alphabet guide and the newest articles */
function ParentGuides() {
  const latest = blogPosts.slice(0, 3);
  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <SectionHeader
        eyebrow="For parents & teachers"
        icon="bulb"
        title="Guides to help you teach Urdu"
        subtitle="Practical, step-by-step advice for helping children read and write Urdu at home or in class."
        tone="warm"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/urdu-alphabet"
          className="group relative overflow-hidden rounded-3xl border-[3px] border-white/50 dark:border-white/10 shadow-candy hover:shadow-candy-lg hover:-translate-y-1 transition-all p-6 text-white flex flex-col"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 -z-0" />
          <div className="relative flex flex-col h-full">
            <p lang="ur" dir="rtl" className="text-4xl text-right" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", lineHeight: 2 }}>ا ب پ ت</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-white/90" style={{ fontFamily: "'Comic Neue', cursive" }}>Complete guide</p>
            <h3 className="mt-1 text-2xl font-bold leading-tight" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>The Urdu Alphabet for Kids</h3>
            <p className="mt-2 text-sm text-white/95 flex-1" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Every letter with its sound, an example word, its dots and its letter family, plus a 10-minute daily routine.
            </p>
            <span className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-bold bg-white/25 px-3 py-1 rounded-full border border-white/40 group-hover:bg-white/40 transition" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Open the guide <span aria-hidden>→</span>
            </span>
          </div>
        </Link>
        {latest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-3xl overflow-hidden border-2 border-white/60 dark:border-white/10 bg-white/90 dark:bg-gray-800/90 shadow-candy hover:shadow-candy-lg hover:-translate-y-1 transition-all flex flex-col"
          >
            <img src={post.coverImage} alt="" loading="lazy" className="h-36 w-full object-cover" />
            <div className="p-4 flex flex-col flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300" style={{ fontFamily: "'Comic Neue', cursive" }}>{post.category} · {post.readTime}</p>
              <h3 className="mt-1 text-lg font-bold leading-snug text-gray-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{post.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3" style={{ fontFamily: "'Comic Neue', cursive" }}>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <KidsButton href="/blog" variant="primary" size="md" iconLeft={<LearningIcon name="book" />}>Read all articles</KidsButton>
        <KidsButton href="/stories" variant="outline" size="md" iconLeft={<LearningIcon name="sparkles" />}>Illustrated Urdu stories</KidsButton>
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
              <LearningIcon name="mobile" /> Mobile App
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight drop-shadow" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              Take AlifUjala on the go!
            </h2>
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
              <div className="relative w-44 h-44 rounded-[2rem] bg-white/95 dark:bg-white/90 grid place-items-center shadow-2xl border-4 border-white/70 text-violet-700">
                <LearningIcon name="mobile" className="!w-28 !h-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  // Organization and WebSite schema come from <SEO>; this page adds its FAQ.
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  };

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Learn Urdu Alphabets for Kids"
        description="Free Urdu learning for kids: an illustrated Urdu alphabet guide, letter games, printable worksheets, narrated Urdu moral stories and practical guides for parents. اردو سیکھیں!"
        ogUrl="https://alifujala.ai"
        structuredData={faqData}
      />
      <DecorativeBlobs variant="soft" motifs={["book","pencil","letters"]} />
      <Navbar />
      <LearningHero />
      <main className="relative z-10 flex-1">
        <div className="container mx-auto py-6 px-4 text-center">
          <WelcomeHeader />
          <p className="max-w-2xl mx-auto mt-4 text-sm sm:text-base font-bold text-gray-600 dark:text-gray-300 leading-relaxed" style={{ fontFamily: "'Comic Neue', cursive" }}>
            Alif Ujala is a free, interactive platform that helps children learn the Urdu alphabet through colorful games, animated stories, and printable worksheets. Whether your child is just starting to recognize the 39 letters of Urdu or practicing to write them, Alif Ujala makes learning Urdu online fun, easy, and effective — for kids growing up at home or abroad. Parents and teachers will also find a{' '}
            <Link href="/urdu-alphabet" className="underline underline-offset-2 text-indigo-700 dark:text-indigo-300">complete Urdu alphabet guide</Link> and{' '}
            <Link href="/blog" className="underline underline-offset-2 text-indigo-700 dark:text-indigo-300">step-by-step teaching articles</Link>.
          </p>
        </div>

        <StatsStrip />
        <QuickAccess />
        <SleepingCards />
        <FunFacts />
        {/* Parent resources sit together: practical guides, then the parents' FAQ */}
        <ParentGuides />
        <FAQSection />

        <div className="container mx-auto px-4 pb-10">
          <SectionHeader
            eyebrow="Watch & learn"
            icon="play"
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
