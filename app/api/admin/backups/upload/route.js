import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { requireSuperAdminApi } from '@/lib/auth/server';
import { rateLimiters } from '@/lib/rateLimit';
import { logAdminActivity } from '@/lib/auditMiddleware';

async function POSTHandler(req) {
  const rateLimit = rateLimiters.admin(req);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.message }, { status: 429 });
  }

  let user;
  try {
    user = await requireSuperAdminApi(req);
  } catch (err) {
    const status = err?.status || 401;
    const message = status === 403 ? 'Forbidden' : 'Unauthorized';
    return NextResponse.json({ error: message }, { status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const action = formData.get('action');

    if (!file) {
      return NextResponse.json({ error: 'לא נבחר קובץ' }, { status: 400 });
    }

    if (action === 'restoreFromZip') {
      // קריאת קובץ ה-ZIP
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // חילוץ ה-ZIP
      const AdmZip = (await import('adm-zip')).default;
      const zip = new AdmZip(buffer);
      const zipEntries = zip.getEntries();

      // חיפוש קובץ database-backup.json
      let dbBackupEntry = zipEntries.find(entry => 
        entry.entryName === 'database-backup.json' || 
        entry.entryName.endsWith('/database-backup.json')
      );

      if (!dbBackupEntry) {
        return NextResponse.json({ 
          error: 'לא נמצא קובץ database-backup.json בתוך ה-ZIP' 
        }, { status: 400 });
      }

      // קריאת תוכן קובץ הגיבוי
      const dbBackupContent = zip.readAsText(dbBackupEntry);
      let backupData;
      
      try {
        backupData = JSON.parse(dbBackupContent);
      } catch (parseErr) {
        return NextResponse.json({ 
          error: 'קובץ הגיבוי לא תקין - לא ניתן לפרסר JSON' 
        }, { status: 400 });
      }

      // שחזור מסד הנתונים
      const { getDb } = await import('@/lib/db');
      const db = await getDb();
      
      const restored = [];
      const errors = [];

      // בדיקת פורמט הגיבוי
      const collections = backupData.collections || backupData;

      for (const [collectionName, docs] of Object.entries(collections)) {
        if (collectionName === 'meta') continue;
        
        try {
          const collection = db.collection(collectionName);
          
          // מחיקת הנתונים הקיימים
          await collection.deleteMany({});
          
          // הכנסת הנתונים החדשים
          if (Array.isArray(docs) && docs.length > 0) {
            await collection.insertMany(docs, { ordered: false });
          }
          
          restored.push({ name: collectionName, count: Array.isArray(docs) ? docs.length : 0 });
        } catch (err) {
          console.error(`Error restoring ${collectionName}:`, err.message);
          errors.push({ collection: collectionName, error: err.message });
        }
      }

      // לוג פעילות
      await logAdminActivity({
        action: 'restore',
        entity: 'system',
        userId: user.id || user._id || null,
        userEmail: user.email || null,
        description: 'שחזור מקובץ ZIP',
        metadata: { 
          fileName: file.name,
          collectionsRestored: restored.length,
          errors: errors.length
        }
      });

      return NextResponse.json({
        success: true,
        message: `✅ שחזור מ-ZIP הושלם! שוחזרו ${restored.length} קולקציות`,
        restored,
        errors: errors.length > 0 ? errors : undefined
      });
    }

    return NextResponse.json({ error: 'פעולה לא מוכרת' }, { status: 400 });

  } catch (error) {
    console.error('[Upload] Error:', error);
    return NextResponse.json({ 
      error: 'שגיאה בעיבוד הקובץ: ' + error.message 
    }, { status: 500 });
  }
}

export const POST = withErrorLogging(POSTHandler);
