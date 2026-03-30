import Stories from "../components/Stories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function StoriesPage() {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Urdu Stories for Kids — Fun Animated Stories with Morals"
        description="Read beautiful Urdu stories for children! Animated picture stories in simple Urdu about lions, crows, rabbits and more. Free online Urdu storybooks for kids."
        ogUrl="https://alifujala.ai/stories"
        keywords="Urdu stories for kids, Urdu kahani, Urdu storybook online, اردو کہانیاں, children Urdu stories"
      />
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-[5%] text-4xl animate-float opacity-15">📚</div>
        <div className="absolute top-40 right-[8%] text-3xl animate-float-delay opacity-15">🌙</div>
        <div className="absolute bottom-40 left-[10%] text-3xl animate-bounce-slow opacity-15">🦁</div>
        <div className="absolute bottom-20 right-[5%] text-4xl animate-float opacity-15">🐢</div>
      </div>

      <Navbar />
      <main className="container mx-auto py-6 px-4 flex-1 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1'}}>
            📖 Story Time! 📖
          </h1>
          <p className="text-lg text-blue-600 font-bold max-w-lg mx-auto" style={{fontFamily: "'Comic Neue', cursive"}}>
            Click on a story card to start reading! Each story has beautiful pictures! 🌟
          </p>
        </div>
        <Stories />

        {/* Bottom encouragement */}
        <div className="mt-10 text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-100 border-4 border-indigo-200 rounded-3xl px-8 py-4">
            <p className="text-lg font-bold text-purple-600" style={{fontFamily: "'Bubblegum Sans', cursive"}}>
              🌟 More stories coming soon! Keep reading! 🌟
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
