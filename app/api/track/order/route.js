
import { getDb } from "@/lib/db";

export async function POST(req){
  const body = await req.json();
  const db = await getDb();

  const link = body.ref ? await db.collection("referralLinks").findOne({ code: body.ref }) : null;
  const agentId = link?.agentId || null;

  const order = {
    productId: body.productId,
    agentId, refCode: body.ref || null,
    amount: body.amount, currency: "ILS",
    status: "pending",
    customer: body.customer,
    source: { utm: body.utm || {}, platform: body.platform || null },
    ts: new Date()
  };
  const { insertedId } = await db.collection("orders").insertOne(order);

  return Response.json({ ok:true, orderId: String(insertedId) });
}
