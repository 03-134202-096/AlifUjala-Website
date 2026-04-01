import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import Link from 'next/link'
import { blogPosts, getBlogPost, BlogPost } from '@/data/blogPosts'

interface Props {
  post: BlogPost
}

export default function BlogPostPage({ post }: Props) {
  if (!post) return null

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://alifujala.ai${post.coverImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://alifujala.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alif Ujala',
      url: 'https://alifujala.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://alifujala.ai/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://alifujala.ai/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    inLanguage: 'en',
  }

  return (
    <div className="kids-page-bg min-h-screen flex flex-col">
      <SEO
        title={post.title}
        description={post.excerpt}
        ogUrl={`https://alifujala.ai/blog/${post.slug}`}
        ogImage={`https://alifujala.ai${post.coverImage}`}
        ogType="article"
        keywords={post.tags.join(', ')}
        structuredData={structuredData}
      />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm" style={{ fontFamily: "'Comic Neue', cursive" }}>
          <Link href="/" className="text-indigo-500 hover:underline">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/blog" className="text-indigo-500 hover:underline">Blog</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">{post.title.slice(0, 40)}…</span>
        </nav>

        {/* Article card */}
        <article className="bg-white/95 dark:bg-gray-900/90 rounded-3xl shadow-xl border-2 border-purple-100 dark:border-indigo-800 overflow-hidden">
          {/* Cover */}
          <div className="h-64 sm:h-80 overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-10">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-gray-400 text-xs" style={{ fontFamily: "'Comic Neue', cursive" }}>
                📅 {new Date(post.date).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-gray-400 text-xs" style={{ fontFamily: "'Comic Neue', cursive" }}>
                ⏱ {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3 leading-snug"
              style={{ fontFamily: "'Bubblegum Sans', cursive", color: '#6366f1' }}
            >
              {post.title}
            </h1>

            {/* Urdu title */}
            <p
              className="text-lg text-indigo-500 dark:text-indigo-400 mb-6 text-right border-r-4 border-indigo-300 pr-4"
              style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}
            >
              {post.titleUrdu}
            </p>

            {/* Content */}
            <div
              className="blog-content prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-bold text-gray-500 mb-3" style={{ fontFamily: "'Comic Neue', cursive" }}>
                Tags:
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-sm px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="mt-6 flex items-center gap-4 bg-indigo-50 dark:bg-indigo-950/50 rounded-2xl p-4">
              <img src="/images/logo.png" alt="Alif Ujala" className="h-12 w-12 rounded-xl object-cover shadow" />
              <div>
                <p className="font-bold text-gray-800 dark:text-white" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
                  {post.author}
                </p>
                <p className="text-sm text-gray-500" style={{ fontFamily: "'Comic Neue', cursive" }}>
                  Making Urdu learning fun for every child 🌟
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
            Ready to See It in Action?
          </h3>
          <p className="mb-5 text-white/90" style={{ fontFamily: "'Comic Neue', cursive" }}>
            Try our free Urdu alphabet activities right now — no signup needed!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/activity"
              className="inline-block bg-white text-indigo-700 font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              ✨ Try Activities
            </Link>
            <Link
              href="/games/urduHunter"
              className="inline-block bg-indigo-900/40 border-2 border-white text-white font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              🎮 Play Urdu Hunter
            </Link>
          </div>
        </div>

        {/* Back to blog */}
        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="text-indigo-600 font-bold hover:underline"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            ← Back to Blog
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = blogPosts.map((post) => ({ params: { slug: post.slug } }))
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getBlogPost(params?.slug as string)
  if (!post) return { notFound: true }
  return { props: { post } }
}
