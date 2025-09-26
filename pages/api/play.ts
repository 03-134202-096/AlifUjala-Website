import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '../../lib/session'
import pool from '../../lib/db'

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
  const [rows] = await pool.query('SELECT lives, isPremium FROM users WHERE id = ?', [user.id])
  const r0: any = Array.isArray(rows) && rows.length ? rows[0] : null
  if (!r0) return res.status(404).json({ error: 'user not found' })

  const lives = Number(r0.lives || 0)
  const isPremium = !!r0.isPremium
  return res.json({ ok: true, lives, isPremium })
})
