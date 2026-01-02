import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { logAdminActivity } from '@/lib/auditMiddleware';
import { rateLimiters } from '@/lib/rateLimit';

const execAsync = promisify(exec);

// Helper to check if user is admin
async function checkAdmin(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  // Check both auth_token and legacy token cookies
  const authTokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
  const legacyTokenMatch = cookieHeader.match(/token=([^;]+)/);
  const tokenValue = authTokenMatch?.[1] || legacyTokenMatch?.[1];
  
  if (!tokenValue) return null;
  
  try {
    const { jwtVerify } = await import('jose');
    if (!process.env.JWT_SECRET) return null;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(decodeURIComponent(tokenValue), secret);
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}

// GET - List backups
export async function GET(req) {
  const rateLimit = rateLimiters.admin(req);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.message }, { status: 429 });
  }

  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backupsDir = path.join(process.cwd(), 'backups', 'database');
    
    if (!fs.existsSync(backupsDir)) {
      return NextResponse.json({ backups: [] });
    }

    const items = fs.readdirSync(backupsDir, { withFileTypes: true });
    const backups = items
      .filter(item => item.isDirectory() && item.name.startsWith('mongo-'))
      .map(item => {
        const fullPath = path.join(backupsDir, item.name);
        const stats = fs.statSync(fullPath);
        
        // Parse date from folder name (mongo-2025-12-31T15-47-00-767Z)
        const dateMatch = item.name.match(/mongo-(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})/);
        let dateStr = 'לא ידוע';
        if (dateMatch) {
          const [, year, month, day, hour, minute] = dateMatch;
          dateStr = `${day}/${month}/${year} ${hour}:${minute}`;
        }
        
        return {
          name: item.name,
          date: dateStr,
          size: formatBytes(getDirectorySize(fullPath)),
          path: fullPath
        };
      })
      .sort((a, b) => b.name.localeCompare(a.name)) // Sort newest first
      .slice(0, 20); // Limit to 20 most recent

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 });
  }
}

// POST - Run backup action
export async function POST(req) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'backup') {
      // Direct MongoDB backup - works in Vercel serverless
      const { getDb } = await import('@/lib/db');
      const db = await getDb();
      
      // Get all collections
      const collections = await db.listCollections().toArray();
      const backupData = {
        timestamp: new Date().toISOString(),
        collections: {}
      };
      
      // Export each collection
      for (const col of collections) {
        const docs = await db.collection(col.name).find({}).toArray();
        backupData.collections[col.name] = {
          count: docs.length,
          data: docs
        };
      }
      
      // Log backup action
      await logAdminActivity({
        action: 'backup',
        entity: 'system',
        userId: user.userId,
        userEmail: user.email,
        description: 'גיבוי מסד נתונים',
        metadata: { 
          type: 'database',
          collectionsCount: collections.length,
          timestamp: backupData.timestamp
        }
      });

      // Return backup data for download
      return NextResponse.json({ 
        success: true, 
        message: 'גיבוי הושלם בהצלחה',
        backup: backupData,
        downloadReady: true
      });
    }

    if (action === 'deploy') {
      // In Vercel serverless, we can't run deploy commands
      // Deploy happens automatically when pushing to GitHub
      await logAdminActivity({
        action: 'deploy',
        entity: 'system',
        userId: user.userId,
        userEmail: user.email,
        description: 'בקשת Deploy - מתבצע אוטומטית דרך GitHub',
        metadata: { platform: 'vercel', method: 'git_push' }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Deploy ל-Vercel מתבצע אוטומטית! כשאתה דוחף קוד ל-GitHub, Vercel מעדכן את האתר תוך 1-2 דקות.',
        info: 'לצפייה בסטטוס: https://vercel.com/vipos-projects-0154d019'
      });
    }

    if (action === 'update') {
      // In Vercel serverless, we can't run git/npm commands
      // Provide instructions for local update
      return NextResponse.json({ 
        success: true, 
        message: 'עדכון מערכת זמין רק בסביבה מקומית. הרץ את הפקודות הבאות בטרמינל:',
        commands: [
          'cd vipo-agents-test',
          'git pull',
          'npm install',
          'git push'
        ],
        info: 'לאחר ה-push, Vercel יעדכן את האתר אוטומטית.'
      });
    }

    if (action === 'server') {
      // Local server - not applicable in Vercel
      return NextResponse.json({ 
        success: true, 
        message: 'הפעלת שרת מקומי זמינה רק במחשב שלך. הרץ בטרמינל:',
        commands: [
          'cd vipo-agents-test',
          'npm run dev'
        ],
        info: 'השרת יפעל בכתובת: http://localhost:3001'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ 
      error: 'Failed to run backup', 
      details: error.message 
    }, { status: 500 });
  }
}

// Helper to get directory size
function getDirectorySize(dirPath) {
  let size = 0;
  try {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        size += stats.size;
      } else if (stats.isDirectory()) {
        size += getDirectorySize(fullPath);
      }
    }
  } catch {
    // Ignore errors
  }
  return size;
}

// Helper to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
