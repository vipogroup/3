export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

// Allow larger body size for video uploads (Vercel limit: 4.5MB free, 50MB Pro)
export const maxDuration = 60; // 60 seconds timeout

import { NextResponse } from 'next/server';
import { getCloudinary } from '@/lib/cloudinary';

function uploadBufferToCloudinary(buffer, options = {}) {
  const cloudinary = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'vipo-products', ...options },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    // Validate file exists
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Unsupported media type. Use PNG, JPEG, WebP for images or MP4, MOV, AVI for videos' },
        { status: 415 },
      );
    }

    // Validate file size (4MB max due to Vercel limit)
    const maxSize = 4 * 1024 * 1024; // 4MB (Vercel limit is 4.5MB, we use 4MB to be safe)
    if (typeof file.size === 'number' && file.size > maxSize) {
      return NextResponse.json(
        { error: `הקובץ גדול מדי. מקסימום 4MB (מגבלת Vercel)` },
        { status: 413 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadOptions = {
      overwrite: true,
      resource_type: isVideo ? 'video' : 'image',
    };

    // Add quality optimization for images
    if (isImage) {
      uploadOptions.quality = 'auto:good';
      uploadOptions.fetch_format = 'auto';
    }

    const result = await uploadBufferToCloudinary(buffer, uploadOptions);

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
