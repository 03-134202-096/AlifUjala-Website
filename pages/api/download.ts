import { withSession } from "@/lib/session"

export default withSession(async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const sessionUser = req.session.user
  
  // If user is not logged in, allow PNG download with low resolution
  if (!sessionUser) {
    return res.status(200).json({ 
      ok: true, 
      isLoggedIn: false,
      format: "png",
      resolution: "low"
    })
  }

  // If user is logged in, allow PDF download with high resolution
  try {
    return res.status(200).json({ 
      ok: true, 
      isLoggedIn: true,
      format: "pdf",
      resolution: "high"
    })
  } catch (err) {
    console.error("Error in /api/download:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
})
