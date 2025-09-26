import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '../../lib/db'
import { withSession } from '../../lib/session'

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).session?.user
  if (!user) return res.status(401).json({ error: 'not logged in' })

  await pool.query('UPDATE users SET isPremium = 1 WHERE id = ?', [user.id])
  // update session object
  ;(req as any).session.user.isPremium = true
  await (req as any).session.save()
  return res.json({ ok: true })
})
