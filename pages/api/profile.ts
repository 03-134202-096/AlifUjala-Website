import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '../../lib/session'
import prisma from '../../lib/prisma'

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionUser = (req as any).session?.user
  if (!sessionUser) return res.status(401).json({ error: 'not logged in' })

  // Always fetch the latest user details from the database
  const dbUser = await prisma.user.findUnique({
    where: { id: Number(sessionUser.id) },
    select: {
      id: true,
      username: true,
      email: true,
      isPremium: true,
    },
  })
  if (!dbUser) return res.status(404).json({ error: 'User not found' })
  return res.json({ ok: true, user: dbUser })
})
