"use client";

import { useEffect, useState } from "react";

async function createLink() {
  const res = await fetch("/api/agent/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error(`link ${res.status}`);
  return res.json();
}

export default function LinkPanel() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await createLink();
      const nextLink = payload?.data?.url ?? payload?.url ?? "";
      setLink(nextLink);
    } catch (err) {
      setError(err.message || "link failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generate();
  }, []);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      setError(err.message || "copy failed");
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Referral Link</h2>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          רענן
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">שגיאה: {error}</p>}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          value={loading ? "יוצר קישור..." : link}
          readOnly
        />
        <button
          type="button"
          onClick={copy}
          disabled={!link || loading}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          {copied ? "הועתק!" : "העתק"}
        </button>
      </div>
      <p className="mt-2 text-xs opacity-70">
        הקישור נבנה על בסיס BASE_URL ו-agentId שלך.
      </p>
    </section>
  );
}
