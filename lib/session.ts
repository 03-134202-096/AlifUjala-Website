import { getIronSession, SessionOptions } from "iron-session"

export const sessionOptions: SessionOptions = {
  cookieName: "alifujala_session",
  password: process.env.SESSION_SECRET || "a_long_random_secret_at_least_32_chars",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export function withSession(handler: any) {
  return async (req: any, res: any) => {
    req.session = await getIronSession(req, res, sessionOptions)
    return handler(req, res)
  }
}
