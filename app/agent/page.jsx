"use client";

import { useEffect, useState } from "react";
import OverviewCards from "./ui/OverviewCards";
import OrdersPanel from "./ui/OrdersPanel";
import ReferralsPanel from "./ui/ReferralsPanel";
import MetricsPanel from "./ui/MetricsPanel";
import LinkPanel from "./ui/LinkPanel";

function createAbortController() {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  return controller;
}

export default function AgentPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = createAbortController();
    (async () => {
      try {
        const r = await fetch("/api/agent/overview", {
          cache: "no-store",
          signal: controller?.signal,
        });
        if (!r.ok) throw new Error(`overview ${r.status}`);
        const j = await r.json();
        setOverview(j?.data || null);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "failed to load overview");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller?.abort();
  }, []);

  return (
    <main className="space-y-8">
      <OverviewCards data={overview} loading={loading} error={error} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <OrdersPanel />
          <MetricsPanel />
        </div>
        <div className="space-y-8">
          <ReferralsPanel />
          <LinkPanel />
        </div>
      </div>
    </main>
  );
}
