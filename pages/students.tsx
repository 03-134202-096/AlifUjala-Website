import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={ { textAlign: 'center' } }>Students Page</h2>
        <p className="small center">This is a placeholder. Replace with your content later.</p>
      </div>
      <Footer />
    </>
  )
}

export default Page
