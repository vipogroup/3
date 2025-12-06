import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { requireAdminApi } from '@/lib/auth/server';
import { rateLimiters, buildRateLimitKey } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  try {
    const admin = await requireAdminApi(req);
    const identifier = buildRateLimitKey(req, admin.id);
    const rateLimit = rateLimiters.adminProductUploads(req, identifier);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Too many uploads' }, { status: 429 });
    }

    const form = await req.formData();
    const file = form.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'unsupported_file_type', allowed: ALLOWED_MIME_TYPES },
        { status: 415 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: 'file_too_large',
          maxBytes: MAX_FILE_SIZE_BYTES,
          receivedBytes: file.size,
        },
        { status: 413 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = (file.name || 'upload.bin').replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, bytes);

    const url = `/uploads/products/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error('upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
