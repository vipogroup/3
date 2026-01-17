// app/join/page.jsx
import JoinClient from './JoinClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

function getParam(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return (value[0] || '').trim();
  return '';
}

export default async function JoinPage({ searchParams }) {
  const ref = getParam(searchParams?.ref) || null;
  const productId = getParam(searchParams?.product) || null;

  return (
    <main className="min-h-screen bg-gray-50">
      <JoinClient refId={ref} productId={productId} />
    </main>
  );
}
