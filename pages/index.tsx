
// "use client";
import HeroWithFire from "@/components/hero/HeroWithFire";
import WelcomeHeader from "@/components/home_except_hero/WelcomeHeader";
// import { motion } from "framer-motion";
import SleepingCards from "@/components/home_except_hero/hoverToShowContent";
import VideoEmbed    from "@/components/home_except_hero/VideoEmbed";
import UrduStories   from "@/components/home_except_hero/UrduStories";

export const dynamic = "force-static";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
  <Navbar className="bg-[#333333] text-white text-center py-4 mt-auto shadow-inner" />
      <HeroWithFire />
      <main className="container mx-auto py-10 px-4 text-center text-gray-800 flex-1">
        <WelcomeHeader />
        <SleepingCards />
        <VideoEmbed
          src="https://www.youtube.com/embed/HKTHE_jDd60?autoplay=1&mute=1&controls=1&rel=0"
          title="Child Learning"
        />
      </main>
      <Footer />
    </div>
  );
}


