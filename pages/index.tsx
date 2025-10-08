import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'
import Link from 'next/link'
import Image from 'next/image'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      <header className="relative min-h-[360px] flex items-center justify-center p-8 text-white overflow-hidden">
        <Image src="/images/hero.jpg" alt="Alif Ujaala" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/5" aria-hidden />
        <h1 className="relative text-4xl font-bold">Alif Ujaala</h1>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-2xl text-pink-500 text-center">خوش آمدید!</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <GameCard color="yellow" href="/games/matching" img="/images/lion.png" />
          <GameCard color="pink" href="/games/imageMatch" img="/images/camel.png" />
          <GameCard color="green" href="/students" img="/images/croc.png" />
          <GameCard color="green" href="/games/alphabetMatch" img="/images/placeholder-animal.png" />
        </div>
      </div>

      <section className="py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
          <div className="bg-[url('/images/wood.png')] bg-cover p-4 rounded-md text-white">Fun Learning <img className="inline-block ml-2" alt="" src="/images/bulb.png" width="26"/></div>
          <div className="bg-[url('/images/wood.png')] bg-cover p-4 rounded-md text-white">Interactive Worksheets <img className="inline-block ml-2" alt="" src="/images/bulb.png" width="26"/></div>
          <div className="bg-[url('/images/wood.png')] bg-cover p-4 rounded-md text-white">Personalized Learning <img className="inline-block ml-2" alt="" src="/images/bulb.png" width="26"/></div>
          <div className="bg-[url('/images/wood.png')] bg-cover p-4 rounded-md text-white">Educational Videos <img className="inline-block ml-2" alt="" src="/images/bulb.png" width="26"/></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border rounded-md p-3"><span>خرگوش اور چھیپا!</span> <Link className="bg-pink-500 text-white px-3 py-1 rounded" href="/games/matching">پڑھیں</Link></div>
          <div className="flex items-center justify-between border rounded-md p-3"><span>شیر اور چلاک لومڑی</span> <Link className="bg-pink-500 text-white px-3 py-1 rounded" href="/games/imageMatch">پڑھیں</Link></div>
          <div className="flex items-center justify-between border rounded-md p-3"><span>کوا اور پانی</span> <Link className="bg-pink-500 text-white px-3 py-1 rounded" href="/games/matching">پڑھیں</Link></div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Home
