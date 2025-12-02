import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { verify } from '@/lib/auth/createToken';
import { getAuthToken } from '@/lib/auth/requireAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // Verify admin role
    const token = getAuthToken(req);
    const user = verify(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required' }, { status: 403 });
    }
    const form = await req.formData();
    const file = form.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
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
