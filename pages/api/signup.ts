// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import pool from '../../lib/db'
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
    // check email uniqueness
    const [existsRows] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    const exists: any = Array.isArray(existsRows) && existsRows.length ? existsRows[0] : null
    if (exists) return res.status(409).json({ error: 'email exists' })

    // optionally check username uniqueness too
    const [userRows] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    const userExists: any = Array.isArray(userRows) && userRows.length ? userRows[0] : null
    if (userExists) return res.status(409).json({ error: 'username exists' })

    // hash password and insert into `password_hash`
    const hash = await bcrypt.hash(password, 10)

    const defaultLives = 5
    const defaultIsPremium = 0 // 0=false, 1=true
    const defaultDownloadsUsed = 0

    const [resIns] = await pool.query(
      `INSERT INTO users
        (username, email, password_hash, lives, isPremium, downloads_used)
       VALUES (?,?,?,?,?,?)`,
      [username, email.toLowerCase().trim(), hash, defaultLives, defaultIsPremium, defaultDownloadsUsed]
    )

    // @ts-ignore - mysql2 result typing
    const insertId = resIns?.insertId ?? null

    // set session (preserve your previous structure)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(req as any).session.user = {
      id: insertId,
      username,
      email,
      isPremium: false,
      lives: defaultLives,
    }
    await (req as any).session.save()

    return res.status(201).json({ ok: true, id: insertId })
  } catch (err: any) {
    console.error('Signup error:', err?.code ?? err?.message ?? err)

    // duplicate key
    if (err?.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'duplicate entry' })
    }

    if (err?.message?.includes('Unknown column')) {
      return res.status(500).json({ error: 'Database schema mismatch: ' + err.message })
    }

    return res.status(500).json({ error: 'Internal server error' })
  }
})
