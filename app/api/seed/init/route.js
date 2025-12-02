import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, verifyPassword } from '@/lib/hash';

export async function POST() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'm0587009938@gmail.com';
    const adminPass = process.env.ADMIN_PASSWORD || '123456';

    const exists = await User.findOne({ email: adminEmail });

    if (!exists) {
      const passwordHash = await hashPassword(adminPass);
      await User.create({
        email: adminEmail,
        name: 'VIPO Admin',
        role: 'admin',
        passwordHash,
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
