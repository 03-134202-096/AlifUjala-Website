// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcryptjs"
import prisma from '../../lib/prisma'
import { withSession } from '../../lib/session'

function isValidEmail(email?: string) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email)
}
function isValidUsername(u?: string) {
  return typeof u === 'string' && u.trim().length >= 3 && u.trim().length <= 100
}

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // accept either `username` or legacy `name`
  const { username: rawUsername, name, email, password } = req.body || {}
  const username = (rawUsername ?? name ?? '').trim()

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ error: 'missing or invalid fields' })
  }
  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'username (3-100 chars) required' })
  }

  try {
    // check email and username uniqueness using Prisma
    const existingByEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existingByEmail) return res.status(409).json({ error: 'email exists' })

    const existingByUsername = await prisma.user.findUnique({ where: { username } })
    if (existingByUsername) return res.status(409).json({ error: 'username exists' })

    // hash password and create user
    const hash = await bcrypt.hash(password, 10)

    const created = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase().trim(),
        password_hash: hash,
        // lives, isPremium, downloads_used use model defaults
      },
    })

    const insertId = created.id

    // set session (preserve your previous structure)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(req as any).session.user = {
      id: insertId,
      username,
      email,
      isPremium: created.isPremium,
      lives: created.lives,
    }
    await (req as any).session.save()

    return res.status(201).json({ ok: true, id: insertId })
  } catch (err: any) {
    console.error('Signup error:', err?.code ?? err?.message ?? err)
    // unique constraint error from Prisma
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'duplicate entry' })
    }

    if (err?.message?.includes('Unknown column')) {
      return res.status(500).json({ error: 'Database schema mismatch: ' + err.message })
    }

    // Opt-in debug output: set DEBUG_ERRORS=true in Vercel to include error details
    if (process.env.DEBUG_ERRORS === 'true') {
      return res.status(500).json({ error: 'Internal server error', detail: String(err?.message ?? err), stack: err?.stack })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }
})
