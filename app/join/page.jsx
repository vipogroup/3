// app/join/page.jsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getParam(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return (value[0] || '').trim();
  return '';
}

export default async function JoinPage({ searchParams }) {
  const ref = getParam(searchParams?.ref);
  const productId = getParam(searchParams?.product);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">הצטרפות לקנייה קבוצתית</h1>

      <div className="grid gap-4">
        <div className="text-sm">
          <div>Referral ID: <strong>{ref || '—'}</strong></div>
          <div>Product ID: <strong>{productId || '—'}</strong></div>
        </div>

        <p className="text-sm opacity-80">
          עמוד זה מרונדר דינמית כדי לאסוף פרמטרים מה-URL בזמן ריצה ולמנוע שגיאות build.
        </p>
      </div>
    </main>
  );
}
