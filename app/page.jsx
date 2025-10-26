
import { getDb } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage(){
  const db = await getDb();
  const products = await db.collection("products").find({ active:true }).project({title:1, slug:1, price:1, isGroupBuy:1}).toArray();

  return (
    <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map(p => (
        <article key={p.slug} className="card">
          <h2 className="text-lg font-bold mb-2">{p.title}</h2>
          <p className="mb-4">{p.isGroupBuy ? "יבוא קבוצתי" : "מוצר רגיל"} · ₪{p.price}</p>
          <Link className="btn" href={`/p/${p.slug}`}>לעמוד מוצר</Link>
        </article>
      ))}
      {products.length===0 && <p>אין מוצרים פעילים עדיין.</p>}
    </main>
  );
}
