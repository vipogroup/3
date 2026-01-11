import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongoose';
import SiteText from '@/models/SiteText';

// GET - Fetch ALL texts from database
async function GETHandler() {
  try {
    await connectMongo();
    
    const texts = await SiteText.find({}).sort({ page: 1, section: 1, order: 1 });
    
    return NextResponse.json({ success: true, texts });
  } catch (error) {
    console.error('Error fetching all site texts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
