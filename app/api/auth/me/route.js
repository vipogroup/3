export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/auth/server';

export async function GET(req) {
  try {
    const user = await requireAuthApi(req);
    
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      user: {
        _id: user._id || user.id,
        email: user.email,
        fullName: user.fullName || user.email,
        phone: user.phone,
        role: user.role || 'customer',
        name: user.fullName || user.email,
        showPushButtons: user.showPushButtons !== false,
      },
    });
  } catch (e) {
    const status = e.status || 401;
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status });
  }
}
