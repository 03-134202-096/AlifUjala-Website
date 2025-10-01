import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { withSession } from '../../lib/session';

export default withSession(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, otp } = req.body || {};

  if (!email || !otp) {
    return res.status(400).json({ error: 'missing fields' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(404).json({ error: 'user not found' });

    const otpRecord = await prisma.otp.findUnique({ where: { userId: user.id } });
    if (!otpRecord) return res.status(404).json({ error: 'OTP not found' });

    if (otpRecord.attempts >= 5) {
      return res.status(429).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedOtp !== otpRecord.hashedOtp) {
      await prisma.otp.update({
        where: { userId: user.id },
        data: { attempts: { increment: 1 } },
      });
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (new Date() > otpRecord.expiry) {
      return res.status(410).json({ error: 'OTP expired' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await prisma.otp.delete({ where: { userId: user.id } });

    // Set session for the user
    (req as any).session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isPremium: user.isPremium,
      lives: user.lives,
    };
    await (req as any).session.save();

    return res.status(200).json({ ok: true, message: 'User verified and logged in successfully' });
  } catch (err: any) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});