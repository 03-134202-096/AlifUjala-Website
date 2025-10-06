// pages/api/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from "bcryptjs"
import prisma from '../../lib/prisma'
import { withSession } from '../../lib/session'
import crypto from 'crypto';
import { sendOtpEmail } from '../../components/OtpEmail';

function isValidEmail(email?: string) {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email)
}
function isValidUsername(u?: string) {
  return typeof u === 'string' && u.trim().length >= 3 && u.trim().length <= 100
}

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username: rawUsername, name, email, password } = req.body || {};
  const username = (rawUsername ?? name ?? '').trim();

  if (!isValidEmail(email) || !password) {
    return res.status(400).json({ error: 'missing or invalid fields' });
  }
  if (!isValidUsername(username)) {
    return res.status(400).json({ error: 'username (3-100 chars) required' });
  }

  try {
    // Check for existing user or pending signup by email/username
    const existingByEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingByEmail) return res.status(409).json({ error: 'email exists' });
    const existingPendingByEmail = await prisma.pendingSignup.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingPendingByEmail) return res.status(409).json({ error: 'pending signup exists for this email' });

    const existingByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingByUsername) return res.status(409).json({ error: 'username exists' });
    const existingPendingByUsername = await prisma.pendingSignup.findUnique({ where: { username } });
    if (existingPendingByUsername) return res.status(409).json({ error: 'pending signup exists for this username' });

    const hash = await bcrypt.hash(password, 10);

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    await prisma.pendingSignup.create({
      data: {
        username,
        email: email.toLowerCase().trim(),
        password_hash: hash,
        hashedOtp,
        expiry,
      },
    });

    await sendOtpEmail(email, otp);
    return res.status(201).json({ ok: true, message: 'OTP sent to email' });
  } catch (err: any) {
    console.error('Signup error:', err);
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'duplicate entry' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});
