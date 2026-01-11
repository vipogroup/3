import { withErrorLogging } from '@/lib/errorTracking/errorLogger';
export const dynamic = 'force-dynamic';

import { getDb } from '@/lib/db';

async function POSTHandler(req) {
  const body = await req.json();
  const { ref, productId, utm, ua, ip } = body || {};
  const db = await getDb();

  const link = ref ? await db.collection('referralLinks').findOne({ code: ref }) : null;
  const agentId = link?.agentId || null;
  const doc = {
    refCode: ref || null,
    productId,
    agentId,
    utm: utm || {},
    ua: ua || null,
    ip: ip || null,
    ts: new Date(),
  };
  await db.collection('visits').insertOne(doc);
  return Response.json({ ok: true });
}

export const POST = withErrorLogging(POSTHandler);
