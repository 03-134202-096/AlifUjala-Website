import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '../../lib/session'

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = (req as any).session?.user
  if (!user) return res.status(401).json({ error: 'not logged in' })
  return res.json({ ok: true, user })
})
