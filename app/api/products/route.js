import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection('products').find().toArray();
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
