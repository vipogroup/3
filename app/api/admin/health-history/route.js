import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const HEALTH_HISTORY_COLLECTION = 'health_history';

// Helper to check if user is admin
async function checkAdmin(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  const authTokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
  const legacyTokenMatch = cookieHeader.match(/token=([^;]+)/);
  const tokenValue = authTokenMatch?.[1] || legacyTokenMatch?.[1];
  
  if (!tokenValue) return null;
  
  try {
    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jwtVerify(decodeURIComponent(tokenValue), secret);
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

// GET - Fetch health history
export async function GET(req) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const hours = parseInt(searchParams.get('hours') || '24');
    const service = searchParams.get('service');

    const db = await getDb();
    
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);

    let query = { createdAt: { $gte: cutoffDate } };
    if (service) query.service = service;

    const history = await db.collection(HEALTH_HISTORY_COLLECTION)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    // Calculate uptime percentages
    const services = ['mongodb', 'cloudinary', 'resend', 'twilio'];
    const uptime = {};
    
    for (const svc of services) {
      const svcHistory = history.filter(h => h.service === svc);
      const total = svcHistory.length;
      const healthy = svcHistory.filter(h => h.status === 'connected').length;
      uptime[svc] = total > 0 ? Math.round((healthy / total) * 100) : 0;
    }

    // Get last check for each service
    const lastChecks = {};
    for (const svc of services) {
      const last = history.find(h => h.service === svc);
      lastChecks[svc] = last || null;
    }

    return NextResponse.json({ 
      success: true, 
      history,
      uptime,
      lastChecks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching health history:', error);
    return NextResponse.json({ error: 'Failed to fetch health history' }, { status: 500 });
  }
}

// POST - Record health check result
export async function POST(req) {
  try {
    const body = await req.json();
    const { results } = body;

    if (!results || typeof results !== 'object') {
      return NextResponse.json({ error: 'Results object is required' }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();
    
    // Insert a record for each service
    const entries = Object.entries(results).map(([service, data]) => ({
      service,
      status: data.status,
      message: data.message,
      responseTime: data.responseTime || null,
      createdAt: now
    }));

    if (entries.length > 0) {
      await db.collection(HEALTH_HISTORY_COLLECTION).insertMany(entries);
    }

    return NextResponse.json({ success: true, recorded: entries.length });
  } catch (error) {
    console.error('Error recording health check:', error);
    return NextResponse.json({ error: 'Failed to record health check' }, { status: 500 });
  }
}

// DELETE - Clear old health history
export async function DELETE(req) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');

    const db = await getDb();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await db.collection(HEALTH_HISTORY_COLLECTION).deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting health history:', error);
    return NextResponse.json({ error: 'Failed to delete health history' }, { status: 500 });
  }
}
