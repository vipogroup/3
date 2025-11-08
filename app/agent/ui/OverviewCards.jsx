"use client";

const CARDS = [
  { key: "clicks", label: "Clicks" },
  { key: "leads", label: "Leads" },
  { key: "orders", label: "Orders (Paid)" },
  { key: "revenue", label: "Revenue (₪)" },
  { key: "commission", label: "Commission (₪)" },
];

function SkeletonRow({ count }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="h-20 animate-pulse rounded-xl bg-white/5"
        />
      ))}
    </div>
  );
}

export default function OverviewCards({ data, loading, error }) {
  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-3">סקירה</h2>
        <SkeletonRow count={CARDS.length} />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-3">סקירה</h2>
        <p className="text-red-500">שגיאה בטעינת סקירה: {error}</p>
      </section>
    );
  }

  const values = data || {};

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">סקירה</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CARDS.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="text-xs opacity-70">{label}</div>
            <div className="mt-1 text-2xl font-bold">
              {Number(values[key] ?? 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
