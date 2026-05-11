import Stories from "../components/Stories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { SectionHeader, DecorativeBlobs, KidsCard } from "@/components/ui";

export default function StoriesPage() {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Urdu Stories for Kids — Fun Animated Stories with Morals"
        description="Read beautiful Urdu stories for children! Animated picture stories in simple Urdu about lions, crows, rabbits and more. Free online Urdu storybooks for kids."
        ogUrl="https://alifujala.ai/stories"
        keywords="Urdu stories for kids, Urdu kahani, Urdu storybook online, اردو کہانیاں, children Urdu stories"
      />
      <DecorativeBlobs variant="soft" emojis={["📚", "🌙", "🦁", "🐢", "✨"]} />

      <Navbar />
      <main className="container mx-auto py-6 px-4 flex-1 relative z-10">
        <SectionHeader
          eyebrow="📖 Story Time"
          emoji="📚"
          title="Beautiful Urdu Stories"
          subtitle="Click on a story card to start reading! Each story has beautiful pictures."
          tone="cool"
        />
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
