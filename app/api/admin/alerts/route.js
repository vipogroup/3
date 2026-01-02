import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const ALERTS_COLLECTION = 'system_alerts';

// Helper to check if user is admin
async function checkAdmin(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (!tokenMatch) return null;
  
  try {
    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(tokenMatch[1], secret);
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

// GET - Fetch active alerts
export async function GET(req) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const db = await getDb();
    
    let query = {};
    if (unreadOnly) {
      query.read = false;
    }

    const alerts = await db.collection(ALERTS_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const unreadCount = await db.collection(ALERTS_COLLECTION).countDocuments({ read: false });

    return NextResponse.json({ 
      success: true, 
      alerts,
      unreadCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

// POST - Create a new alert
export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      type = 'info', // error, warning, info, success
      title,
      message,
      source,
      metadata 
    } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const db = await getDb();
    
    const alert = {
      type,
      title,
      message,
      source: source || 'system',
      metadata: metadata || {},
      read: false,
      readAt: null,
      readBy: null,
      createdAt: new Date()
    };

    await db.collection(ALERTS_COLLECTION).insertOne(alert);

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}

// PATCH - Mark alert(s) as read
export async function PATCH(req) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, markAll } = body;

    const db = await getDb();
    
    if (markAll) {
      await db.collection(ALERTS_COLLECTION).updateMany(
        { read: false },
        { 
          $set: { 
            read: true,
            readAt: new Date(),
            readBy: user.email
          } 
        }
      );
    } else if (id) {
      const { ObjectId } = await import('mongodb');
      await db.collection(ALERTS_COLLECTION).updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            read: true,
            readAt: new Date(),
            readBy: user.email
          } 
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}

// DELETE - Delete old alerts
export async function DELETE(req) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    const db = await getDb();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await db.collection(ALERTS_COLLECTION).deleteMany({
      createdAt: { $lt: cutoffDate },
      read: true
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting alerts:', error);
    return NextResponse.json({ error: 'Failed to delete alerts' }, { status: 500 });
  }
}

