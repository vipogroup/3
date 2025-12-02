import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔄 Resetting MongoDB connection...');

    // Clear the global connection
    if (global._mongoClientPromise) {
      console.log('🗑️ Clearing existing connection...');
      delete global._mongoClientPromise;
    }

    // Force Node.js to re-import the module
    console.log('♻️ Clearing module cache...');
    const dbPath = require.resolve('@/lib/db');
    delete require.cache[dbPath];

    console.log('✅ Connection reset complete!');
    console.log('🔄 Next API call will attempt fresh MongoDB connection');

    return NextResponse.json({
      success: true,
      message: '✅ Database connection reset successfully',
      note: 'Next API call will attempt fresh MongoDB connection',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Reset failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: '❌ Failed to reset connection',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
