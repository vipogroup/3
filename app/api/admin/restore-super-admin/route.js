import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth/hash';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// הגדרת המנהל הראשי שצריך להיות במערכת תמיד
const SUPER_ADMIN = {
  email: '0587009938@gmail.com',
  phone: '0587009938',
  password: 'zxcvbnm',
  fullName: 'מנהל ראשי',
  role: 'admin',
  isSuperAdmin: true,
  protected: true
};

async function POSTHandler(req) {
  try {
    const db = await getDb();
    const users = db.collection('users');
    
    // בדיקה אם המנהל קיים
    const existingAdmin = await users.findOne({ 
      email: SUPER_ADMIN.email 
    });
    
    if (existingAdmin) {
      // עדכון המנהל הקיים
      await users.updateOne(
        { email: SUPER_ADMIN.email },
        {
          $set: {
            role: 'admin',
            isSuperAdmin: true,
            protected: true,
            isActive: true,
            updatedAt: new Date()
          }
        }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Super admin updated successfully',
        action: 'updated'
      });
    }
    
    // יצירת המנהל מחדש
    const passwordHash = await hashPassword(SUPER_ADMIN.password);
    const now = new Date();
    
    const newAdmin = {
      email: SUPER_ADMIN.email,
      phone: SUPER_ADMIN.phone,
      fullName: SUPER_ADMIN.fullName,
      role: SUPER_ADMIN.role,
      passwordHash,
      isSuperAdmin: true,
      protected: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      // אין tenantId - זה מנהל ראשי של המערכת
    };
    
    await users.insertOne(newAdmin);
    
    return NextResponse.json({
      success: true,
      message: 'Super admin restored successfully',
      action: 'created',
      admin: {
        email: SUPER_ADMIN.email,
        phone: SUPER_ADMIN.phone,
        fullName: SUPER_ADMIN.fullName,
        role: SUPER_ADMIN.role
      }
    });
    
  } catch (error) {
    console.error('Restore super admin error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

// פונקציה לבדיקה אם המנהל קיים
async function GETHandler(req) {
  try {
    const db = await getDb();
    const users = db.collection('users');
    
    const admin = await users.findOne(
      { email: SUPER_ADMIN.email },
      { projection: { passwordHash: 0 } }
    );
    
    return NextResponse.json({
      exists: !!admin,
      admin: admin ? {
        email: admin.email,
        phone: admin.phone,
        fullName: admin.fullName,
        role: admin.role,
        protected: admin.protected,
        isSuperAdmin: admin.isSuperAdmin
      } : null
    });
    
  } catch (error) {
    console.error('Check super admin error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
export const GET = withErrorLogging(GETHandler);
