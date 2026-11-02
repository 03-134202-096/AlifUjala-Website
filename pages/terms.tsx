import type { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import { DecorativeBlobs } from '@/components/ui'

const LAST_UPDATED = 'November 2, 2026'

const TermsPage: NextPage = () => {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Terms of Service"
        description="The terms that apply when you use the Alif Ujala website and app — a free interactive platform for children to learn Urdu."
        ogUrl="https://alifujala.ai/terms"
      />
      <DecorativeBlobs variant="soft" motifs={["book","star"]} />
      <Navbar />

      <main className="container mx-auto px-4 py-10 flex-1 relative z-10">
        <article className="mx-auto max-w-3xl rounded-3xl border-4 border-purple-200 bg-white/90 p-6 shadow-candy dark:border-purple-800 dark:bg-gray-900/80 sm:p-10">
          <h1
            className="mb-2 text-3xl font-bold text-purple-700 dark:text-purple-300 sm:text-4xl"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            Terms of Service
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Last updated: {LAST_UPDATED}</p>

          <div
            className="space-y-5 text-gray-700 dark:text-gray-200"
            style={{ fontFamily: "'Comic Neue', cursive", lineHeight: 1.75 }}
          >
            <p>
              Welcome to Alif Ujala. These Terms of Service (&quot;Terms&quot;) govern your access to and
              use of the <strong>alifujala.ai</strong> website, the Alif Ujala Android app, and any
              related services (together, the &quot;Service&quot;), operated by AIEarlyEdge. By using the
              Service you agree to these Terms.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              1. Who can use the Service
            </h2>
            <p>
              Alif Ujala is built for children learning Urdu, typically ages 3 to 10, and for the parents,
              guardians, and teachers who guide them. Children should use the Service with the knowledge
              and supervision of a parent, guardian, or teacher. By creating an account you confirm that
              you are at least 13 years old, or that a parent, guardian, or teacher is creating or
              managing the account for a younger child.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              2. Accounts
            </h2>
            <p>
              You are responsible for keeping your login credentials safe and for all activity on your
              account. Let us know right away if you suspect unauthorised use.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              3. Acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Copy, scrape, resell, or redistribute content from the Service without permission.</li>
              <li>Try to break, overload, or probe the Service for security weaknesses.</li>
              <li>Upload content that is unlawful, infringing, hateful, or inappropriate for children.</li>
              <li>Impersonate another person or misrepresent your affiliation with any entity.</li>
              <li>Interfere with ads shown through Google AdSense or any other advertising on the Service.</li>
            </ul>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              4. Content and intellectual property
            </h2>
            <p>
              All lessons, worksheets, illustrations, animations, audio, logos, and other original content
              on Alif Ujala are owned by AIEarlyEdge or its licensors and are protected by copyright and
              other laws. We grant you a limited, personal, non-commercial, non-transferable license to
              access the Service and to print or download worksheets for use by children at home or in a
              classroom. Any other use requires our written permission.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              5. Advertising
            </h2>
            <p>
              The Service is free. To keep it free, we show advertising, including through Google AdSense.
              Advertisers do not endorse Alif Ujala, and Alif Ujala does not endorse any advertiser or any
              product shown in an ad. Please read the
              {' '}
              <Link className="underline" href="/privacy">Privacy Policy</Link>
              {' '}for more about how advertising works on the Service.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              6. Third-party links
            </h2>
            <p>
              The Service may link to third-party websites (for example, our Instagram, Facebook, YouTube,
              and Google Play pages). We are not responsible for the content or practices of those sites.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              7. Disclaimer
            </h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of
              any kind, either express or implied. We do not promise that the Service will be free of
              errors or available at all times.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              8. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, AIEarlyEdge will not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
              arising out of or related to your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              9. Termination
            </h2>
            <p>
              You may stop using the Service at any time. We may suspend or end your access if you break
              these Terms or if we need to protect the Service or its users.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              10. Changes
            </h2>
            <p>
              We may update these Terms from time to time. When we do, we will revise the &quot;Last
              updated&quot; date above. Continuing to use the Service after a change means you accept the
              updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              11. Contact
            </h2>
            <p>
              Questions? Reach us at
              {' '}
              <a className="underline" href="mailto:aiearlyedge@gmail.com">aiearlyedge@gmail.com</a>
              {' '}or on the
              {' '}
              <Link className="underline" href="/contact">Contact page</Link>.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

export default TermsPage
