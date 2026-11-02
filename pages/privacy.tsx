import type { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { DecorativeBlobs } from '@/components/ui'

const LAST_UPDATED = 'November 2, 2026'

const PrivacyPage: NextPage = () => {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Privacy Policy"
        description="Read how Alif Ujala collects, uses, and protects information when children, parents, and teachers use our Urdu learning website and app."
        ogUrl="https://alifujala.ai/privacy"
      />
      <DecorativeBlobs variant="soft" motifs={["book","heart"]} />
      <Navbar />

      <main className="container mx-auto px-4 py-10 flex-1 relative z-10">
        <article className="prose-kids mx-auto max-w-3xl rounded-3xl border-4 border-indigo-200 bg-white/90 p-6 shadow-candy dark:border-indigo-800 dark:bg-gray-900/80 sm:p-10">
          <h1
            className="mb-2 text-3xl font-bold text-indigo-700 dark:text-indigo-300 sm:text-4xl"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            Privacy Policy
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Last updated: {LAST_UPDATED}</p>

          <div
            className="space-y-5 text-gray-700 dark:text-gray-200"
            style={{ fontFamily: "'Comic Neue', cursive", lineHeight: 1.75 }}
          >
            <p>
              Alif Ujala (&quot;Alif Ujala&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a free Urdu
              learning website and Android app operated by AIEarlyEdge. This Privacy Policy explains what
              information we collect from visitors of <strong>alifujala.ai</strong>, how we use it, and the
              choices you have. By using the site you agree to this policy.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              1. Information we collect
            </h2>
            <p>We try to keep data collection to a minimum. We may collect:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong>Account data</strong> you choose to provide when signing up (username, email, a
                hashed password, and an avatar selection). You can use most of the site without an account.
              </li>
              <li>
                <strong>Progress data</strong> stored in your browser (via <code>localStorage</code>) so
                children can continue games and worksheets where they left off.
              </li>
              <li>
                <strong>Technical data</strong> such as IP address, device type, browser, pages visited and
                referring page, collected automatically through standard server logs and cookies.
              </li>
              <li>
                <strong>Contact messages</strong> you send us by email at
                {' '}
                <a className="underline" href="mailto:aiearlyedge@gmail.com">aiearlyedge@gmail.com</a>.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              2. How we use information
            </h2>
            <ul className="list-disc space-y-1 pl-6">
              <li>Run and improve the website, games, stories, and worksheets.</li>
              <li>Keep accounts secure and prevent abuse.</li>
              <li>Reply to messages and support requests.</li>
              <li>Measure which pages are useful so we know what to build next.</li>
              <li>Show relevant advertising through Google AdSense (see section 4).</li>
            </ul>
            <p>We do not sell personal information.</p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              3. Cookies and local storage
            </h2>
            <p>
              Cookies are small text files stored on your device. We use them, along with similar
              technologies like <code>localStorage</code>, for things like remembering your theme (light or
              dark), keeping you signed in, saving a child&apos;s learning progress, and measuring site
              traffic. You can clear or block cookies in your browser settings, but parts of the site may
              stop working if you do.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              4. Third-party advertising (Google AdSense)
            </h2>
            <p>
              Alif Ujala uses <strong>Google AdSense</strong>, a third-party advertising service provided by
              Google LLC, to display ads. Google and its partners (including DoubleClick) may use cookies
              and similar technologies to serve ads based on your prior visits to this and other websites.
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Google&apos;s use of advertising cookies, including the <strong>DoubleClick DART cookie</strong>,
                enables it and its partners to serve ads to users based on their visit to our site and
                other sites on the Internet.
              </li>
              <li>
                You may opt out of personalised advertising by visiting
                {' '}
                <a className="underline" href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
                  Google Ads Settings
                </a>
                {' '}or
                {' '}
                <a className="underline" href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
                  www.aboutads.info/choices
                </a>.
              </li>
              <li>
                You can read more at
                {' '}
                <a className="underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
                  Google&apos;s advertising policies
                </a>.
              </li>
            </ul>
            <p>
              Third-party vendors, including Google, use cookies to serve ads based on prior visits to our
              website. We do not control these cookies and their use is governed by the privacy policies of
              those third parties.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              5. Analytics
            </h2>
            <p>
              We may use privacy-friendly analytics tools to understand aggregate usage. These tools do
              not identify individual visitors.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              6. Children&apos;s privacy
            </h2>
            <p>
              Alif Ujala is designed to be family-friendly and to be used by children with the help of a
              parent, guardian, or teacher. We do not knowingly collect more personal information from
              children than is needed to use the service. If you believe a child has provided us
              information without a parent&apos;s consent, please contact us so we can delete it.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              7. Data retention and security
            </h2>
            <p>
              We keep account data for as long as the account is active. Passwords are stored only as
              salted hashes. We use industry-standard measures to protect data, but no method of
              transmission over the Internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              8. Your rights
            </h2>
            <p>
              Depending on where you live, you may have the right to access, correct, or delete the
              personal information we hold about you, and to opt out of personalised advertising. To
              exercise any of these rights, email
              {' '}
              <a className="underline" href="mailto:aiearlyedge@gmail.com">aiearlyedge@gmail.com</a>.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              9. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. When we do, we will revise the &quot;Last
              updated&quot; date at the top of this page.
            </p>

            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              10. Contact us
            </h2>
            <p>
              Questions about this policy? Email us at
              {' '}
              <a className="underline" href="mailto:aiearlyedge@gmail.com">aiearlyedge@gmail.com</a>
              {' '}or visit our
              {' '}
              <Link className="underline" href="/contact">
                Contact page
              </Link>.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default PrivacyPage
