
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req){
  const body = await req.json();
  const db = await getDb();
  const order = await db.collection("orders").findOne({ _id: new ObjectId(body.orderId) });
  if (!order) return Response.json({ error:"order_not_found" }, { status:404 });

  // TODO integrate PayPlus
  const fakeUrl = `/checkout/success?orderId=${body.orderId}`;
  return Response.json({ paymentUrl: fakeUrl });
}
