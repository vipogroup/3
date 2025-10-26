
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage(){
  const db = await getDb();
  const agentsCount = await db.collection("users").countDocuments({ role: "agent" });
  const productsCount = await db.collection("products").countDocuments({});
  const ordersCount = await db.collection("orders").countDocuments({});

  return (
    <main className="grid gap-6">
      <section className="card">
        <h2 className="text-xl font-bold mb-2">סקירה</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="card"><b>סוכנים</b><div>{agentsCount}</div></div>
          <div className="card"><b>מוצרים</b><div>{productsCount}</div></div>
          <div className="card"><b>הזמנות</b><div>{ordersCount}</div></div>
        </div>
      </section>

      <section className="card">
        <h3 className="font-bold mb-2">עדכון קבוצה (שידור למצטרפים)</h3>
        <p>כאן יהיה מסך בחירה של מוצר קבוצתי → כתיבת הודעה → שליחה/תזמון לכולם.</p>
      </section>

      <section className="card">
        <h3 className="font-bold mb-2">Theme Studio</h3>
        <p>בחר תבנית, שנה צבעים, פרסם לכל המערכת.</p>
      </section>
    </main>
  );
}
