import { LearningIcon } from '@/components/ui'
import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import Link from 'next/link'
import { blogPosts } from '@/data/blogPosts'
import { SectionHeader, KidsCard, KidsButton, DecorativeBlobs } from '@/components/ui'

export default function BlogIndex() {
  return (
    <div className="kids-page-bg min-h-screen flex flex-col relative">
      <SEO
        title="Blog — Urdu Learning Tips, Activities & Parenting Advice"
        description="Read expert articles on teaching Urdu to children, language learning tips, activity ideas, and cultural stories. Free resources for parents and teachers."
        ogUrl="https://alifujala.ai/blog"
        ogType="website"
        keywords="Urdu learning blog, teach Urdu kids, Urdu alphabet tips, Urdu parenting, اردو تعلیم"
      />
      <DecorativeBlobs variant="soft" motifs={["pencil","book"]} />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full relative z-10">
        <SectionHeader
          eyebrow="Alif Ujala Blog"
          icon="book"
          title="Tips, guides & fun ideas"
          subtitle="Practical advice for teaching Urdu to your little ones — from parents and teachers, for parents and teachers."
          tone="cool"
        />

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-lg border-2 border-purple-100 dark:border-indigo-700 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* Cover image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                {/* Category + date */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-xs" style={{ fontFamily: "'Comic Neue', cursive" }}>
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors leading-snug"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  {post.title}
                </h2>

                {/* Urdu title */}
                <p
                  className="text-sm text-indigo-500 dark:text-indigo-400 mb-3 text-right"
                  style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}
                >
                  {post.titleUrdu}
                </p>

                {/* Excerpt */}
                <p
                  className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3"
                  style={{ fontFamily: "'Comic Neue', cursive" }}
                >
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs px-2 py-0.5 rounded-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-4 text-indigo-600 font-bold text-sm group-hover:gap-2 transition-all"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  Read More →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <KidsCard variant="gradient" tone="indigo" padding="lg" className="text-center relative overflow-hidden">
            <span className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-fuchsia-300/30 blur-3xl" aria-hidden />
            <span className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-300/30 blur-3xl" aria-hidden />
            <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-purple-700 dark:text-purple-200" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              Start Learning Today! 🚀
            </h3>
            <p className="mb-5 text-gray-700 dark:text-gray-200" style={{ fontFamily: "'Comic Neue', cursive" }}>
              Try our free interactive activities — no account needed!
            </p>
            <KidsButton href="/activity" variant="primary" size="lg" iconLeft={<LearningIcon name="worksheet" />}>
              Go to Activities
            </KidsButton>
          </KidsCard>
        </div>
      </main>

      <Footer />
    </div>
  )
}
