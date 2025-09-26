import prisma from '../../lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { withSession } from '@/lib/session'
import type { NextApiResponse } from 'next'

export default withSession(async function loginHandler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  req.session!.user = { id: user.id, username: user.username, email: user.email }
  await req.session!.save()

  res.status(200).json({ message: 'Login successful', user: req.session!.user })
})
