"use client";

import { useEffect, useMemo, useState } from "react";

const RANGE_OPTIONS = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
];

function MiniChart({ points = [], width = 600, height = 160, pad = 20 }) {
  if (!points.length) {
    return <div className="h-40 rounded-xl border border-white/10 bg-white/5" />;
  }

  const xs = points.map((p) => new Date(p.date).getTime());
  const ys = points.map((p) => Number(p.value || 0));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = Math.max(1, Math.max(...ys));
  const scaleX = (x) =>
    pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const scaleY = (y) =>
    height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2);

  const path = points
    .map((p, idx) => {
      const x = scaleX(new Date(p.date).getTime());
      const y = scaleY(Number(p.value || 0));
      return `${idx === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-xl border border-white/10 bg-white/5"
    >
      <line
        x1={pad}
        y1={height - pad}
        x2={width - pad}
        y2={height - pad}
        stroke="currentColor"
        opacity="0.2"
      />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
      {points.map((p, idx) => (
        <circle
          key={idx}
          cx={scaleX(new Date(p.date).getTime())}
          cy={scaleY(Number(p.value || 0))}
          r="3"
        />
      ))}
    </svg>
  );
}

async function fetchMetrics(range) {
  const res = await fetch(`/api/agent/metrics?range=${range}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`metrics ${res.status}`);
  return res.json();
}

function buildSeries(data = {}) {
  const orderSeries = Array.isArray(data.orders) ? data.orders : [];
  const revenue = orderSeries.map((entry) => ({
    date: entry._id,
    value: entry.revenue ?? 0,
  }));
  const commission = orderSeries.map((entry) => ({
    date: entry._id,
    value: entry.commission ?? 0,
  }));
  return { revenue, commission };
}

export default function MetricsPanel() {
  const [range, setRange] = useState("30d");
  const [state, setState] = useState({ revenue: [], commission: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let abort = false;
    setLoading(true);
    setError("");

    fetchMetrics(range)
      .then((payload) => {
        if (abort) return;
        const series = buildSeries(payload?.data);
        setState(series);
      })
      .catch((err) => {
        if (abort) return;
        setError(err.message || "metrics failed");
      })
      .finally(() => {
        if (!abort) setLoading(false);
      });

    return () => {
      abort = true;
    };
  }, [range]);

  const revenuePoints = useMemo(() => state.revenue ?? [], [state]);
  const commissionPoints = useMemo(() => state.commission ?? [], [state]);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Metrics</h2>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={`px-3 py-2 rounded-lg border border-white/10 ${
                range === key ? "bg-white/20" : "bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-2 text-red-500">שגיאה: {error}</p>}

      {loading ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-xl bg-white/5" />
          <div className="h-40 animate-pulse rounded-xl bg-white/5" />
        </div>
      ) : (
        <div className="grid gap-6">
          <div>
            <div className="mb-1 text-sm opacity-70">Revenue (₪)</div>
            <MiniChart points={revenuePoints} />
          </div>
          <div>
            <div className="mb-1 text-sm opacity-70">Commission (₪)</div>
            <MiniChart points={commissionPoints} />
          </div>
        </div>
      )}
    </section>
  );
}
