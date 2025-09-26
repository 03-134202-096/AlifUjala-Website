import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Simple test query
    const now = await prisma.$queryRaw`SELECT NOW()`
    return res.json({ ok: true, now })
  } catch (err: any) {
    console.error('DB test failed', err)
    return res.status(500).json({ ok: false, error: String(err?.message ?? err) })
  }
}
