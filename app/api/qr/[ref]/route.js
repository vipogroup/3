import QRCode from 'qrcode';
import { getDb } from '@/lib/db';
import sharp from 'sharp';

export async function GET(request, { params }) {
  try {
    const urlObj = new URL(request.url);
    const fmt = urlObj.searchParams.get('fmt') || 'svg';
    const size = Math.min(
      Math.max(parseInt(urlObj.searchParams.get('size') || '340', 10), 128),
      1024,
    );
    const withLogo = urlObj.searchParams.get('logo') === '1';
    const ref = params.ref;

    const db = await getDb();
    const link = await db.collection('referralLinks').findOne({ code: ref });
    if (!link) return Response.json({ error: 'ref_not_found' }, { status: 404 });
    const url = link.url;

    if (fmt === 'svg' && !withLogo) {
      const svg = await QRCode.toString(url, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
    }
    const buf = await QRCode.toBuffer(url, {
      type: 'png',
      width: size,
      margin: 1,
      errorCorrectionLevel: withLogo ? 'H' : 'M',
      color: { dark: '#000000', light: '#ffffff' },
    });
    // For demo we skip compositing a logo (requires file); return PNG
    return new Response(buf, { headers: { 'Content-Type': 'image/png' } });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'qr_failed' }, { status: 500 });
  }
}
