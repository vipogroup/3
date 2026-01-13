import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { DEFAULT_SETTINGS, withDefaultSettings } from '@/lib/settingsDefaults';
import { getTenantByHost, isSuperAdmin } from '@/lib/tenant';
import { ObjectId } from 'mongodb';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_KEY = 'siteSettings';
const TENANT_SETTINGS_KEY_PREFIX = 'tenantSettings_';

function extractToken(req) {
  try {
    const tokenFromCookies =
      req.cookies?.get?.('auth_token')?.value || req.cookies?.get?.('token')?.value;
    if (tokenFromCookies) return tokenFromCookies;
  } catch (error) {
    // ignore cookies API issues
  }

  try {
    const cookieHeader = req.headers?.get?.('cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)(auth_token|token)=([^;]+)/i);
    if (match) {
      return decodeURIComponent(match[2]);
    }
  } catch (error) {
    // ignore header parsing errors
  }

  try {
    const authHeader = req.headers?.get?.('authorization') || '';
    if (authHeader?.toLowerCase?.().startsWith('bearer ')) {
      return authHeader.slice(7).trim();
    }
  } catch (error) {
    // ignore header parsing errors
  }

  return null;
}

function sanitizeForClient(settings) {
  const sanitized = { ...settings };
  sanitized.smtpPassword = '';
  return sanitized;
}

function normalizeSettings(input = {}) {
  const allowedKeys = Object.keys(DEFAULT_SETTINGS);
  const normalized = {};

  for (const key of allowedKeys) {
    const defaultValue = DEFAULT_SETTINGS[key];
    const incoming = input[key];

    if (incoming === undefined || incoming === null) {
      normalized[key] = defaultValue;
      continue;
    }

    if (typeof defaultValue === 'boolean') {
      if (typeof incoming === 'string') {
        normalized[key] = incoming === 'true' || incoming === '1';
      } else {
        normalized[key] = Boolean(incoming);
      }
      continue;
    }

    normalized[key] = typeof incoming === 'string' ? incoming : String(incoming);
  }

  return withDefaultSettings(normalized);
}

async function GETHandler(req) {
  try {
    const db = await getDb();
    const collection = db.collection(SETTINGS_COLLECTION);
    
    // Check for tenant-specific settings
    const host = req.headers.get('host');
    const tenant = await getTenantByHost(host);
    
    let settings;
    let updatedAt = null;
    
    if (tenant) {
      // Load tenant-specific settings from Tenant model
      const tenantDoc = await db.collection('tenants').findOne({ _id: tenant._id });
      if (tenantDoc) {
        // Check if tenant uses global branding (default is true)
        const useGlobalBranding = tenantDoc.branding?.useGlobalBranding !== false;
        
        // Merge tenant branding/settings with defaults
        // If useGlobalBranding is true, use DEFAULT colors instead of tenant-specific
        settings = withDefaultSettings({
          siteName: tenantDoc.name || DEFAULT_SETTINGS.siteName,
          siteDescription: tenantDoc.seo?.description || DEFAULT_SETTINGS.siteDescription,
          siteLogo: tenantDoc.branding?.logo || DEFAULT_SETTINGS.siteLogo,
          siteFavicon: tenantDoc.branding?.favicon || DEFAULT_SETTINGS.siteFavicon,
          primaryColor: useGlobalBranding ? DEFAULT_SETTINGS.primaryColor : (tenantDoc.branding?.primaryColor || DEFAULT_SETTINGS.primaryColor),
          secondaryColor: useGlobalBranding ? DEFAULT_SETTINGS.secondaryColor : (tenantDoc.branding?.secondaryColor || DEFAULT_SETTINGS.secondaryColor),
          accentColor: useGlobalBranding ? DEFAULT_SETTINGS.accentColor : (tenantDoc.branding?.accentColor || DEFAULT_SETTINGS.accentColor),
          successColor: useGlobalBranding ? DEFAULT_SETTINGS.successColor : (tenantDoc.branding?.successColor || DEFAULT_SETTINGS.successColor),
          warningColor: useGlobalBranding ? DEFAULT_SETTINGS.warningColor : (tenantDoc.branding?.warningColor || DEFAULT_SETTINGS.warningColor),
          dangerColor: useGlobalBranding ? DEFAULT_SETTINGS.dangerColor : (tenantDoc.branding?.dangerColor || DEFAULT_SETTINGS.dangerColor),
          backgroundColor: useGlobalBranding ? DEFAULT_SETTINGS.backgroundColor : (tenantDoc.branding?.backgroundColor || DEFAULT_SETTINGS.backgroundColor),
          textColor: useGlobalBranding ? DEFAULT_SETTINGS.textColor : (tenantDoc.branding?.textColor || DEFAULT_SETTINGS.textColor),
          backgroundGradient: useGlobalBranding ? '' : (tenantDoc.branding?.backgroundGradient || ''),
          cardGradient: useGlobalBranding ? '' : (tenantDoc.branding?.cardGradient || ''),
          buttonGradient: useGlobalBranding ? '' : (tenantDoc.branding?.buttonGradient || ''),
          contactEmail: tenantDoc.contact?.email || DEFAULT_SETTINGS.contactEmail,
          contactPhone: tenantDoc.contact?.phone || DEFAULT_SETTINGS.contactPhone,
          whatsappNumber: tenantDoc.contact?.whatsapp || DEFAULT_SETTINGS.whatsappNumber,
          address: tenantDoc.contact?.address || DEFAULT_SETTINGS.address,
          facebookUrl: tenantDoc.social?.facebook || DEFAULT_SETTINGS.facebookUrl,
          instagramUrl: tenantDoc.social?.instagram || DEFAULT_SETTINGS.instagramUrl,
          twitterUrl: tenantDoc.social?.twitter || DEFAULT_SETTINGS.twitterUrl,
          linkedinUrl: tenantDoc.social?.linkedin || DEFAULT_SETTINGS.linkedinUrl,
          enableRegistration: tenantDoc.features?.registration ?? DEFAULT_SETTINGS.enableRegistration,
          enableGroupPurchase: tenantDoc.features?.groupPurchase ?? DEFAULT_SETTINGS.enableGroupPurchase,
          enableNotifications: tenantDoc.features?.notifications ?? DEFAULT_SETTINGS.enableNotifications,
          enableDarkMode: tenantDoc.features?.darkMode ?? DEFAULT_SETTINGS.enableDarkMode,
          metaTitle: tenantDoc.seo?.title || DEFAULT_SETTINGS.metaTitle,
          metaDescription: tenantDoc.seo?.description || DEFAULT_SETTINGS.metaDescription,
          metaKeywords: tenantDoc.seo?.keywords || DEFAULT_SETTINGS.metaKeywords,
          googleAnalyticsId: tenantDoc.seo?.googleAnalyticsId || DEFAULT_SETTINGS.googleAnalyticsId,
        });
        updatedAt = tenantDoc.updatedAt || null;
      }
    }
    
    // Fallback to global settings if no tenant or tenant settings not found
    if (!settings) {
      const doc = await collection.findOne({ key: SETTINGS_KEY });
      settings = withDefaultSettings(doc?.value || {});
      updatedAt = doc?.updatedAt || null;
    }

    return NextResponse.json({
      ok: true,
      settings: sanitizeForClient(settings),
      updatedAt,
      tenantId: tenant?._id || null,
    });
  } catch (error) {
    console.error('SETTINGS_GET_ERROR', error);
    return NextResponse.json({ ok: false, error: 'settings_fetch_failed' }, { status: 500 });
  }
}

async function POSTHandler(req) {
  try {
    const token = extractToken(req);
    const payload = verifyJWT(token);

    // Check if user is admin (any type)
    const userRole = payload?.role || payload?.userRole;
    if (!payload || !['admin', 'business_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    }

    const incoming = typeof body?.settings === 'object' ? body.settings : body;
    if (!incoming || Array.isArray(incoming) || typeof incoming !== 'object') {
      return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();
    
    // Check if user has tenantId (business admin)
    const tenantId = payload.tenantId;
    
    // בדיקת סיסמת עיצוב - רק למנהל ראשי (לא business_admin)
    const isSuperAdmin = userRole === 'admin' && !tenantId;
    if (isSuperAdmin) {
      // בדיקה אם יש שינויים בעיצוב
      const hasDesignChanges = 
        incoming.primaryColor || incoming.secondaryColor || incoming.accentColor ||
        incoming.successColor || incoming.warningColor || incoming.dangerColor ||
        incoming.backgroundColor || incoming.textColor ||
        incoming.backgroundGradient || incoming.cardGradient || incoming.buttonGradient;
      
      if (hasDesignChanges) {
        const DESIGN_PASSWORD = '1985';
        const designPassword = body?.designPassword;
        
        if (designPassword !== DESIGN_PASSWORD) {
          return NextResponse.json(
            { ok: false, error: 'סיסמת עיצוב שגויה. שינויים בעיצוב דורשים אישור.' },
            { status: 403 }
          );
        }
      }
    }
    
    // SECURITY: business_admin MUST have tenantId - prevent them from editing global settings
    if (userRole === 'business_admin' && !tenantId) {
      console.warn('SECURITY: business_admin without tenantId tried to update settings');
      return NextResponse.json({ ok: false, error: 'missing_tenant_id' }, { status: 403 });
    }
    
    if (tenantId) {
      // Business admin - update tenant settings
      const updateData = {
        updatedAt: now,
      };
      
      // Map settings to tenant schema
      if (incoming.siteName) updateData.name = incoming.siteName;
      
      // Branding - include all color and gradient fields
      const hasBranding = incoming.siteLogo || incoming.siteFavicon || 
        incoming.primaryColor || incoming.secondaryColor || incoming.accentColor ||
        incoming.successColor || incoming.warningColor || incoming.dangerColor ||
        incoming.backgroundColor || incoming.textColor ||
        incoming.backgroundGradient || incoming.cardGradient || incoming.buttonGradient;
      
      if (hasBranding) {
        updateData.branding = {
          logo: incoming.siteLogo,
          favicon: incoming.siteFavicon,
          primaryColor: incoming.primaryColor,
          secondaryColor: incoming.secondaryColor,
          accentColor: incoming.accentColor,
          successColor: incoming.successColor,
          warningColor: incoming.warningColor,
          dangerColor: incoming.dangerColor,
          backgroundColor: incoming.backgroundColor,
          textColor: incoming.textColor,
          backgroundGradient: incoming.backgroundGradient,
          cardGradient: incoming.cardGradient,
          buttonGradient: incoming.buttonGradient,
        };
      }
      if (incoming.contactEmail || incoming.contactPhone || incoming.whatsappNumber || incoming.address) {
        updateData.contact = {
          email: incoming.contactEmail,
          phone: incoming.contactPhone,
          whatsapp: incoming.whatsappNumber,
          address: incoming.address,
        };
      }
      if (incoming.facebookUrl || incoming.instagramUrl || incoming.twitterUrl || incoming.linkedinUrl) {
        updateData.social = {
          facebook: incoming.facebookUrl,
          instagram: incoming.instagramUrl,
          twitter: incoming.twitterUrl,
          linkedin: incoming.linkedinUrl,
        };
      }
      if (incoming.metaTitle || incoming.metaDescription || incoming.metaKeywords || incoming.googleAnalyticsId) {
        updateData.seo = {
          title: incoming.metaTitle,
          description: incoming.metaDescription,
          keywords: incoming.metaKeywords,
          googleAnalyticsId: incoming.googleAnalyticsId,
        };
      }
      if (incoming.enableRegistration !== undefined || incoming.enableGroupPurchase !== undefined || 
          incoming.enableNotifications !== undefined || incoming.enableDarkMode !== undefined) {
        updateData.features = {
          registration: incoming.enableRegistration,
          groupPurchase: incoming.enableGroupPurchase,
          notifications: incoming.enableNotifications,
          darkMode: incoming.enableDarkMode,
        };
      }
      
      await db.collection('tenants').updateOne(
        { _id: new ObjectId(tenantId) },
        { $set: updateData }
      );
      
      const normalized = normalizeSettings(incoming);
      return NextResponse.json({
        ok: true,
        settings: sanitizeForClient(normalized),
        updatedAt: now,
        tenantId,
      });
    }
    
    // Super admin - update global settings
    const normalized = normalizeSettings(incoming);
    const collection = db.collection(SETTINGS_COLLECTION);

    await collection.updateOne(
      { key: SETTINGS_KEY },
      {
        $set: {
          key: SETTINGS_KEY,
          value: normalized,
          updatedAt: now,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      ok: true,
      settings: sanitizeForClient(normalized),
      updatedAt: now,
    });
  } catch (error) {
    console.error('SETTINGS_POST_ERROR', error);
    return NextResponse.json({ ok: false, error: 'settings_save_failed' }, { status: 500 });
  }
}

export const GET = withErrorLogging(GETHandler);
export const POST = withErrorLogging(POSTHandler);
