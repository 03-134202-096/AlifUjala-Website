import { useState } from "react";
import Stories from "../components/Stories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Link from "next/link";
import { SectionHeader, DecorativeBlobs, KidsCard, IconBadge, TranslationToggle } from "@/components/ui";
import { storyGuides, urduAges } from "@/data/storyGuides";

const SITE_URL = "https://alifujala.ai";
const BODY_FONT = { fontFamily: "'Comic Neue', cursive" };
const HEAD_FONT = { fontFamily: "'Bubblegum Sans', cursive" };

/** Story titles (English + Urdu) used to build the ItemList structured data. */
const STORY_LIST = storyGuides.map((s) => ({ en: s.titleEn, ur: s.titleUr, slug: s.slug }));

const storiesStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Urdu Stories for Kids",
  description:
    "A free collection of animated Urdu moral stories (اردو کہانیاں) for children, with pictures and simple Urdu text.",
  url: `${SITE_URL}/stories`,
  inLanguage: ["ur", "en"],
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: {
    "@type": "ItemList",
    name: "Urdu Stories for Kids",
    numberOfItems: STORY_LIST.length,
    itemListElement: STORY_LIST.map((story, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: `${story.en} / ${story.ur}`,
        inLanguage: "ur",
        url: `${SITE_URL}/stories/${story.slug}`,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  },
};

/** Urdu label with a small English one, for the pill above a heading (no letter-spacing, so the Urdu letters stay joined). */
function UrduEyebrow({ ur, en }: { ur: string; en: string }) {
  return (
    <>
      <span lang="ur" dir="rtl" className="text-sm normal-case tracking-normal" style={{ lineHeight: 1.8 }}>
        {ur}
      </span>
      <span aria-hidden="true">·</span>
      <span>{en}</span>
    </>
  );
}

export default function StoriesPage() {
  // Urdu first: the English summaries appear only when a reader asks for them.
  const [showEnglish, setShowEnglish] = useState(false);
  const toggleEnglish = () => setShowEnglish((v) => !v);

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Urdu Stories for Kids — Fun Animated Stories with Morals"
        description="Read beautiful Urdu stories for children! Animated picture stories in simple Urdu about lions, crows, rabbits and more. Free online Urdu storybooks (اردو کہانیاں) for kids."
        ogUrl="https://alifujala.ai/stories"
        keywords="Urdu stories for kids, Urdu kahani, Urdu storybook online, اردو کہانیاں, children Urdu stories, Urdu moral stories, animated Urdu stories"
        structuredData={storiesStructuredData}
      />
      <DecorativeBlobs variant="soft" motifs={["book","letters"]} />

      <Navbar />
      <main className="container mx-auto py-6 px-4 flex-1 relative z-10">
        {/* The Urdu title leads; the English line underneath helps parents who are still learning to read Urdu */}
        <SectionHeader as="h1"
          eyebrow={<UrduEyebrow ur="کہانی کا وقت" en="Story time" />}
          icon="book"
          urduTitle="پیاری پیاری اردو کہانیاں"
          title="Beautiful Urdu Stories"
          urduSubtitle="اپنی پسند کی کہانی پر کلک کریں، تصویریں دیکھیں اور کہانی سنیں۔"
          subtitle="Tap a story to see the pictures and hear it read aloud."
          tone="cool"
          className="mb-5"
        />

        {/* Short introduction in everyday Urdu (the longer English note for parents is at the end of the page) */}
        <div className="max-w-3xl mx-auto mb-6 text-center">
          <p lang="ur" dir="rtl" className="text-lg text-gray-700 dark:text-gray-200 [text-wrap:balance]" style={{ lineHeight: 2.6 }}>
            یہاں بچوں کے لیے مشہور سبق آموز کہانیاں ہیں، جیسے ”کوا اور پانی“، ”خرگوش اور کچھوا“ اور ”لالچی کتا“۔ ہر کہانی
            آسان اردو میں ہے۔ سونے سے پہلے، اسکول کے بعد یا جب دل چاہے، کہانی سنیں اور ساتھ ساتھ پڑھنا سیکھیں۔
          </p>
        </div>

        <Stories />

        {/* Story pages: Urdu title and summary first, English behind the translation button */}
        <section aria-labelledby="story-guides" className="mt-16 max-w-6xl mx-auto">
          <SectionHeader
            id="story-guides"
            eyebrow={<UrduEyebrow ur="کہانی کے صفحات" en="Story pages" />}
            icon="book"
            urduTitle="ہر کہانی پوری پڑھیں"
            title="Read every story in full"
            urduSubtitle="ہر صفحے پر پوری کہانی اردو میں ہے اور ساتھ آواز بھی۔ وہاں نئے الفاظ، اردو میں سوال اور ایک مزے دار سرگرمی بھی ملے گی۔ انگریزی ترجمہ دیکھنا ہو تو بس ایک بٹن دبائیں۔"
            subtitle="Each story page has the complete Urdu text with narration, new words, questions in Urdu and a hands-on activity. An English translation is one tap away when you need it."
            subtitleHidden={!showEnglish}
            tone="cool"
            className="mb-4"
          />
          <div className="mb-6 flex justify-center">
            <TranslationToggle shown={showEnglish} onToggle={toggleEnglish} />
          </div>
          <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {storyGuides.map((s) => (
              <Link
                key={s.slug}
                href={`/stories/${s.slug}`}
                className="group flex flex-col rounded-3xl overflow-hidden border-[3px] border-white/60 dark:border-white/10 bg-white/90 dark:bg-gray-800/90 shadow-candy hover:shadow-candy-lg hover:-translate-y-1 transition-all"
              >
                <img src={s.cover} alt={`${s.titleUr} (${s.titleEn})`} loading="lazy" className="w-full h-36 object-cover" />
                <div className="p-4 flex-1 flex flex-col text-right">
                  <h3>
                    <span lang="ur" dir="rtl" className="block text-2xl text-indigo-700 dark:text-indigo-200 group-hover:text-purple-600 dark:group-hover:text-purple-300" style={{ lineHeight: 2.2 }}>
                      {s.titleUr}
                    </span>
                    <span lang="en" dir="ltr" className="block text-right text-sm font-bold text-gray-500 dark:text-gray-400" style={BODY_FONT}>
                      {s.titleEn}
                    </span>
                  </h3>
                  <p lang="ur" dir="rtl" className="mt-2 flex-1 text-base text-gray-800 dark:text-gray-100" style={{ lineHeight: 2.6 }}>
                    {s.summaryUr}
                  </p>
                  <p
                    lang="en"
                    dir="ltr"
                    className={showEnglish ? "mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-800 text-left text-sm text-gray-600 dark:text-gray-300 leading-relaxed" : "hidden"}
                    style={BODY_FONT}
                  >
                    {s.summary}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-indigo-600 dark:text-indigo-300">
                    <span lang="ur" dir="rtl" className="text-sm" style={{ lineHeight: 2 }}>
                      {urduAges(s.ages)}
                    </span>
                    <span lang="ur" dir="rtl" className="text-base font-bold" style={{ lineHeight: 2 }}>
                      کہانی پڑھیں ←
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* For parents: why these stories help (in English) */}
        <section aria-labelledby="why-stories" className="mt-14 max-w-4xl mx-auto">
          <KidsCard variant="glass" tone="purple" padding="lg" hoverable={false}>
            <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300" style={BODY_FONT}>
              <IconBadge name="heart" size="sm" />
              <span lang="ur" dir="rtl" className="text-sm normal-case tracking-normal" style={{ lineHeight: 1.8 }}>والدین کے لیے</span>
              <span aria-hidden="true">·</span>
              <span>For parents</span>
            </p>
            <h2 id="why-stories" className="mb-3">
              <span lang="ur" dir="rtl" className="block text-left text-3xl text-purple-700 dark:text-purple-300" style={{ lineHeight: 2 }}>
                چھوٹی کہانیاں، بڑے سبق
              </span>
              <span className="block text-xl sm:text-2xl font-bold text-purple-700/80 dark:text-purple-300/80" style={HEAD_FONT}>
                Why short moral stories work so well for young Urdu learners
              </span>
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed" style={BODY_FONT}>
              <p>
                Alif Ujala has a free collection of <strong>Urdu stories for kids</strong> (<span lang="ur" dir="rtl">اردو کہانیاں</span>):
                classic moral tales like the Thirsty Crow, the Rabbit and the Tortoise and the Greedy Dog, told with colourful
                animated pictures and simple Urdu that young children can follow. Each <strong>Urdu kahani</strong> is perfect for
                bedtime reading, story time and learning to read Urdu online.
              </p>
              <p>
                Classic tales such as the Thirsty Crow or the Rabbit and the Tortoise are told in almost every Urdu-speaking
                home. Because children often already know the plot, they can focus their attention on the words themselves —
                the sounds of new vocabulary, the shapes of the letters and the rhythm of Urdu sentences.
              </p>
              <p>
                Our versions keep each sentence short and pair it with one picture, so a child can follow the story even
                before they can read. As reading grows, they can start recognising familiar words like <span lang="ur" dir="rtl">پانی</span>,{' '}
                <span lang="ur" dir="rtl">جنگل</span> and <span lang="ur" dir="rtl">دوست</span>, and then whole lines.
              </p>
              <p>
                A good routine is one story a day: listen first, talk about the pictures, read the lesson (<span lang="ur" dir="rtl">سبق</span>)
                together and ask one or two of the questions on the story page. The English translation is there whenever a
                word is new to you: press <strong>Show English translation</strong>, then hide it again and read the Urdu once
                more. Want more ideas? Read our guide on{' '}
                <Link href="/blog/urdu-bedtime-stories-reading-routine" className="font-bold text-indigo-600 dark:text-indigo-300 underline">
                  building an Urdu bedtime story routine
                </Link>.
              </p>
            </div>
          </KidsCard>
        </section>
      </main>
      <Footer />
    </div>
  );
}
