export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, verifyPassword } from '@/lib/hash';

export async function POST(req) {
  // Security: Only allow in development or with secret key
  const isProduction = process.env.NODE_ENV === 'production';
  const seedSecret = req.headers.get('x-seed-secret');
  const validSecret = process.env.SEED_SECRET || 'vipo-seed-2024';
  
  if (isProduction && seedSecret !== validSecret) {
    return NextResponse.json({ error: 'Forbidden - Seed disabled in production' }, { status: 403 });
  }

  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'm0587009938@gmail.com';
    const adminPass = process.env.ADMIN_PASSWORD || '123456';

    const exists = await User.findOne({ email: adminEmail });

    if (!exists) {
      const passwordHash = await hashPassword(adminPass);
      await User.create({
        email: adminEmail,
        fullName: 'VIPO Admin',
        phone: '0587009938',
        role: 'admin',
        passwordHash,
        isActive: true,
      });
    } else {
      const hasCorrectRole = exists.role === 'admin';
      const hasPassword = await verifyPassword(adminPass, exists.passwordHash);

      if (!hasCorrectRole || !hasPassword) {
        exists.role = 'admin';
        exists.passwordHash = await hashPassword(adminPass);
        if (exists.password) {
          exists.password = undefined;
        }
        await exists.save();
      }
    }

    const count = await User.countDocuments({});
    return NextResponse.json({ ok: true, users: count, adminEmail });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
