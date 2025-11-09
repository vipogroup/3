export const dynamic = 'force-dynamic';
export const revalidate = 0;

import TransactionsClient from "./TransactionsClient";

export default function AdminTransactionsPage() {
  return <TransactionsClient />;
}
