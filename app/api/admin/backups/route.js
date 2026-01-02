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
      const isLocal = !process.env.VERCEL && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);
      
      if (isLocal) {
        // Run backup.cmd script locally
        try {
          const scriptPath = path.join(process.cwd(), 'backups', 'database', 'backup.cmd');
          console.log('[Backup] Running script:', scriptPath);
          
          const { stdout, stderr } = await execAsync(`"${scriptPath}"`, { 
            cwd: process.cwd(),
            timeout: 120000 
          });
          
          await logAdminActivity({
            action: 'backup',
            entity: 'system',
            userId: user.userId,
            userEmail: user.email,
            description: 'גיבוי מסד נתונים באמצעות backup.cmd',
            metadata: { type: 'script', output: (stdout || '').substring(0, 500) }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'גיבוי הושלם בהצלחה באמצעות backup.cmd!',
            details: stdout,
            scriptUsed: 'backup.cmd'
          });
        } catch (error) {
          console.error('[Backup] Script error:', error);
          // Fallback to direct MongoDB backup
        }
      }
      
      // Direct MongoDB backup - save to backups/database folder
      const { getDb } = await import('@/lib/db');
      const db = await getDb();
      
      // Create backup directory with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(process.cwd(), 'backups', 'database', `mongo-${timestamp}`);
      
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Get all collections
      const collections = await db.listCollections().toArray();
      let totalDocs = 0;
      
      // Export each collection to separate JSON file
      for (const col of collections) {
        const docs = await db.collection(col.name).find({}).toArray();
        totalDocs += docs.length;
        const filePath = path.join(backupDir, `${col.name}.json`);
        fs.writeFileSync(filePath, JSON.stringify(docs, null, 2), 'utf8');
      }
      
      // Log backup action
      await logAdminActivity({
        action: 'backup',
        entity: 'system',
        userId: user.userId,
        userEmail: user.email,
        description: 'גיבוי מסד נתונים לתיקייה',
        metadata: { 
          type: 'database',
          collectionsCount: collections.length,
          totalDocs,
          backupDir: `mongo-${timestamp}`
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: `גיבוי הושלם בהצלחה! נשמר בתיקייה: mongo-${timestamp}`,
        backupFolder: `mongo-${timestamp}`,
        collectionsCount: collections.length,
        totalDocs
      });
    }

    if (action === 'deploy') {
      const isLocal = !process.env.VERCEL && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);
      
      // Try deploy-vercel.cmd in local environment
      if (isLocal && !process.env.VERCEL_DEPLOY_HOOK_URL) {
        try {
          const scriptPath = path.join(process.cwd(), 'backups', 'database', 'deploy-vercel.cmd');
          console.log('[Deploy] Running script:', scriptPath);
          
          const { stdout } = await execAsync(`"${scriptPath}" --auto`, { 
            cwd: process.cwd(),
            timeout: 300000 
          });
          
          await logAdminActivity({
            action: 'deploy',
            entity: 'system',
            userId: user.userId,
            userEmail: user.email,
            description: 'Deploy ל-Vercel באמצעות deploy-vercel.cmd',
            metadata: { type: 'script', output: (stdout || '').substring(0, 500) }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'Deploy ל-Vercel הופעל באמצעות deploy-vercel.cmd!',
            details: stdout,
            scriptUsed: 'deploy-vercel.cmd'
          });
        } catch (error) {
          console.error('[Deploy] Script error:', error);
          // Fallback to deploy hook or instructions
        }
      }
      
      // Use Vercel Deploy Hook if available
      const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
      
      if (deployHookUrl) {
        try {
          // Trigger Vercel deploy via webhook
          const deployRes = await fetch(deployHookUrl, { method: 'POST' });
          
          if (deployRes.ok) {
            const deployData = await deployRes.json().catch(() => ({}));
            
            await logAdminActivity({
              action: 'deploy',
              entity: 'system',
              userId: user.userId,
              userEmail: user.email,
              description: 'Deploy ל-Vercel הופעל בהצלחה',
              metadata: { platform: 'vercel', method: 'deploy_hook', jobId: deployData.job?.id }
            });

            return NextResponse.json({ 
              success: true, 
              message: 'Deploy ל-Vercel הופעל בהצלחה! הבנייה תתחיל תוך מספר שניות.',
              info: 'לצפייה בסטטוס: https://vercel.com/vipos-projects-0154d019/vipo-agents-test/deployments',
              deployTriggered: true
            });
          } else {
            throw new Error('Deploy hook failed');
          }
        } catch (err) {
          console.error('Deploy hook error:', err);
          return NextResponse.json({ 
            success: false, 
            error: 'Deploy נכשל. נסה שוב או בצע git push ידנית.',
            details: err.message
          }, { status: 500 });
        }
      } else {
        // No deploy hook configured - redirect to Vercel
        await logAdminActivity({
          action: 'deploy',
          entity: 'system',
          userId: user.userId,
          userEmail: user.email,
          description: 'בקשת Deploy - הפניה ל-Vercel',
          metadata: { platform: 'vercel', method: 'redirect' }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'לביצוע Deploy, לחץ על הכפתור למטה:',
          vercelUrl: 'https://vercel.com/vipos-projects-0154d019/vipo-agents-test/deployments',
          info: 'בדף Vercel: לחץ על הפריסה האחרונה → ⋮ → Redeploy',
          redirectToVercel: true
        });
      }
    }

    if (action === 'gitpush') {
      const isLocal = !process.env.VERCEL && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);
      
      if (isLocal) {
        try {
          const scriptPath = path.join(process.cwd(), 'backups', 'database', 'git-push.cmd');
          console.log('[GitPush] Running script:', scriptPath);
          
          const { stdout } = await execAsync(`"${scriptPath}" --auto`, { 
            cwd: process.cwd(),
            timeout: 120000 
          });
          
          await logAdminActivity({
            action: 'gitpush',
            entity: 'system',
            userId: user.userId,
            userEmail: user.email,
            description: 'Push ל-GitHub באמצעות git-push.cmd',
            metadata: { type: 'script', output: (stdout || '').substring(0, 500) }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'Push ל-GitHub הושלם בהצלחה!',
            details: stdout,
            scriptUsed: 'git-push.cmd'
          });
        } catch (error) {
          console.error('[GitPush] Script error:', error);
          return NextResponse.json({ 
            success: false, 
            error: 'Push ל-GitHub נכשל',
            details: error.message
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Push ל-GitHub זמין רק בסביבה מקומית',
          info: 'בסביבת Production, בצע git push מהטרמינל'
        }, { status: 400 });
      }
    }

    if (action === 'update') {
      // Check if running locally (not on Vercel)
      const isLocal = !process.env.VERCEL && (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV);
      
      if (isLocal) {
        // Try update-all.cmd script first
        try {
          const scriptPath = path.join(process.cwd(), 'backups', 'database', 'update-all.cmd');
          console.log('[Update] Running script:', scriptPath);
          
          const { stdout } = await execAsync(`"${scriptPath}"`, { 
            cwd: process.cwd(),
            timeout: 180000 
          });
          
          await logAdminActivity({
            action: 'update',
            entity: 'system',
            userId: user.userId,
            userEmail: user.email,
            description: 'עדכון מערכת באמצעות update-all.cmd',
            metadata: { type: 'script', output: (stdout || '').substring(0, 500) }
          });

          return NextResponse.json({ 
            success: true, 
            message: 'עדכון מערכת הושלם באמצעות update-all.cmd!',
            details: stdout,
            info: 'הסקריפט ביצע: גיבוי, תיוג גרסה, ופתיחת Vercel',
            scriptUsed: 'update-all.cmd'
          });
        } catch (scriptError) {
          console.log('[Update] Script failed, trying git pull:', scriptError.message);
          
          // Fallback to git pull
          try {
            const cwd = process.cwd();
            const { stdout: pullOutput } = await execAsync('git pull origin main', { cwd });
            
            let updateResult = pullOutput || '';
            let hasChanges = !updateResult.includes('Already up to date');
            
            await logAdminActivity({
              action: 'update',
              entity: 'system',
              userId: user.userId,
              userEmail: user.email,
              description: hasChanges ? 'עדכון מערכת - נמשכו שינויים' : 'עדכון מערכת - אין שינויים',
              metadata: { type: 'git_pull', hasChanges }
            });

            if (hasChanges) {
              try {
                await execAsync('npm install', { cwd, timeout: 120000 });
              } catch (npmErr) {
                console.log('[Update] npm install warning:', npmErr.message);
              }
            }
            
            return NextResponse.json({ 
              success: true, 
              message: hasChanges ? 'עדכון מערכת הושלם! נמשכו שינויים.' : 'המערכת מעודכנת!',
              details: updateResult,
              hasChanges
            });
          } catch (gitError) {
            return NextResponse.json({ 
              success: false, 
              error: 'שגיאה בעדכון המערכת',
              details: gitError.message,
              commands: ['git pull origin main', 'npm install']
            }, { status: 500 });
          }
        }
      } else {
        // In Vercel serverless, provide instructions
        return NextResponse.json({ 
          success: true, 
          message: 'בסביבת Vercel, העדכון מתבצע אוטומטית עם git push.',
          commands: [
            'git pull origin main',
            'git add .',
            'git commit -m "Update"',
            'git push origin main'
          ],
          info: 'לאחר ה-push, Vercel יעדכן את האתר אוטומטית.'
        });
      }
    }

    if (action === 'server') {
      // Local server - not applicable in Vercel
      return NextResponse.json({ 
        success: true, 
        message: 'להפעלה מחדש של השרת (יסגור שרת קיים ויפתח חדש):',
        commands: [
          'backups\\database\\restart-server.cmd'
        ],
        info: 'הסקריפט יבדוק אם יש שרת פעיל על פורט 3001, יסגור אותו ויפעיל שרת חדש.\n\nאו ידנית:\n1. netstat -aon | findstr :3001\n2. taskkill /PID <מספר> /F\n3. npm run dev'
      });
    }

    if (action === 'restore') {
      // Restore from uploaded backup JSON
      const { backupData } = body;
      
      if (!backupData || !backupData.collections) {
        return NextResponse.json({ 
          error: 'קובץ גיבוי לא תקין. חסר מידע על collections.' 
        }, { status: 400 });
      }

      const { getDb } = await import('@/lib/db');
      const db = await getDb();
      
      const restoredCollections = [];
      const errors = [];
      
      for (const [collectionName, collectionData] of Object.entries(backupData.collections)) {
        try {
          const collection = db.collection(collectionName);
          
          // Delete existing data
          await collection.deleteMany({});
          
          // Insert backup data
          if (collectionData.data && collectionData.data.length > 0) {
            // Convert string dates back to Date objects and handle ObjectIds
            const docs = collectionData.data.map(doc => {
              const processedDoc = { ...doc };
              // Handle _id if it's an object with $oid
              if (processedDoc._id && typeof processedDoc._id === 'object' && processedDoc._id.$oid) {
                const { ObjectId } = require('mongodb');
                processedDoc._id = new ObjectId(processedDoc._id.$oid);
              }
              return processedDoc;
            });
            
            await collection.insertMany(docs);
          }
          
          restoredCollections.push({
            name: collectionName,
            count: collectionData.data?.length || 0
          });
        } catch (err) {
          console.error(`Error restoring ${collectionName}:`, err);
          errors.push({ collection: collectionName, error: err.message });
        }
      }
      
      // Log restore action
      await logAdminActivity({
        action: 'restore',
        entity: 'system',
        userId: user.userId,
        userEmail: user.email,
        description: 'שחזור מסד נתונים מגיבוי',
        metadata: { 
          type: 'database',
          backupTimestamp: backupData.timestamp,
          collectionsRestored: restoredCollections.length,
          errors: errors.length
        }
      });

      if (errors.length > 0) {
        return NextResponse.json({ 
          success: true,
          message: `שחזור הושלם עם ${errors.length} שגיאות`,
          restored: restoredCollections,
          errors
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: `שחזור הושלם בהצלחה! שוחזרו ${restoredCollections.length} קולקציות.`,
        restored: restoredCollections
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
