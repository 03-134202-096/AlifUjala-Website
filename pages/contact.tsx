import type { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { DecorativeBlobs, KidsCard, KidsButton, IconBadge } from '@/components/ui'

const CONTACT_EMAIL = 'aiearlyedge@gmail.com'

const ContactPage: NextPage = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Alif Ujala',
    url: 'https://alifujala.ai/contact',
    about: {
      '@type': 'Organization',
      name: 'Alif Ujala',
      email: CONTACT_EMAIL,
      url: 'https://alifujala.ai',
      sameAs: [
        'https://www.instagram.com/alifujala.ai/',
        'https://www.facebook.com/profile.php?id=61579001649615',
        'https://www.youtube.com/@alifujala',
        'https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala',
      ],
    },
  }

  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Contact Us"
        description="Reach the Alif Ujala team at aiearlyedge@gmail.com. Questions, feedback, partnership and school enquiries about our free Urdu learning platform are welcome."
        ogUrl="https://alifujala.ai/contact"
        structuredData={structuredData}
      />
      <DecorativeBlobs variant="rich" motifs={["heart","book"]} />
      <Navbar />

      <main className="container mx-auto px-4 py-10 flex-1 relative z-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 text-center">
            <h1
              className="text-3xl font-bold text-gradient-cool sm:text-4xl"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              Say hello to Alif Ujala
            </h1>
            <p
              className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-300"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              We love hearing from parents, teachers, and curious little readers.
            </p>
          </div>

          <KidsCard variant="glass" tone="purple" padding="lg" className="mb-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="shrink-0">
                <IconBadge name="users" size="hero" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-2xl font-bold text-purple-700 dark:text-purple-300"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  Email us
                </h2>
                <p
                  className="mt-1 text-gray-700 dark:text-gray-200"
                  style={{ fontFamily: "'Comic Neue', cursive" }}
                >
                  The fastest way to reach us is email. We usually reply within a couple of working days.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-white bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-2 font-bold text-white shadow transition hover:scale-105"
                  style={{ fontFamily: "'Comic Neue', cursive" }}
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </KidsCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KidsCard variant="glass" tone="blue" padding="md">
              <h3
                className="text-xl font-bold text-blue-700 dark:text-blue-300"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                What to write about
              </h3>
              <ul
                className="mt-2 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-200"
                style={{ fontFamily: "'Comic Neue', cursive" }}
              >
                <li>Feedback on games, stories, or worksheets</li>
                <li>Reporting a bug or broken page</li>
                <li>Content suggestions in English or Urdu</li>
                <li>Classroom or school use enquiries</li>
                <li>Collaboration and partnership ideas</li>
              </ul>
            </KidsCard>

            <KidsCard variant="glass" tone="green" padding="md">
              <h3
                className="text-xl font-bold text-emerald-700 dark:text-emerald-300"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                Follow and share
              </h3>
              <ul
                className="mt-2 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-200"
                style={{ fontFamily: "'Comic Neue', cursive" }}
              >
                <li>
                  <a className="underline" href="https://www.instagram.com/alifujala.ai/" target="_blank" rel="noopener noreferrer">
                    Instagram @alifujala.ai
                  </a>
                </li>
                <li>
                  <a className="underline" href="https://www.facebook.com/profile.php?id=61579001649615" target="_blank" rel="noopener noreferrer">
                    Facebook page
                  </a>
                </li>
                <li>
                  <a className="underline" href="https://www.youtube.com/@alifujala" target="_blank" rel="noopener noreferrer">
                    YouTube @alifujala
                  </a>
                </li>
                <li>
                  <a className="underline" href="https://play.google.com/store/apps/details?id=com.aiearlyedge.alifujala" target="_blank" rel="noopener noreferrer">
                    Alif Ujala on Google Play
                  </a>
                </li>
              </ul>
            </KidsCard>
          </div>

          <KidsCard variant="glass" tone="amber" padding="md" className="mt-6">
            <h3
              className="text-xl font-bold text-amber-700 dark:text-amber-300"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              About the publisher
            </h3>
            <p
              className="mt-2 text-gray-700 dark:text-gray-200"
              style={{ fontFamily: "'Comic Neue', cursive" }}
            >
              Alif Ujala is created and operated by <strong>AIEarlyEdge</strong>. You can learn more about
              our mission on the{' '}
              <Link href="/about" className="underline">About page</Link>, or read our{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>
              {' '}and{' '}
              <Link href="/terms" className="underline">Terms of Service</Link>.
            </p>
            <div className="mt-4">
              <KidsButton href="/about" variant="primary" size="md">
                About Alif Ujala
              </KidsButton>
            </div>
          </KidsCard>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage
