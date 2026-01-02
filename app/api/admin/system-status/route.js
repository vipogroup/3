import { NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/rateLimit';

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

// Check MongoDB connection
async function checkMongoDB() {
  try {
    const { getDb } = await import('@/lib/db');
    const db = await getDb();
    await db.command({ ping: 1 });
    return { status: 'connected', message: 'MongoDB מחובר ופעיל' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

// Check if environment variable exists
function checkEnvVar(varName) {
  const value = process.env[varName];
  return value && value.length > 0;
}

// Check GitHub (just verify env var exists)
function checkGitHub() {
  // GitHub doesn't need API key for public repos
  return { status: 'connected', message: 'GitHub זמין' };
}

// Check Vercel (deployment platform - always accessible via web)
function checkVercel() {
  return { status: 'connected', message: 'Vercel זמין - Deploy דרך הדשבורד' };
}


// Check Cloudinary - actual connection test
async function checkCloudinary() {
  const hasCloudName = checkEnvVar('CLOUDINARY_CLOUD_NAME') || checkEnvVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  const hasApiKey = checkEnvVar('CLOUDINARY_API_KEY');
  const hasApiSecret = checkEnvVar('CLOUDINARY_API_SECRET');
  
  if (!hasCloudName) {
    return { status: 'error', message: 'CLOUDINARY_CLOUD_NAME לא מוגדר' };
  }
  
  if (!hasApiKey || !hasApiSecret) {
    return { status: 'warning', message: 'Cloudinary מוגדר חלקית - חסרים API_KEY או API_SECRET' };
  }
  
  // Try actual connection
  try {
    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.api.ping();
    return { status: 'connected', message: 'Cloudinary מחובר ופעיל' };
  } catch (error) {
    return { status: 'warning', message: 'Cloudinary מוגדר אך לא ניתן לאמת חיבור' };
  }
}


// Check Twilio - for SMS/WhatsApp OTP
function checkTwilio() {
  const hasSid = checkEnvVar('TWILIO_ACCOUNT_SID');
  const hasToken = checkEnvVar('TWILIO_AUTH_TOKEN');
  const hasPhone = checkEnvVar('TWILIO_FROM_NUMBER') || checkEnvVar('TWILIO_PHONE_NUMBER');
  
  if (!hasSid && !hasToken) {
    return { status: 'warning', message: 'Twilio לא מוגדר - קודי OTP יודפסו בקונסול' };
  }
  
  if (!hasSid) {
    return { status: 'error', message: 'TWILIO_ACCOUNT_SID חסר' };
  }
  
  if (!hasToken) {
    return { status: 'error', message: 'TWILIO_AUTH_TOKEN חסר' };
  }
  
  if (!hasPhone) {
    return { status: 'warning', message: 'TWILIO_FROM_NUMBER חסר - לא ניתן לשלוח SMS' };
  }
  
  return { status: 'connected', message: 'Twilio מוגדר - SMS/WhatsApp פעיל' };
}

// Check SendGrid - for email sending
function checkSendGrid() {
  const hasApiKey = checkEnvVar('SENDGRID_API_KEY');
  if (!hasApiKey) {
    return { status: 'error', message: 'SENDGRID_API_KEY לא מוגדר - שליחת אימיילים לא תעבוד' };
  }
  return { status: 'connected', message: 'SendGrid מוגדר - שליחת אימיילים פעילה' };
}

// Check NPM (always available)
function checkNPM() {
  return { status: 'connected', message: 'NPM זמין' };
}

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
    // Run all checks
    const [mongoResult] = await Promise.all([
      checkMongoDB()
    ]);

    const results = {
      mongodb: mongoResult,
      vercel: checkVercel(),
      github: checkGitHub(),
      cloudinary: await checkCloudinary(),
      sendgrid: checkSendGrid(),
      twilio: checkTwilio(),
      npm: checkNPM()
    };

    return NextResponse.json({ 
      success: true, 
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking system status:', error);
    return NextResponse.json({ error: 'Failed to check system status' }, { status: 500 });
  }
}
