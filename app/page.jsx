import { getDb } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const db = await getDb();
    const products = await db
      .collection("products")
      .find({ active: true })
      .project({ title: 1, slug: 1, price: 1, isGroupBuy: 1, image: 1 })
      .toArray();

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              ברוכים הבאים ל-VIPO
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              מערכת מתקדמת לניהול סוכנים, מוצרים ורכישות קבוצתיות
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                הצטרף עכשיו
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl border-2 border-blue-600"
              >
                התחבר
              </Link>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              המוצרים שלנו
            </h2>
            
            {products.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <article
                    key={p.slug}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-6xl">
                        {p.isGroupBuy ? "🛒" : "📦"}
                      </span>
                    </div>

                    {/* Product Info */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {p.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {p.isGroupBuy && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                          רכישה קבוצתית
                        </span>
                      )}
                      <span className="text-2xl font-bold text-blue-600">
                        ₪{p.price.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={`/p/${p.slug}`}
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all text-center"
                    >
                      צפה במוצר
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  אין מוצרים זמינים כרגע
                </h3>
                <p className="text-gray-600 mb-6">
                  המוצרים שלנו בדרך! חזור בקרוב לעדכונים.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  התחבר למערכת
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              למה VIPO?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center p-6">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  מערכת סוכנים
                </h3>
                <p className="text-gray-600">
                  נהל סוכנים, עמלות והפניות בקלות
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  רכישה קבוצתית
                </h3>
                <p className="text-gray-600">
                  חסוך כסף עם רכישות קבוצתיות חכמות
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  דוחות מתקדמים
                </h3>
                <p className="text-gray-600">
                  עקוב אחר ביצועים בזמן אמת
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("HomePage error:", error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ברוכים הבאים למערכת VIPO
          </h2>
          <p className="text-gray-600 mb-8">
            מערכת מתקדמת לניהול סוכנים, מוצרים ורכישות קבוצתיות
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg"
            >
              התחברות
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-3 rounded-xl transition-all shadow-lg border-2 border-blue-600"
            >
              הרשמה
            </Link>
          </div>
        </div>
      </main>
    );
  }
}
