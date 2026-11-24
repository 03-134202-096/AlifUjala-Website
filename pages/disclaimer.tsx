import type { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { DecorativeBlobs } from '@/components/ui'

const LAST_UPDATED = 'November 23, 2026'
const CONTACT_EMAIL = 'aiearlyedge@gmail.com'
const H2 = 'text-2xl font-bold text-purple-600 dark:text-purple-300'
const HEAD_FONT = { fontFamily: "'Bubblegum Sans', cursive" }

const DisclaimerPage: NextPage = () => {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Disclaimer"
        description="Important information about the educational content, advertising, external links and videos on Alif Ujala, the free Urdu learning website for children."
        ogUrl="https://alifujala.ai/disclaimer"
      />
      <DecorativeBlobs variant="soft" motifs={['book', 'star']} />
      <Navbar />

      <main className="container mx-auto px-4 py-10 flex-1 relative z-10">
        <article className="mx-auto max-w-3xl rounded-3xl border-4 border-purple-200 bg-white/90 p-6 shadow-candy dark:border-purple-800 dark:bg-gray-900/80 sm:p-10">
          <h1 className="mb-2 text-3xl font-bold text-purple-700 dark:text-purple-300 sm:text-4xl" style={HEAD_FONT}>
            Disclaimer
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Last updated: {LAST_UPDATED}</p>

          <div className="space-y-5 text-gray-700 dark:text-gray-200" style={{ fontFamily: "'Comic Neue', cursive", lineHeight: 1.75 }}>
            <p>
              Alif Ujala (<strong>alifujala.ai</strong>) is operated by AIEarlyEdge. This page explains the purpose and
              limits of the material on our website. Please read it together with our{' '}
              <Link className="underline" href="/terms">Terms of Service</Link> and{' '}
              <Link className="underline" href="/privacy">Privacy Policy</Link>.
            </p>

            <h2 className={H2} style={HEAD_FONT}>1. Educational purpose</h2>
            <p>
              Our games, worksheets, stories, videos and articles are designed to support children who are learning to read
              and write Urdu, and the adults who help them. They are general learning resources. They are not a formal
              curriculum, an assessment of a child&apos;s ability, or a replacement for a qualified teacher, speech and language
              therapist or other professional. If you have concerns about a child&apos;s language development, reading or
              hearing, please speak to a suitably qualified professional.
            </p>

            <h2 className={H2} style={HEAD_FONT}>2. Accuracy of content</h2>
            <p>
              We take care to make our Urdu letters, words, translations and explanations accurate and clear. Urdu is taught
              slightly differently in different schools and primers — for example in how letters are counted, named or
              pronounced — so you may see small differences from the book your child uses. We do not guarantee that every
              page is complete or free from errors. If you notice a mistake, please email{' '}
              <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will review and correct it.
            </p>

            <h2 className={H2} style={HEAD_FONT}>3. Supervision of children</h2>
            <p>
              Alif Ujala is made for young children, and we recommend that a parent, guardian or teacher is nearby while a
              child uses the website. Adults are best placed to decide how much screen time is right for their child and to
              guide them away from advertisements or links to other websites.
            </p>

            <h2 className={H2} style={HEAD_FONT}>4. Advertising</h2>
            <p>
              Alif Ujala is free to use. To support the cost of running it, the website may display advertisements served by
              Google AdSense. Advertisements are selected and delivered by Google, not by us, and showing an advertisement
              does not mean that we endorse the product, service or company it promotes. Our educational content is not
              influenced by advertisers. You can learn how advertising cookies are used, and how to opt out of personalised
              advertising, in our <Link className="underline" href="/privacy">Privacy Policy</Link>.
            </p>

            <h2 className={H2} style={HEAD_FONT}>5. Videos and external links</h2>
            <p>
              Some pages embed videos from our own YouTube channel or link to other websites, such as YouTube, Google Play or
              resources we think parents may find useful. When you follow a link or play an embedded video, the other
              website&apos;s own terms and privacy policy apply. We are not responsible for the content, availability or
              practices of websites we do not control.
            </p>

            <h2 className={H2} style={HEAD_FONT}>6. Stories and illustrations</h2>
            <p>
              Our moral stories are retellings of well-known traditional fables, adapted in simple Urdu for young readers.
              The English translations are provided to help parents follow along and are not word-for-word. Illustrations
              and animations are for learning and enjoyment.
            </p>

            <h2 className={H2} style={HEAD_FONT}>7. No warranties</h2>
            <p>
              The website is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the extent permitted by law,
              AIEarlyEdge is not liable for any loss or damage arising from the use of, or reliance on, the material on Alif
              Ujala. Nothing in this disclaimer limits any rights you have that cannot be excluded by law.
            </p>

            <h2 className={H2} style={HEAD_FONT}>8. Changes and contact</h2>
            <p>
              We may update this disclaimer as the website grows. When we do, we will change the &quot;Last updated&quot; date
              above. Questions are always welcome at{' '}
              <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or through our{' '}
              <Link className="underline" href="/contact">Contact page</Link>.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default DisclaimerPage
