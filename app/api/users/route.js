export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { getDb } from '@/lib/db';
import { escapeRegex } from '@/lib/utils/sanitize';
import { hashPassword } from '@/lib/auth/hash';
import { verify as verifyJwt } from '@/lib/auth/createToken';
import { getToken as getNextAuthToken } from 'next-auth/jwt';

function getLegacyToken(req) {
  return req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || '';
}

async function ensureAdmin(req) {
  // Try legacy JWT first
  const legacyToken = getLegacyToken(req);
  if (legacyToken) {
    try {
      const decoded = verifyJwt(legacyToken);
      if (decoded?.role === 'admin') {
        return decoded;
      }
    } catch (e) {
      // Legacy token invalid, try NextAuth
    }
  }

  // Try NextAuth token
  try {
    const nextAuthToken = await getNextAuthToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (nextAuthToken?.role === 'admin') {
      return {
        userId: nextAuthToken.userId || nextAuthToken.sub,
        email: nextAuthToken.email,
        role: nextAuthToken.role,
      };
    }
  } catch (e) {
    console.error('NextAuth token check failed:', e.message);
  }

  return null;
}

function normalizeId(doc) {
  if (!doc) return doc;
  return {
    ...doc,
    _id: doc._id ? String(doc._id) : undefined,
  };
}

function applyPagination(array, skip, limit) {
  const sorted = [...array].sort((a, b) => {
    const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });
  return sorted.slice(skip, skip + limit);
}

export async function GET(req) {
  try {
    const admin = await ensureAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;
    const search = (searchParams.get('q') || searchParams.get('search') || '').trim();
    const roleFilter = (searchParams.get('role') || '').trim();

    const db = await getDb();
    const col = db.collection('users');
    const projection = { passwordHash: 0, password: 0 };

    // בניית פילטר חיפוש
    const filter = {};
    
    // חיפוש לפי טלפון, מייל או שם
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { fullName: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
      ];
    }
    
    // פילטר לפי תפקיד
    if (roleFilter && ['admin', 'agent', 'customer'].includes(roleFilter)) {
      filter.role = roleFilter;
    }

    const cursor = await col.find(filter, { projection });

    let items;
    let total;

    if (typeof cursor.sort === 'function') {
      items = await cursor.sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();
      total = await col.countDocuments(filter);
    } else {
      const all = await cursor.toArray();
      total = all.length;
      items = applyPagination(all, skip, limit);
    }

    return NextResponse.json({
      items: items.map(normalizeId),
      total,
      page,
      limit,
    });
  } catch (e) {
    console.error('USERS_GET_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = await ensureAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, phone, role, password } = body || {};

    if (!fullName || (!email && !phone) || !role || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!['admin', 'agent'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection('users');

    const normalizedEmail = email ? email.toLowerCase().trim() : null;
    const dedupeQuery = [];
    if (normalizedEmail) dedupeQuery.push({ email: normalizedEmail });
    if (phone) dedupeQuery.push({ phone });

    if (dedupeQuery.length > 0) {
      const existing = await col.findOne({ $or: dedupeQuery });
      if (existing) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();
    const doc = {
      fullName,
      email: normalizedEmail,
      phone: phone || null,
      role,
      passwordHash,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await col.insertOne(doc);
    const createdId = result.insertedId || doc._id;

    const created = await col.findOne(
      createdId
        ? { _id: createdId }
        : { email: normalizedEmail || undefined, phone: phone || undefined },
      { projection: { passwordHash: 0, password: 0 } },
    );

    return NextResponse.json({ success: true, user: normalizeId(created) }, { status: 201 });
  } catch (e) {
    console.error('USERS_POST_ERROR', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
