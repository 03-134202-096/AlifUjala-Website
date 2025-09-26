import { withSession } from "@/lib/session"
import prisma from '@/lib/prisma'

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
    // Try modern schema first
    const r0 = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { downloads_used: true, isPremium: true } })
    if (r0) {
      downloadsUsed = Number(r0.downloads_used || 0)
      isPremium = !!r0.isPremium
    } else {
      // Fallback: try to query legacy column names via raw SQL and try to interpret them.
      try {
        const raw = await prisma.$queryRawUnsafe(`SELECT downloads_left, is_premium, "isPremium" FROM users WHERE id = ${Number(userId)} LIMIT 1`)
        const r1 = Array.isArray(raw) && raw.length ? raw[0] : null
        if (!r1) return res.status(404).json({ error: "User not found" })
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
      await prisma.user.update({ where: { id: Number(userId) }, data: { downloads_used: { increment: 1 } as any } })
      return res.status(200).json({ ok: true, remaining: MAX_FREE - (downloadsUsed + 1) })
    }

    return res.status(403).json({ error: "❌ You’ve used your 3 free downloads. Please upgrade to Premium." })
  } catch (err) {
    console.error("Error in /api/download:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
})
