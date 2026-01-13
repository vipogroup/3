import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { hashPassword } from '@/lib/hash';
import { verify as verifyJwt } from '@/lib/auth/createToken';
import { getAuthToken } from '@/lib/auth/requireAuth';
import { getDb } from '@/lib/db';

function getClientIp(request) {
  try {
    return (
      request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request?.headers?.get('x-real-ip') ||
      'unknown'
    );
  } catch (error) {
    return 'unknown';
  }
}

function validateAdminPassword(password) {
  if (typeof password !== 'string') return false;
  if (password.length < 10) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  return hasUpper && hasLower && hasDigit && hasSymbol;
}

async function usersCollection() {
  const dbo = await getDb();
  return dbo.collection('users');
}

async function POSTHandler(req, { params }) {
  try {
    const token = getAuthToken(req);
    const decoded = verifyJwt(token);
    if (decoded?.role !== 'admin' && decoded?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const body = await req.json();
    const { password } = body || {};
    if (!password) {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        {
          error: 'weak_password',
          message:
            'סיסמת מנהל חייבת להיות באורך 10 תווים לפחות ולכלול אות גדולה, אות קטנה, ספרה ותו מיוחד',
        },
        { status: 400 },
      );
    }

    const col = await usersCollection();
    const objectId = new ObjectId(id);
    const existing = await col.findOne({ _id: objectId }, { projection: { _id: 1 } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();
    const perfId = decoded.userId || decoded.sub || decoded._id || null;
    const updateResult = await col.updateOne(
      { _id: objectId },
      {
        $set: {
          passwordHash,
          passwordChangedAt: now,
        },
        $unset: {
          passwordResetToken: '',
          passwordResetExpires: '',
          passwordResetAttempts: '',
        },
        $push: {
          passwordResetAudit: {
            type: 'admin_reset',
            resetAt: now,
            performedBy: perfId ? String(perfId) : null,
            ip: getClientIp(req),
          },
        },
      },
    );

    if (!updateResult?.matchedCount) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
