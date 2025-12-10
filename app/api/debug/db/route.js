export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB, getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const uriSample = (process.env.MONGODB_URI || '').replace(/:\/\/.*@/, '://***@');
    console.log('DBG MONGODB_URI ->', uriSample, ' DB:', process.env.MONGODB_DB);

    await connectDB();
    const db = await getDb();
    const databaseName = db.databaseName;

    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);

    let userCount = 0;
    try {
      userCount = await db.collection('users').countDocuments();
    } catch {
      userCount = 0;
    }

    // Test password for admin user
    let passwordTest = null;
    let allUsers = [];
    try {
      allUsers = await db.collection('users').find({}).project({ email: 1, role: 1 }).toArray();
      const adminUser = await db.collection('users').findOne({ email: 'm0587009938@gmail.com' });
      if (adminUser?.passwordHash) {
        const match = await bcrypt.compare('12345678', adminUser.passwordHash);
        passwordTest = {
          userFound: true,
          hasHash: true,
          hashPrefix: adminUser.passwordHash.substring(0, 20),
          passwordMatches: match,
        };
      } else {
        passwordTest = { userFound: !!adminUser, hasHash: false };
      }
    } catch (e) {
      passwordTest = { error: String(e?.message || e) };
    }

    console.log('✅ Database connection test successful');

    return NextResponse.json({
      success: true,
      database: databaseName,
      collections: names,
      userCount,
      allUsers: allUsers.map(u => ({ email: u.email, role: u.role })),
      passwordTest,
      mongoUri: (process.env.MONGODB_URI || '').substring(0, 50) + '...',
      note: 'Debug OK',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: String(err?.message || err) },
      { status: 500 },
    );
  }
}
