"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { useCartContext } from "@/app/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totals,
    isEmpty,
    incrementItem,
    decrementItem,
    setItemQuantity,
    removeItem,
    clearCart,
  } = useCartContext();

  const gradientStyle = useMemo(
    () => ({
      background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%)",
    }),
    []
  );

  const formatCurrency = (value) => `₪${value.toLocaleString("he-IL", { minimumFractionDigits: 0 })}`;

  if (isEmpty) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={gradientStyle}>
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-6 max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">הסל שלך ריק</h1>
          <p className="text-gray-600">התחל להוסיף מוצרים כדי לראות אותם כאן.</p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            חזרה לחנות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8" style={gradientStyle}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">סל הקניות שלך</h1>
              <p className="text-gray-600 mt-2">סיכום הפריטים שבחרת לרכישה</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="px-4 py-2 rounded-xl border border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 transition-all"
              >
                המשך לקנות
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="px-4 py-2 rounded-xl border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition-all"
              >
                נקה סל
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                <img
                  src={item.image || "https://via.placeholder.com/120x120?text=VIPO"}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-xl"
                />

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{item.name}</h2>
                      <p className="text-sm text-gray-500">מזהה מוצר: {item.productId}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-600 text-sm font-semibold"
                    >
                      הסר
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-lg font-bold text-purple-600">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.productId)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) => setItemQuantity(item.productId, event.target.value)}
                        className="w-16 text-center border border-gray-300 rounded-lg py-2"
                      />
                      <button
                        type="button"
                        onClick={() => incrementItem(item.productId)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">סיכום הזמנה</h2>
            <div className="flex justify-between text-gray-700">
              <span>מספר פריטים:</span>
              <span>{totals.totalQuantity}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>סכום ביניים:</span>
              <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>משלוח:</span>
              <span className="font-semibold text-green-600">חינם</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
              <span>{'סה&quot;כ לתשלום:'}</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
            >
              המשך לתשלום
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
