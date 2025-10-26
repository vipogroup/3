
import { getDb } from "@/lib/db";

export async function GET(){
  const db = await getDb();
  const theme = await db.collection("themes").findOne({ active: true }) || { vars:{} };
  const vars = Object.entries(theme.vars || {}).map(([k,v]) => `${k}: ${v};`).join("\n");
  const css = `:root{${vars}}`;
  return new Response(css, { headers: { "Content-Type": "text/css" } });
}
