export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getWebPushConfig } from '@/lib/webPush';

function validateBase64(str) {
  if (!str) return { valid: false, error: 'empty_string' };
  
  // Remove whitespace and quotes
  const cleaned = str.trim().replace(/^['"]+|['"]+$/g, '').replace(/\s+/g, '');
  
  // Check valid Base64 characters
  const base64Regex = /^[A-Za-z0-9+/\-_]*={0,2}$/;
  if (!base64Regex.test(cleaned)) {
    return { valid: false, error: 'invalid_characters', cleaned };
  }
  
  // Try to decode
  try {
    if (typeof window !== 'undefined') {
      atob(cleaned.replace(/-/g, '+').replace(/_/g, '/'));
    } else {
      Buffer.from(cleaned, 'base64');
    }
    return { valid: true, cleaned, length: cleaned.length };
  } catch (error) {
    return { valid: false, error: 'decode_failed', cleaned, message: error.message };
  }
}

export async function GET(req) {
  // Require admin authentication in production
  if (process.env.NODE_ENV === 'production') {
    try {
      const { requireAdminApi } = await import('@/lib/auth/server');
      await requireAdminApi(req);
    } catch (error) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  const rawPublicKey = process.env.WEB_PUSH_PUBLIC_KEY || process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY || '';
  const rawPrivateKey = process.env.WEB_PUSH_PRIVATE_KEY || '';
  
  const config = getWebPushConfig();
  
  const publicValidation = validateBase64(rawPublicKey);
  const privateValidation = validateBase64(rawPrivateKey);
  
  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasPublicKey: Boolean(rawPublicKey),
      hasPrivateKey: Boolean(rawPrivateKey),
      rawPublicKeyLength: rawPublicKey?.length || 0,
      rawPrivateKeyLength: rawPrivateKey?.length || 0,
      publicKeyPreview: rawPublicKey ? `${rawPublicKey.substring(0, 10)}...${rawPublicKey.substring(rawPublicKey.length - 10)}` : null,
    },
    validation: {
      publicKey: publicValidation,
      privateKey: privateValidation,
    },
    config: {
      configured: config.configured,
      publicKeyLength: config.publicKey?.length || 0,
      contactEmail: config.contact,
      publicKeyPreview: config.publicKey ? `${config.publicKey.substring(0, 10)}...${config.publicKey.substring(config.publicKey.length - 10)}` : null,
    },
    recommendations: [
      !publicValidation.valid && 'Invalid public key - regenerate VAPID keys',
      !privateValidation.valid && 'Invalid private key - regenerate VAPID keys',
      !config.configured && 'Web push not configured - set environment variables',
    ].filter(Boolean),
  });
}
