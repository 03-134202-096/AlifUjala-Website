import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '../../lib/session'
import prisma from '../../lib/prisma'

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).session?.user

  // Per new product rules: playing games is unlimited for everyone (signed-in or not).
  // Only PDF downloads are limited. Therefore /api/play should allow access and
  // should NOT decrement or block based on "lives".

  if (!user) {
    // anonymous user — allow play
    return res.json({ ok: true })
  }

  // signed-in user — return ok and include their lives/isPremium if helpful for UI
  const r0 = await prisma.user.findUnique({ where: { id: Number(user.id) }, select: { lives: true, isPremium: true } })
  if (!r0) return res.status(404).json({ error: 'user not found' })

  const lives = Number(r0.lives || 0)
  const isPremium = !!r0.isPremium
  return res.json({ ok: true, lives, isPremium })
})
