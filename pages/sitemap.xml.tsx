import type { GetServerSideProps } from 'next'
import { buildSitemapXml } from '@/lib/sitemap'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(buildSitemapXml())
  res.end()

  return { props: {} }
}

export default function SitemapXml() {
  return null
}

