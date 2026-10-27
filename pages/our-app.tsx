import { LearningIcon, IconBadge, type LearningIconName } from '@/components/ui'
import React from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SEO from "@/components/SEO"
import { KidsCard, KidsButton, SectionHeader, DecorativeBlobs } from "@/components/ui"

const APP_SAMPLE_IMAGES = Array.from({ length: 11 }, (_, i) => `/images/AppSampleImages/${i + 1}.jpeg`)

type FeatureTone = 'purple' | 'green' | 'pink' | 'blue' | 'amber' | 'indigo'
const APP_FEATURES: { icon: LearningIconName; title: string; description: string; tone: FeatureTone }[] = [
  { icon: 'pencil', title: "Letter Tracing Activities", description: "Guided dotted-line tracing teaches each Urdu letter stroke by stroke — kids learn to form every حرف correctly!", tone: 'indigo' },
  { icon: 'book', title: "AI Story Generation",   description: "Kids pick a character and a topic — the app crafts a brand-new Urdu story just for them, instantly!", tone: 'pink' },
  { icon: 'palette', title: "Profession Figure Generator", description: "Child chooses a favorite profession, taps generate, and gets a personalized figure of themselves in that role!", tone: 'amber' },
  { icon: 'gamepad', title: "Interactive Activities", description: "Fun games and activities to learn Urdu letters through play!", tone: 'purple' },
  { icon: 'chart', title: "Progress Tracker",      description: "Track your child's learning journey and celebrate milestones!", tone: 'blue' },
  { icon: 'audio', title: "Voice Support",         description: "Listen to correct pronunciations of Urdu letters and words!", tone: 'green' },
]

type HighlightTone = 'indigo' | 'pink' | 'amber'
type FeatureHighlight = {
  tag: string
  title: string
  tagline: string
  description: string
  steps: string[]
  icon: LearningIconName
  tone: HighlightTone
  accent: string
  figure: string
}

const FEATURE_HIGHLIGHTS: FeatureHighlight[] = [
  {
    tag: 'Writing practice',
    title: 'Letter Tracing Activities',
    tagline: 'Teach your child every Urdu letter — the right way.',
    description:
      "Each lesson walks the child through a dotted outline of an Urdu letter. They follow the path with a finger, hear the sound, and build confident muscle memory for correct letter formation.",
    steps: [
      'Pick a letter from Alif (ا) to Yay (ی).',
      'Trace the dotted shape — a star marks the start point.',
      'The app praises every stroke and tracks progress.',
    ],
    icon: 'pencil',
    tone: 'indigo',
    accent: 'from-indigo-500 via-violet-500 to-purple-600',
    figure: '/images/AppFeatureFigures/workSheet.webp',
  },
  {
    tag: 'AI storytelling',
    title: 'Stories Generation',
    tagline: "Your child's imagination becomes a brand-new Urdu story.",
    description:
      "The child picks a character — a bear, a princess, a robot — and chooses a topic like friendship or courage. The app then crafts a fresh, age-appropriate Urdu story around their choices, every single time.",
    steps: [
      'Choose a character the child loves.',
      'Pick a topic — kindness, adventure, honesty, more.',
      'Tap Generate and read the fresh story together.',
    ],
    icon: 'book',
    tone: 'pink',
    accent: 'from-rose-500 via-pink-500 to-fuchsia-600',
    figure: '/images/AppFeatureFigures/story.webp',
  },
  {
    tag: 'Dream big',
    title: 'Profession Figure Generation',
    tagline: 'What will your child be when they grow up?',
    description:
      "Doctor, pilot, astronaut, teacher, cricketer — the child selects their favorite profession and taps generate. In seconds, the app produces a cheerful figure of them wearing that role's outfit, ready to be saved and shared.",
    steps: [
      'Browse a gallery of professions.',
      'Tap one and press Generate.',
      'See a personalized figure appear — save or share it.',
    ],
    icon: 'palette',
    tone: 'amber',
    accent: 'from-amber-500 via-orange-500 to-rose-500',
    figure: '/images/AppFeatureFigures/profession.webp',
  },
]


