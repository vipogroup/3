import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyJwt } from '@/src/lib/auth/createToken.js';
import { getDb } from '@/lib/db';
import { isSuperAdminUser } from '@/lib/superAdmins';

function getToken(req) {
  return req.cookies.get('auth_token')?.value || req.cookies.get('token')?.value || '';
}

async function ensureAdmin(req) {
  const decoded = verifyJwt(getToken(req));
  if (decoded?.role !== 'admin' && decoded?.role !== 'business_admin') {
    return null;
  }
  
  const db = await getDb();
  const usersCol = db.collection('users');
  const userId = decoded.userId || decoded.sub || decoded.id;
  const objectId = ObjectId.isValid(userId) ? new ObjectId(userId) : null;
  
  if (objectId) {
    const user = await usersCol.findOne({ _id: objectId }, { projection: { email: 1, role: 1 } });
    if (user) {
      return { ...decoded, email: user.email, role: user.role, _id: user._id };
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

async function POSTHandler(req, { params }) {
  try {
    const currentUser = await ensureAdmin(req);
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super admins can reset users
    if (!isSuperAdminUser(currentUser)) {
      return NextResponse.json({ error: 'רק מנהלים ראשיים יכולים לאפס משתמשים' }, { status: 403 });
    }

    const { id } = params || {};
    const userId = parseObjectId(id);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const db = await getDb();
    const users = db.collection('users');
    const orders = db.collection('orders');
    const withdrawals = db.collection('withdrawalRequests');

    // Get the user first
    const user = await users.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cannot reset admins
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'לא ניתן לאפס מנהלים' }, { status: 400 });
    }
    
    // הגנה נוספת על מנהלים מוגנים
    const PROTECTED_ADMINS = ['0587009938@gmail.com'];
    if (PROTECTED_ADMINS.includes(user.email) || user.protected === true) {
      return NextResponse.json({ 
        error: 'משתמש זה מוגן ולא ניתן לאיפוס' 
      }, { status: 403 });
    }

    // Delete all orders where user is the agent
    const ordersDeleted = await orders.deleteMany({
      $or: [
        { agentId: userId },
        { refAgentId: userId }
      ]
    });

    // Delete all withdrawal requests for this user
    const withdrawalsDeleted = await withdrawals.deleteMany({ userId: userId });

    // Reset user commission fields
    const resetResult = await users.updateOne(
      { _id: userId },
      {
        $set: {
          commissionBalance: 0,
          commissionOnHold: 0,
          commissionOnHoldManual: 0,
          totalSales: 0,
          updatedAt: new Date()
        }
      }
    );

    console.log('USER_RESET', {
      userId: id,
      userName: user.fullName,
      ordersDeleted: ordersDeleted.deletedCount,
      withdrawalsDeleted: withdrawalsDeleted.deletedCount,
      resetBy: currentUser.email || currentUser._id
    });

    return NextResponse.json({
      success: true,
      message: 'המשתמש אופס בהצלחה',
      stats: {
        ordersDeleted: ordersDeleted.deletedCount,
        withdrawalsDeleted: withdrawalsDeleted.deletedCount
      }
    });
  } catch (e) {
    console.error('USER_RESET_ERROR:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
