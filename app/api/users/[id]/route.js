import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { verifyJwt } from '@/src/lib/auth/createToken.js';
import { getDb } from '@/lib/db';
import { isSuperAdminUser, DEFAULT_ADMIN_PERMISSIONS } from '@/lib/superAdmins';
import { isSuperAdmin } from '@/lib/tenant/tenantMiddleware';

async function usersCollection() {
  const dbo = await getDb();
  return dbo.collection('users');
}

function getToken(req) {
  return req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || '';
}

async function ensureAdmin(req) {
  const decoded = verifyJwt(getToken(req));
  if (decoded?.role !== 'admin' && decoded?.role !== 'business_admin') {
    return null;
  }
  
  // Hydrate user from DB to get current role, email, and tenantId
  const db = await getDb();
  const usersCol = db.collection('users');
  const userId = decoded.userId || decoded.sub || decoded.id;
  const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
  
  if (objectId) {
    const user = await usersCol.findOne({ _id: objectId }, { projection: { email: 1, role: 1, tenantId: 1 } });
    if (user) {
      return { ...decoded, email: user.email, role: user.role, _id: user._id, tenantId: user.tenantId };
    }
  }
  
  return decoded;
}

function parseObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(req, { params }) {
  try {
    if (!(await ensureAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    const objectId = parseObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const col = await usersCollection();
    const user = await col.findOne(
      { _id: objectId },
      { projection: { passwordHash: 0, password: 0 } },
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const currentUser = await ensureAdmin(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    const objectId = parseObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const body = await req.json();
    const updates = {};
    if (body.fullName) updates.fullName = String(body.fullName);
    if (body.phone) updates.phone = String(body.phone);
    if (Object.prototype.hasOwnProperty.call(body, 'isActive')) {
      updates.isActive = Boolean(body.isActive);
    }
    if (Object.prototype.hasOwnProperty.call(body, 'showPushButtons')) {
      updates.showPushButtons = Boolean(body.showPushButtons);
    }
    const col = await usersCollection();
    const existing = await col.findOne({ _id: objectId });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Multi-Tenant: Verify user belongs to admin's tenant
    if (!isSuperAdmin(currentUser) && currentUser.tenantId) {
      const userTenantId = existing.tenantId?.toString();
      const adminTenantId = currentUser.tenantId?.toString();
      if (userTenantId && userTenantId !== adminTenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    if (body.role) {
      if (!['admin', 'agent', 'customer'].includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      
      // Only super admins can change any role
      if (!isSuperAdminUser(currentUser)) {
        return NextResponse.json({ error: 'רק מנהלים ראשיים יכולים לשנות תפקידים' }, { status: 403 });
      }
      
      updates.role = body.role;
      
      // If promoting to admin, set default permissions
      if (body.role === 'admin' && existing.role !== 'admin') {
        updates.permissions = DEFAULT_ADMIN_PERMISSIONS;
      }
    }
    
    // Handle permissions update (only for admins and only by super admins)
    if (body.permissions && Array.isArray(body.permissions)) {
      if (!isSuperAdminUser(currentUser)) {
        return NextResponse.json({ error: 'רק מנהלים ראשיים יכולים לערוך הרשאות' }, { status: 403 });
      }
      updates.permissions = body.permissions;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    if (updates.phone) {
      const dup = await col.findOne({
        phone: updates.phone,
        _id: { $ne: objectId },
      });
      if (dup) {
        return NextResponse.json({ error: 'Phone already in use' }, { status: 409 });
      }
    }

    const isAdmin = existing.role === 'admin';

    if (updates.role && isAdmin && updates.role !== 'admin') {
      const adminCount = await col.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'לא ניתן להוריד את המנהל האחרון במערכת' },
          { status: 400 },
        );
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'isActive') && isAdmin && !updates.isActive) {
      const activeAdminCount = await col.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminCount <= 1) {
        return NextResponse.json(
          { error: 'לא ניתן לכבות את המנהל האחרון במערכת' },
          { status: 400 },
        );
      }
    }

    await col.updateOne({ _id: objectId }, { $set: updates });
    const user = await col.findOne(
      { _id: objectId },
      { projection: { passwordHash: 0, password: 0 } },
    );

    return NextResponse.json({ success: true, user });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const decoded = await ensureAdmin(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params || {};
    const objectId = parseObjectId(id);
    if (!objectId) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const col = await usersCollection();
    const user = await col.findOne({ _id: objectId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // הגנה על מנהלים מוגנים - בדיקת המייל הספציפי
    const PROTECTED_ADMINS = ['0587009938@gmail.com'];
    if (PROTECTED_ADMINS.includes(user.email) || user.protected === true) {
      // בדיקת סיסמת-על
      const body = await req.json().catch(() => ({}));
      if (body.masterPassword !== 'm1e9n8i5') {
        return NextResponse.json({ 
          error: 'מנהל זה מוגן ולא ניתן למחיקה. נדרשת סיסמת-על למחיקה' 
        }, { status: 403 });
      }
    }
    
    // Multi-Tenant: Verify user belongs to admin's tenant before deleting
    if (!isSuperAdmin(decoded) && decoded.tenantId) {
      const userTenantId = user.tenantId?.toString();
      const adminTenantId = decoded.tenantId?.toString();
      if (userTenantId && userTenantId !== adminTenantId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const decodedId = String(decoded.userId || decoded.sub || decoded._id || '');
    if (decodedId && decodedId === id) {
      return NextResponse.json({ error: 'לא ניתן למחוק את עצמך' }, { status: 400 });
    }

    if (user.role === 'admin') {
      const adminCount = await col.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'לא ניתן למחוק את המנהל האחרון במערכת' },
          { status: 400 },
        );
      }
    }

    await col.deleteOne({ _id: objectId });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
