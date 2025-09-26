import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '../../lib/session'

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = (req as any).session
  if (s) {
    s.destroy()
  }
  return res.json({ ok: true })
})
