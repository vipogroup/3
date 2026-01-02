import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

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

// GET - List backups
export async function GET(req) {
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
      // Run the backup script using npm script
      const { stdout, stderr } = await execAsync('npm run backup:db', {
        cwd: process.cwd(),
        timeout: 60000 // 1 minute timeout
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'גיבוי הושלם בהצלחה',
        output: stdout 
      });
    }

    if (action === 'deploy') {
      // Run the deploy script
      const { stdout, stderr } = await execAsync('npx vercel --prod', {
        cwd: process.cwd(),
        timeout: 300000 // 5 minutes timeout for deploy
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Deploy ל-Vercel הושלם בהצלחה!',
        output: stdout 
      });
    }

    if (action === 'update') {
      // Run git pull and npm install
      const { stdout: gitOut } = await execAsync('git pull', {
        cwd: process.cwd(),
        timeout: 60000
      });
      const { stdout: npmOut } = await execAsync('npm install', {
        cwd: process.cwd(),
        timeout: 120000
      });
      
      return NextResponse.json({ 
        success: true, 
        message: 'עדכון המערכת הושלם בהצלחה!',
        output: gitOut + '\n' + npmOut 
      });
    }

    if (action === 'server') {
      // Kill existing node processes and start dev server
      try {
        // Try to kill existing processes on port 3001
        await execAsync('npx kill-port 3001', {
          cwd: process.cwd(),
          timeout: 10000
        }).catch(() => {}); // Ignore errors if no process to kill
      } catch {
        // Ignore errors
      }
      
      // Start the dev server in background (detached)
      const { spawn } = require('child_process');
      const child = spawn('npm', ['run', 'dev'], {
        cwd: process.cwd(),
        detached: true,
        stdio: 'ignore'
      });
      child.unref();
      
      return NextResponse.json({ 
        success: true, 
        message: 'השרת המקומי הופעל! http://localhost:3001'
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
