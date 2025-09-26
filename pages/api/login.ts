import db from '@/lib/db'
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

  const [rows] = await (db as any).query(
    'SELECT id, username, email, password_hash FROM users WHERE email = ?',
    [email]
  )
  if ((rows as any).length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const user = (rows as any)[0]
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  req.session!.user = { id: user.id, username: user.username, email: user.email }
  await req.session!.save()

  res.status(200).json({ message: 'Login successful', user: req.session!.user })
})
