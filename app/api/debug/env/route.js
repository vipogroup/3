// app/api/debug/env/route.js
// Debug endpoint to check environment variables
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    hasMongoDb: Boolean(process.env.MONGODB_DB),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    mongoDbName: process.env.MONGODB_DB,
    mongoUriPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 30) + '...' : 
      'NOT SET',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
