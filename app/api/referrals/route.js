export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  const body = await req.json();
  const { agentId, productId, baseUrl } = body;
  if (!agentId || !productId || !baseUrl)
    return Response.json({ error: 'bad_request' }, { status: 400 });
  const db = await getDb();

  const existing = await db.collection('referralLinks').findOne({ agentId, productId });
  if (existing) return Response.json(existing);

  const code = randomUUID().slice(0, 8);
  const product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
  const slug = product?.slug || productId;
  const url = `${baseUrl}/p/${slug}?ref=${code}`;

  const doc = { agentId, productId, code, url, utm: {}, createdAt: new Date() };
  await db.collection('referralLinks').insertOne(doc);
  return Response.json(doc);
}
