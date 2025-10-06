import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '../../lib/session'
import prisma from '../../lib/prisma'

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionUser = (req as any).session?.user;
  if (!sessionUser) return res.status(401).json({ error: 'not logged in' });

  if (req.method === 'GET') {
    // Fetch user profile including profileImgId
    const dbUser = await prisma.user.findUnique({
      where: { id: Number(sessionUser.id) },
      select: {
        id: true,
        username: true,
        email: true,
        isPremium: true,
        profileImgId: true,
      },
    });
    if (!dbUser) return res.status(404).json({ error: 'User not found' });
    return res.json({ ok: true, user: dbUser });
  }

  if (req.method === 'POST') {
    const { profileImgId } = req.body;
    if (typeof profileImgId !== 'number') {
      return res.status(400).json({ error: 'profileImgId must be a number' });
    }
    const updatedUser = await prisma.user.update({
      where: { id: Number(sessionUser.id) },
      data: { profileImgId },
      select: {
        id: true,
        username: true,
        email: true,
        isPremium: true,
        profileImgId: true,
      },
    });
    return res.json({ ok: true, user: updatedUser });
  }

  return res.status(405).end();
});
