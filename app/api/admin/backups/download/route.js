import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

async function GETHandler(req) {
  // בדיקת הרשאות
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const backupName = searchParams.get('name');

    if (!backupName) {
      return NextResponse.json({ error: 'שם גיבוי חסר' }, { status: 400 });
    }

    // בדיקת אבטחה - מניעת path traversal
    if (backupName.includes('..') || backupName.includes('/') || backupName.includes('\\')) {
      return NextResponse.json({ error: 'שם גיבוי לא תקין' }, { status: 400 });
    }

    const backupDir = path.join(process.cwd(), 'backups', 'database', backupName);
    
    if (!fs.existsSync(backupDir)) {
      return NextResponse.json({ error: 'גיבוי לא נמצא' }, { status: 404 });
    }

    // חיפוש קובץ ZIP
    const zipPath = path.join(backupDir, 'full-backup.zip');
    
    if (!fs.existsSync(zipPath)) {
      return NextResponse.json({ error: 'קובץ ZIP לא נמצא בגיבוי זה' }, { status: 404 });
    }

    // קריאת הקובץ
    const zipBuffer = fs.readFileSync(zipPath);

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${backupName}.zip"`
      }
    });

  } catch (error) {
    console.error('[Download] Error:', error);
    return NextResponse.json({ 
      error: 'שגיאה בהורדת הקובץ: ' + error.message 
    }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
