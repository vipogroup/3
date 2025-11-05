/**
 * KPI Card component for displaying metrics in a consistent format
 */
export default function KpiCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
