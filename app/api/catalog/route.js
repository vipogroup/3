export const dynamic = 'force-dynamic';

import { connectMongo } from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectMongo();

    const products = await Product.find({}).sort({ sortOrder: 1 }).lean();

    return new Response(JSON.stringify({ ok: true, products }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || 'catalog_fetch_failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
