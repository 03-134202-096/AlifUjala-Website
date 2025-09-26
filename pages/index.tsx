import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GameCard from '@/components/GameCard'
import Link from 'next/link'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <Navbar />
      <header className="hero">
        <h1>Alif Ujaala</h1>
      </header>

      <div className="container">
        <div className="urdu-title">خوش آمدید!</div>
        <div className="cards">
          <GameCard color="yellow" href="/games/matching" img="/images/lion.png" />
          <GameCard color="pink" href="/games/imageMatch" img="/images/camel.png" />
          <GameCard color="green" href="/students" img="/images/croc.png" />
          <GameCard color="green" href="/games/alphabetMatch" img="/images/placeholder-animal.png" />
        </div>
      </div>

      <section className="section container">
        <div className="ribbon-area">
          <div className="ribbon">Fun Learning <img className="candle" alt="" src="/images/candle.png" width="26"/></div>
          <div className="ribbon">Interactive Worksheets <img className="candle" alt="" src="/images/candle.png" width="26"/></div>
          <div className="ribbon">Personalized Learning <img className="candle" alt="" src="/images/candle.png" width="26"/></div>
          <div className="ribbon">Educational Videos <img className="candle" alt="" src="/images/candle.png" width="26"/></div>
          <div className="ribbon">Customized Worksheets <img className="candle" alt="" src="/images/candle.png" width="26"/></div>
        </div>
      </section>

      <section className="container">
        <div className="list">
          <div className="item"><span>خرگوش اور چھیپا!</span> <Link className="btn" href="/games/matching">پڑھیں</Link></div>
          <div className="item"><span>شیر اور چلاک لومڑی</span> <Link className="btn" href="/games/imageMatch">پڑھیں</Link></div>
          <div className="item"><span>کوا اور پانی</span> <Link className="btn" href="/games/matching">پڑھیں</Link></div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Home
