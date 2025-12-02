export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
import ReportsClient from './ReportsClient';

export default function AdminReports() {
  return <ReportsClient />;
}
