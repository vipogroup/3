import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/db';
import { verifyJwt } from '@/src/lib/auth/createToken.js';

async function ordersCollection() {
  const db = await getDb();
  const col = db.collection('orders');
  await col.createIndex({ agentId: 1 }).catch(() => {});
  await col.createIndex({ status: 1 }).catch(() => {});
  return col;
}

async function loadPdfKit() {
  try {
    const mod = await import('pdfkit');
    return mod.default || mod;
  } catch (e) {
    return null;
  }
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleString('he-IL');
  } catch {
    return new Date().toISOString();
  }
}

async function generateOrderPdfBuffer(order) {
  const PDFDocument = await loadPdfKit();
  if (!PDFDocument) throw new Error('pdfkit not installed');
  return await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const company = process.env.NEXT_PUBLIC_COMPANY_NAME || 'VIPO';
    const createdAt = order.createdAt || new Date();

    if (process.env.QUOTE_FONT_PATH) {
      try {
        doc.font(process.env.QUOTE_FONT_PATH);
      } catch {}
    }

    doc.fontSize(18).text(company, { align: 'right' });
    doc.moveDown(0.25);
    doc.fontSize(12).text(`תאריך: ${formatDate(new Date())}`, { align: 'right' });
    doc.fontSize(12).text(`מס' הזמנה: ${String(order._id)}`, { align: 'right' });

    doc.moveDown(1);
    doc.fontSize(14).text('פרטי לקוח', { align: 'right' });
    doc.fontSize(12).text(`${order?.customer?.fullName || ''}`, { align: 'right' });
    doc.fontSize(12).text(`${order?.customer?.phone || ''}`, { align: 'right' });

    doc.moveDown(1);
    doc.fontSize(14).text('שורות הזמנה', { align: 'right' });

    const items = Array.isArray(order.items) ? order.items : [];
    const startX = 60;
    const col = [startX, startX + 80, startX + 320, startX + 380, startX + 460];

    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text('SKU', col[0], doc.y);
    doc.text('Qty', col[1], doc.y);
    doc.text('Title', col[2], doc.y);
    doc.text('Price', col[3], doc.y);
    doc.text('Line', col[4], doc.y);
    doc.moveDown(0.3);
    doc.moveTo(startX, doc.y).lineTo(540, doc.y).stroke();

    items.forEach((it) => {
      const qty = Number(it?.qty || 0);
      const price = Number(it?.price || 0);
      const line = qty * price;
      const y = doc.y + 4;
      doc.text(String(it?.sku || ''), col[0], y);
      doc.text(String(qty), col[1], y);
      doc.text(String(it?.title || ''), col[2], y, { width: 240 });
      doc.text(String(price), col[3], y);
      doc.text(String(line), col[4], y);
      doc.moveDown(0.6);
    });

    doc.moveDown(1);
    const subtotal = Number(order?.subtotal || 0);
    const discount = Number(order?.discount || 0);
    const total = Number(order?.total || Math.max(0, subtotal - discount));

    doc.fontSize(12).text(`ביניים: ${subtotal} ₪`, { align: 'right' });
    doc.fontSize(12).text(`הנחה: ${discount} ₪`, { align: 'right' });
    doc.fontSize(14).text(`סה"כ: ${total} ₪`, { align: 'right' });

    doc.moveDown(1);
    doc.fontSize(10).text('הצעת מחיר הונפקה אוטומטית', { align: 'right' });

    doc.end();
  });
}

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value || '';
    const decoded = verifyJwt(token);
    if (!decoded?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params || {};
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const col = await ordersCollection();
    const order = await col.findOne({ _id: new ObjectId(id) });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isOwner = String(order.agentId) === String(decoded.userId);
    const isAdmin = decoded.role === 'admin';
    if (!(isOwner || isAdmin)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const buffer = await generateOrderPdfBuffer(order);
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="quote-${id}.pdf"`);
    return new NextResponse(buffer, { status: 200, headers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
