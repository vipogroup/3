import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDb } from '@/lib/db';
import { ObjectId } from 'mongodb';

// Store recent logs in memory for real-time access
let recentLogs = [];
let recentErrors = [];
let recentAlerts = [];
const MAX_LOGS = 100;

// Add log to memory
function addLog(log) {
  recentLogs.unshift({
    ...log,
    timestamp: new Date().toISOString(),
    id: Date.now() + Math.random().toString(36).substr(2, 9)
  });
  if (recentLogs.length > MAX_LOGS) recentLogs.pop();
}

// Add error to memory
function addError(error) {
  recentErrors.unshift({
    ...error,
    timestamp: new Date().toISOString(),
    id: Date.now() + Math.random().toString(36).substr(2, 9)
  });
  if (recentErrors.length > MAX_LOGS) recentErrors.pop();
}

// Add security alert to memory
function addSecurityAlert(alert) {
  recentAlerts.unshift({
    ...alert,
    timestamp: new Date().toISOString(),
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    severity: alert.severity || 'warning'
  });
  if (recentAlerts.length > MAX_LOGS) recentAlerts.pop();
}

// Check for admin authentication
async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'admin') return null;
    
    return decoded;
  } catch {
    return null;
  }
}

// GET - Fetch recent logs
export async function GET(request) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const since = searchParams.get('since'); // timestamp to get logs after

  const db = await getDb();

  try {
    let logs = [];
    let errors = [];
    let alerts = [];

    // Filter by timestamp if provided
    const filterByTime = (items) => {
      if (!since) return items;
      const sinceTime = new Date(since).getTime();
      return items.filter(item => new Date(item.timestamp).getTime() > sinceTime);
    };

    if (type === 'all' || type === 'logs') {
      // Get from memory first, then DB if needed
      logs = filterByTime(recentLogs);
      
      if (logs.length < 20) {
        const activityLogsCol = db.collection('activitylogs');
        const dbLogs = await activityLogsCol
          .find({})
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();
        
        const dbLogsFormatted = dbLogs.map(log => ({
          id: log._id.toString(),
          type: 'activity',
          action: log.action,
          user: log.userName || log.userId,
          details: log.details,
          ip: log.ip,
          timestamp: log.createdAt
        }));
        
        logs = [...logs, ...dbLogsFormatted].slice(0, 50);
      }
    }

    if (type === 'all' || type === 'errors') {
      errors = filterByTime(recentErrors);
      
      if (errors.length < 20) {
        const errorLogsCol = db.collection('errorlogs');
        const dbErrors = await errorLogsCol
          .find({})
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();
        
        const dbErrorsFormatted = dbErrors.map(err => ({
          id: err._id.toString(),
          type: 'error',
          message: err.message,
          stack: err.stack,
          path: err.path,
          method: err.method,
          statusCode: err.statusCode,
          timestamp: err.createdAt
        }));
        
        errors = [...errors, ...dbErrorsFormatted].slice(0, 50);
      }
    }

    if (type === 'all' || type === 'alerts') {
      alerts = filterByTime(recentAlerts);
      
      if (alerts.length < 20) {
        const securityAlertsCol = db.collection('securityalerts');
        const dbAlerts = await securityAlertsCol
          .find({})
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();
        
        const dbAlertsFormatted = dbAlerts.map(alert => ({
          id: alert._id.toString(),
          type: 'security',
          alertType: alert.type,
          message: alert.message,
          ip: alert.ip,
          userId: alert.userId,
          severity: alert.severity,
          timestamp: alert.createdAt
        }));
        
        alerts = [...alerts, ...dbAlertsFormatted].slice(0, 50);
      }
    }

    return NextResponse.json({
      success: true,
      logs,
      errors,
      alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching live logs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add new log/error/alert
export async function POST(request) {
  const admin = await checkAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    const db = await getDb();

    switch (type) {
      case 'log':
        addLog(data);
        const activityLogsCol = db.collection('activitylogs');
        await activityLogsCol.insertOne({ ...data, createdAt: new Date() });
        break;
      case 'error':
        addError(data);
        const errorLogsCol = db.collection('errorlogs');
        await errorLogsCol.insertOne({ ...data, createdAt: new Date() });
        break;
      case 'alert':
        addSecurityAlert(data);
        const securityAlertsCol = db.collection('securityalerts');
        await securityAlertsCol.insertOne({ ...data, createdAt: new Date() });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
