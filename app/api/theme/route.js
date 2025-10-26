
import { getDb } from "@/lib/db";

export async function GET(){
  const db = await getDb();
  const theme = await db.collection("themes").findOne({ active: true }) || { vars:{} };
  return Response.json({ theme });
}

export async function POST(req){
  const db = await getDb();
  const body = await req.json();
  await db.collection("themes").updateOne(
    { active: true }, 
    { $set: { active:true, baseThemeName: body.baseThemeName || "custom", vars: body.vars||{}, componentOverrides: body.componentOverrides||{}, updatedAt: new Date() } },
    { upsert: true }
  );
  return Response.json({ ok:true });
}
