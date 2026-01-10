import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const WHATSAPP_SERVER_URL = process.env.WHATSAPP_LOCAL_URL || 'http://localhost:3002';

export async function GET(request) {
  try {
    // Check local server status
    const response = await fetch(`${WHATSAPP_SERVER_URL}/status`, {
      cache: 'no-store',
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      ready: false, 
      error: 'WhatsApp server not running',
      serverUrl: WHATSAPP_SERVER_URL,
    });
  }
}
