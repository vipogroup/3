export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const users = db.collection('users');

    const allUsers = await users
      .find(
        {},
        {
          projection: {
            email: 1,
            phone: 1,
            role: 1,
            fullName: 1,
            createdAt: 1,
            passwordHash: 1, // Just to check if it exists
          },
        },
      )
      .toArray();

    return NextResponse.json({
      success: true,
      count: allUsers.length,
      users: allUsers.map((u) => ({
        _id: String(u._id),
        email: u.email,
        phone: u.phone,
        role: u.role,
        fullName: u.fullName,
        hasPassword: !!u.passwordHash,
        passwordLength: u.passwordHash ? u.passwordHash.length : 0,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('LIST_USERS_ERROR:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
