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
    const existingByEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingByEmail) return res.status(409).json({ error: 'email exists' });

    const existingByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingByUsername) return res.status(409).json({ error: 'username exists' });

    const hash = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase().trim(),
        password_hash: hash,
        isVerified: false, // Mark as unverified initially
      },
    });

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

    await prisma.otp.create({
      data: {
        userId: createdUser.id,
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
