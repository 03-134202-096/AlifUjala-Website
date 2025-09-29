import bcrypt from "bcryptjs"

export async function hashPassword(password: string) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export async function setLoginSession(req: any, res: any, user: any) {
  req.session.user = {
    id: user.id,
    email: user.email,
    username: user.username,
  }
  await req.session.save()
}

export async function removeLoginSession(req: any, res: any) {
  req.session.destroy()
}
