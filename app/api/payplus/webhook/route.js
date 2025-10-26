
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req){
  const body = await req.json();
  const db = await getDb();
  // TODO: verify signature from PayPlus
  const orderId = body.orderId;
  const ok = body.status === "paid";
  if (ok){
    await db.collection("orders").updateOne({ _id: new ObjectId(orderId) }, { $set: { status:"paid", payplus: { transactionId: body.txId || null, raw: body } } });
    // TODO: compute and credit commission
  }
  return Response.json({ ok:true });
}
