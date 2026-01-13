import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { THEMES, getTheme } from '@/app/themes/themes';
import { requireAdminApi } from '@/lib/auth/server';

/**
 * GET /api/theme
 * Get current active theme
 */
async function GETHandler() {
  try {
    const db = await getDb();
    const settings = db.collection('settings');

    // Get active theme from DB
    const themeSetting = await settings.findOne({ key: 'activeTheme' });
    const themeId = themeSetting?.value || 'vipo';

    // Get theme definition
    const theme = getTheme(themeId);

    return NextResponse.json({
      ok: true,
      themeId,
      theme,
      availableThemes: Object.keys(THEMES),
    });
  } catch (error) {
    console.error('GET_THEME_ERROR:', error);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

/**
 * POST /api/theme
 * Set active theme
 * Body: { themeId: "amazon" | "aliexpress" | ..., designPassword?: string }
 */
async function POSTHandler(req) {
  try {
    // Admin only
    const user = await requireAdminApi(req);

    const body = await req.json();
    const { themeId, designPassword } = body;

    if (!themeId || !THEMES[themeId]) {
      return NextResponse.json({ ok: false, error: 'invalid theme ID' }, { status: 400 });
    }

    // בדיקת סיסמת עיצוב - רק למנהל ראשי (לא business_admin)
    const isSuperAdmin = user.role === 'admin' && !user.tenantId;
    if (isSuperAdmin) {
      const DESIGN_PASSWORD = '1985';
      if (designPassword !== DESIGN_PASSWORD) {
        return NextResponse.json(
          { ok: false, error: 'סיסמת עיצוב שגויה. שינויים בעיצוב דורשים אישור.' },
          { status: 403 }
        );
      }
    }

    const db = await getDb();
    const settings = db.collection('settings');

    // Save theme selection
    await settings.updateOne(
      { key: 'activeTheme' },
      {
        $set: {
          key: 'activeTheme',
          value: themeId,
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    const theme = getTheme(themeId);

    return NextResponse.json({
      ok: true,
      message: 'Theme updated successfully',
      themeId,
      theme,
    });
  } catch (error) {
    console.error('SET_THEME_ERROR:', error);
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const POST = withErrorLogging(POSTHandler);
