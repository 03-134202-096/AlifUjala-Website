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
    // Find pending signup by email
    const pending = await prisma.pendingSignup.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!pending) return res.status(404).json({ error: 'pending signup not found' });

    if (pending.attempts >= 5) {
      return res.status(429).json({ error: 'Too many attempts. Please request a new OTP.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedOtp !== pending.hashedOtp) {
      await prisma.pendingSignup.update({
        where: { email: email.toLowerCase().trim() },
        data: { attempts: { increment: 1 } },
      });
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    if (new Date() > pending.expiry) {
      return res.status(410).json({ error: 'OTP expired' });
    }

    // Create user from pending signup
    const createdUser = await prisma.user.create({
      data: {
        username: pending.username,
        email: pending.email,
        password_hash: pending.password_hash,
        isVerified: true,
      },
    });

    // Delete pending signup
    await prisma.pendingSignup.delete({ where: { email: email.toLowerCase().trim() } });

    // Set session for the user
    (req as any).session.user = {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      isPremium: createdUser.isPremium,
      lives: createdUser.lives,
    };
    await (req as any).session.save();

    return res.status(200).json({ ok: true, message: 'User verified and logged in successfully' });
  } catch (err: any) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});