import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find().lean();
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}
