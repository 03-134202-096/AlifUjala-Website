import { withSession } from "@/lib/session"
import pool from "@/lib/db"

export default withSession(async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const sessionUser = req.session.user
  if (!sessionUser) {
    return res.status(401).json({ error: "Please sign in to download worksheets." })
  }

  try {
    const userId = sessionUser.id

    // Try to read the modern `downloads_used` column. If the schema is older and
    // that column doesn't exist, fall back to `downloads_left` (legacy) or 0.
    let downloadsUsed = 0
    let isPremium = false
    try {
      const [rows]: any = await pool.query("SELECT downloads_used, isPremium FROM users WHERE id = ?", [userId])
      const r0: any = Array.isArray(rows) && rows.length ? rows[0] : null
      if (!r0) return res.status(404).json({ error: "User not found" })
      downloadsUsed = Number(r0.downloads_used || 0)
      isPremium = !!r0.isPremium
    } catch (e: any) {
      // Possible Unknown column error: try legacy columns
      console.warn('downloads_used not present, falling back to legacy columns', e?.message)
      try {
        const [rows2]: any = await pool.query("SELECT downloads_left, is_premium, isPremium FROM users WHERE id = ?", [userId])
        const r1: any = Array.isArray(rows2) && rows2.length ? rows2[0] : null
        if (!r1) return res.status(404).json({ error: "User not found" })
        // If downloads_left exists, compute downloadsUsed as MAX_FREE - downloads_left (best effort)
        const downloadsLeft = typeof r1.downloads_left !== 'undefined' ? Number(r1.downloads_left) : null
        if (downloadsLeft !== null) {
          const MAX_FREE = 3
          downloadsUsed = Math.max(0, MAX_FREE - downloadsLeft)
        }
        isPremium = !!(r1.isPremium || r1.is_premium)
      } catch (e2) {
        console.error('Fallback query failed', e2)
        return res.status(500).json({ error: 'Internal server error' })
      }
    }

    if (isPremium) {
      return res.status(200).json({ ok: true })
    }

    const MAX_FREE = 3
    if (downloadsUsed < MAX_FREE) {
      await pool.query("UPDATE users SET downloads_used = downloads_used + 1 WHERE id = ?", [userId])
      return res.status(200).json({ ok: true, remaining: MAX_FREE - (downloadsUsed + 1) })
    }

    return res.status(403).json({ error: "❌ You’ve used your 3 free downloads. Please upgrade to Premium." })
  } catch (err) {
    console.error("Error in /api/download:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
})
