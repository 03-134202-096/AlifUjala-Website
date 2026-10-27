import Stories from "../components/Stories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { SectionHeader, DecorativeBlobs, KidsCard } from "@/components/ui";

const SITE_URL = "https://alifujala.ai";

/** Story titles (English + Urdu) used to build the ItemList structured data. */
const STORY_LIST = [
  { en: "The Rabbit and the Tortoise", ur: "خرگوش اور کچھوا" },
  { en: "The Lion and the Clever Fox", ur: "شیر اور چلاک لومڑی" },
  { en: "The Thirsty Crow", ur: "کوا اور پانی" },
  { en: "The Greedy Dog", ur: "لالچی کتا" },
  { en: "The Ant and the Grasshopper", ur: "چیونٹی اور ٹڈی" },
  { en: "The Fox and the Grapes", ur: "لومڑی اور انگور" },
  { en: "The Boy Who Cried Wolf", ur: "بھیڑیا آیا! بھیڑیا آیا!" },
  { en: "The Hardworking Farmer", ur: "محنتی کسان" },
];

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
        url: `${SITE_URL}/stories`,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    })),
  },
};

export default function StoriesPage() {
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
        <SectionHeader
          eyebrow="Story Time"
          icon="book"
          title="Beautiful Urdu Stories"
          subtitle="Click on a story card to start reading! Each story has beautiful pictures."
          tone="cool"
        />

        {/* Intro copy — crawlable, keyword-rich description for search engines */}
        <div className="max-w-3xl mx-auto mb-6 text-center">
          <p
            className="text-sm sm:text-base font-bold text-gray-600 dark:text-gray-300 leading-relaxed"
            style={{ fontFamily: "'Comic Neue', cursive" }}
          >
            Enjoy a free collection of <strong>Urdu stories for kids</strong> (اردو کہانیاں) — classic moral
            tales like the Thirsty Crow, the Rabbit and the Tortoise, and the Greedy Dog, told with colourful
            animated pictures and simple Urdu that young children can follow. Each <strong>Urdu kahani</strong> is
            perfect for bedtime reading, story time, and learning to read Urdu online.
          </p>
        </div>

        <Stories />

        {/* Bottom encouragement */}
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <KidsCard variant="gradient" tone="indigo" padding="md">
            <p className="text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-200" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              🌟 More stories coming soon — keep reading! 🌟
            </p>
          </KidsCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
