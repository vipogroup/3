import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('🌱 Seeding MongoDB with demo users...');

    const db = await getDb();
    const users = db.collection('users');

    // Check if users already exist
    const existingCount = await users.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `⚠️ Database already has ${existingCount} users. Skipped seeding.`,
        existingUsers: existingCount,
      });
    }

    // Demo users to seed
    const demoUsers = [
      {
        fullName: 'מנהל ראשי',
        email: 'admin@vipo.local',
        phone: '0501234567',
        password: '12345678A?',
        role: 'admin',
      },
      {
        fullName: 'סוכן בכיר',
        email: 'agent@vipo.local',
        phone: '0521234567',
        password: '12345678A?',
        role: 'agent',
      },
      {
        fullName: 'לקוח רגיל',
        email: 'user@vipo.local',
        phone: '0541234567',
        password: '12345678A?',
        role: 'customer',
      },
      // Simple test users
      {
        fullName: 'Admin Test',
        email: 'admin@test.com',
        phone: '0501111111',
        password: 'admin',
        role: 'admin',
      },
      {
        fullName: 'Agent Test',
        email: 'agent@test.com',
        phone: '0502222222',
        password: 'admin',
        role: 'agent',
      },
      {
        fullName: 'User Test',
        email: 'user@test.com',
        phone: '0503333333',
        password: 'admin',
        role: 'customer',
      },
    ];

    // Hash passwords and insert users
    const insertPromises = demoUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10);

      return users.insertOne({
        fullName: user.fullName,
        email: user.email.toLowerCase(),
        phone: user.phone,
        passwordHash,
        role: user.role,
        isActive: true,
        referralsCount: 0,
        referralCount: 0,
        commissionBalance: 0,
        totalSales: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await Promise.all(insertPromises);

    console.log(`✅ Seeded ${demoUsers.length} users to MongoDB`);

    return NextResponse.json({
      success: true,
      message: `✅ Successfully seeded ${demoUsers.length} demo users`,
      users: demoUsers.map((u) => ({
        email: u.email,
        password: u.password,
        role: u.role,
      })),
    });
  } catch (error) {
    console.error('❌ Seed error:', error);

    return NextResponse.json(
      {
        success: false,
        message: '❌ Failed to seed database',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
