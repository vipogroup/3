export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { requireAdminApi } from '@/lib/auth/server';
import { updateMarketingAsset, deleteMarketingAsset } from '@/lib/marketing';
import { getDb } from '@/lib/db';

function validateUpdatePayload(payload) {
  const errors = {};

  if (payload.title !== undefined && !payload.title.trim()) {
    errors.title = 'נדרש שם נכס';
  }

  if (payload.type !== undefined && !['video', 'image'].includes(payload.type)) {
    errors.type = 'סוג לא תקין';
  }

  if (payload.mediaUrl !== undefined && !payload.mediaUrl.trim()) {
    errors.mediaUrl = 'נדרש קישור למדיה';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export async function PATCH(req, { params }) {
  try {
    await requireAdminApi(req);

    const payload = await req.json().catch(() => ({}));
    const { valid, errors } = validateUpdatePayload(payload);
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'validation_error', details: errors }, { status: 400 });
    }

    const updated = await updateMarketingAsset(params.id, {
      ...payload,
      title: payload.title?.trim(),
      mediaUrl: payload.mediaUrl?.trim(),
      thumbnailUrl: payload.thumbnailUrl?.trim(),
    });

    if (!updated) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      asset: {
        id: updated._id?.toString() ?? null,
        title: updated.title ?? '',
        type: updated.type ?? 'video',
        mediaUrl: updated.mediaUrl ?? '',
        thumbnailUrl: updated.thumbnailUrl ?? null,
        messageTemplate: updated.messageTemplate ?? '',
        target: updated.target ?? { type: 'products' },
        isActive: updated.isActive !== false,
        updatedAt: updated.updatedAt ?? null,
        tags: updated.tags ?? [],
      },
    });
  } catch (error) {
    console.error('ADMIN_MARKETING_ASSET_UPDATE_ERROR', error);
    const status = error?.status ?? 500;
    const message =
      status === 401
        ? 'unauthorized'
        : status === 403
          ? 'forbidden'
          : 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdminApi(req);

    const deleted = await deleteMarketingAsset(params.id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('ADMIN_MARKETING_ASSET_DELETE_ERROR', error);
    const status = error?.status ?? 500;
    const message =
      status === 401
        ? 'unauthorized'
        : status === 403
          ? 'forbidden'
          : 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function GET(req, { params }) {
  try {
    await requireAdminApi(req);

    const db = await getDb();
    const asset = await db.collection('marketing_assets').findOne({ _id: new ObjectId(params.id) });

    if (!asset) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      asset: {
        id: asset._id?.toString() ?? null,
        title: asset.title ?? '',
        type: asset.type ?? 'video',
        mediaUrl: asset.mediaUrl ?? '',
        thumbnailUrl: asset.thumbnailUrl ?? null,
        messageTemplate: asset.messageTemplate ?? '',
        target: asset.target ?? { type: 'products' },
        isActive: asset.isActive !== false,
        createdAt: asset.createdAt ?? null,
        updatedAt: asset.updatedAt ?? null,
        tags: asset.tags ?? [],
      },
    });
  } catch (error) {
    console.error('ADMIN_MARKETING_ASSET_GET_ERROR', error);
    const status = error?.status ?? 500;
    const message =
      status === 401
        ? 'unauthorized'
        : status === 403
          ? 'forbidden'
          : 'server_error';
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
