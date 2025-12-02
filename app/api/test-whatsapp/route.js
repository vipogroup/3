import { NextResponse } from 'next/server';
import { sendWhatsAppMessage } from '@/lib/notifications/sendWhatsApp';

export async function GET() {
  const result = await sendWhatsAppMessage('972501234567', 'בדיקת DRY_RUN');
  return NextResponse.json(result);
}
