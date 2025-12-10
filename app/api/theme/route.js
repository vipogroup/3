export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { THEMES, getTheme } from '@/app/themes/themes';

/**
 * GET /api/theme
 * Get current active theme
 */
export async function GET() {
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
 * Body: { themeId: "amazon" | "aliexpress" | ... }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { themeId } = body;

    if (!themeId || !THEMES[themeId]) {
      return NextResponse.json({ ok: false, error: 'invalid theme ID' }, { status: 400 });
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