function PageDecorations() {
  return <DecorativeBlobs variant="soft" motifs={["mobile","pencil"]} />
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
        <SectionHeader
          eyebrow="Mobile App"
          icon="mobile"
          title={<span>AlifUjala <span className="text-gradient-cool">Mobile App</span></span>}
          subtitle="Learn Urdu on the go! Download our free app and start your learning adventure."
          tone="cool"
        />

        {/* Screenshots Showcase — 3D auto-scrolling phone coverflow (FIRST so users see features immediately) */}
        <section className="mb-10" aria-label="App Screenshots Showcase">
          <SectionHeader
            eyebrow="Tour"
            icon="search"
            title="A peek inside the app"
            subtitle="Swipe-free tour — see all the magic at once!"
            tone="cool"
            className="!mb-6"
          />

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

        {/* Download CTA (now BELOW the screenshots showcase) */}
        <div className="max-w-3xl mx-auto mb-12">
          <KidsCard variant="gradient" tone="green" padding="lg" className="text-center relative overflow-hidden">
            <span className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-green-300/40 blur-3xl" aria-hidden />
            <h2
              className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-3"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              <IconBadge name="download" size="sm" className="mr-2" />Download Free!
            </h2>
            <p
              className="text-gray-700 dark:text-gray-200 mb-6 text-base sm:text-lg max-w-xl mx-auto"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Get the AlifUjala app on your phone and let your child learn Urdu anywhere, anytime!
            </p>

            <KidsButton
              href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
              external
              variant="success"
              size="lg"
              iconLeft={
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
              }
            >
              Get on Google Play
            </KidsButton>

            <p
              className="text-emerald-700/70 dark:text-emerald-300/70 text-sm mt-4 font-bold"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              📲 Available for Android devices
            </p>

            <div className="grid grid-cols-3 gap-3 mt-6 max-w-md mx-auto">
              {[
                { icon: '🆓', label: 'Free' },
                { icon: '👶', label: 'Ages 3+' },
                { icon: '🎓', label: 'Educational' },
              ].map((c, i) => (
                <div key={i} className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl p-3 text-center border-2 border-white/60 dark:border-white/[0.15] shadow-sm">
                  <div className="mb-2"><IconBadge name={(['heart', 'users', 'book'] as LearningIconName[])[i]} /></div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-100" style={{ fontFamily: "'Comic Neue', cursive" }}>{c.label}</p>
                </div>
              ))}
            </div>
          </KidsCard>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mb-14">
          <SectionHeader
            eyebrow="What you get"
            icon="palette"
            title="App Features"
            subtitle="Everything kids need for a joyful, screen-friendly Urdu journey."
            tone="rainbow"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {APP_FEATURES.map((feature, i) => (
              <KidsCard key={i} variant="glass" tone={feature.tone} padding="md" className="group">
                <div className="flex items-start gap-3">
                  <IconBadge name={feature.icon} size="lg" />
                  <div>
                    <h3
                      className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-1"
                      style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-gray-700 dark:text-gray-200 text-sm leading-snug"
                      style={{ fontFamily: "'Comic Neue', cursive" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </KidsCard>
            ))}
          </div>
        </div>

        {/* Feature deep-dives — tracing / stories / profession figure */}
        <section className="max-w-6xl mx-auto mb-14" aria-label="App feature deep-dives">
          <SectionHeader
            eyebrow="Three magical features"
            icon="bulb"
            title="See how the app teaches, imagines & inspires"
            subtitle="A closer look at the activities kids love most — and parents trust."
            tone="warm"
          />

          <div className="space-y-8">
            {FEATURE_HIGHLIGHTS.map((feature, i) => (
              <article
                key={feature.title}
                className={`relative overflow-hidden rounded-[2rem] border-[3px] border-white/60 dark:border-white/10 shadow-candy-lg bg-white/80 dark:bg-indigo-950/70 backdrop-blur-md`}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${feature.accent}`}
                  aria-hidden
                />
                <div
                  className={`grid grid-cols-1 md:grid-cols-5 gap-6 p-6 sm:p-8 ${
                    i % 2 === 1 ? 'md:[&>*:first-child]:order-last' : ''
                  }`}
                >
                  {/* Illustration tile — real app figure */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div
                      className={`relative w-full max-w-sm aspect-[4/5] rounded-3xl bg-gradient-to-br ${feature.accent} p-4 flex items-center justify-center shadow-xl border-4 border-white/60`}
                    >
                      <div className="absolute inset-4 rounded-2xl border-2 border-dashed border-white/40 pointer-events-none" />
                      <img
                        src={feature.figure}
                        alt={`${feature.title} — ${feature.tagline}`}
                        loading="lazy"
                        className="relative z-10 w-full h-full object-contain drop-shadow-xl rounded-2xl"
                      />
                      {/* tag chip */}
                      <p
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-xs font-bold uppercase tracking-[0.2em] text-white bg-black/35 border border-white/40 rounded-full px-3 py-1 backdrop-blur-sm whitespace-nowrap"
                        style={{ fontFamily: "'Comic Neue', cursive" }}
                      >
                        {feature.tag}
                      </p>
                      {/* corner sparkles */}
                      <span className="absolute top-3 left-3 text-xl text-white/80 z-20">✦</span>
                      <span className="absolute top-4 right-4 text-lg text-white/70 z-20">✧</span>
                      <span className="absolute bottom-3 right-3 text-xl text-white/80 z-20">✦</span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="md:col-span-3 flex flex-col justify-center">
                    <p
                      className="text-xs font-bold uppercase tracking-widest text-purple-500 dark:text-purple-300 mb-2"
                      style={{ fontFamily: "'Comic Neue', cursive" }}
                    >
                      Feature {i + 1} of 3 · {feature.tag}
                    </p>
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-200 mb-2"
                      style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-200 mb-3"
                      style={{ fontFamily: "'Comic Neue', cursive" }}
                    >
                      {feature.tagline}
                    </p>
                    <p
                      className="text-gray-700 dark:text-gray-200 leading-relaxed mb-5"
                      style={{ fontFamily: "'Comic Neue', cursive" }}
                    >
                      {feature.description}
                    </p>
                    <ol className="space-y-2.5">
                      {feature.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-100"
                          style={{ fontFamily: "'Comic Neue', cursive" }}
                        >
                          <span
                            className={`shrink-0 w-7 h-7 rounded-full bg-gradient-to-br ${feature.accent} text-white font-bold flex items-center justify-center shadow-md`}
                          >
                            {idx + 1}
                          </span>
                          <span className="font-bold leading-snug pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>


        {/* Call to Action */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative rounded-[2rem] p-6 sm:p-10 text-center text-white overflow-hidden border-[3px] border-white/30 shadow-candy-lg">
            <span className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 -z-10" />
            <span className="absolute inset-0 bg-aurora opacity-60 mix-blend-screen pointer-events-none" />
            <h3
              className="text-2xl sm:text-3xl font-bold mb-3 drop-shadow"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              <IconBadge name="book" size="sm" className="mr-2" />Start Learning Today!
            </h3>
            <p
              className="text-white/90 text-base sm:text-lg mb-6 max-w-xl mx-auto"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Join thousands of kids learning Urdu with AlifUjala. Download now and begin the adventure!
            </p>
            <KidsButton
              href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala"
              external
              variant="warm"
              size="lg"
              iconLeft={<LearningIcon name="download" />}
            >
              Download Now
            </KidsButton>
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
