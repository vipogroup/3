export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return <ProductsClient />;
}
