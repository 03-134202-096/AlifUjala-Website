import type { NextApiRequest, NextApiResponse } from 'next'
import { buildSitemapXml } from '@/lib/sitemap'

export default function SitemapHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.status(200).send(buildSitemapXml())
}
