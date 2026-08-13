"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { TripRead } from "@/lib/types";
import { LoadingPanel, ErrorPanel, EmptyPanel } from "@/components/ui/StatePanel";

/**
 * Profile trips: lists the authenticated user's saved trips, optionally
 * filtered by status (active/archived). Each row links to the trip detail.
 */
export default function TripsSection() {
  const [trips, setTrips] = useState<TripRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [filter, setFilter] = useState<string>("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/trips", {
        params: { query: { status: filter || null, page_size: 50 } },
      })
      .then((res) => {
        if (cancelled) return;
        setTrips(unwrap(res).items ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [filter, retry]);

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-pine">My trips</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-champagne bg-white px-3 py-1.5 text-xs text-pine focus:border-rustic-gold focus:outline-none"
        >
          <option value="">All trips</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="mt-4">
        {status === "loading" && <LoadingPanel />}
        {status === "error" && (
          <ErrorPanel
            message="Could not load trips."
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}
        {status === "ready" && trips.length === 0 && (
          <EmptyPanel title="No trips yet — plan your next journey." />
        )}
        {status === "ready" && trips.length > 0 && (
          <ul className="divide-y divide-champagne/60">
            {trips.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-pine">
                    {t.title ?? "Untitled trip"}
                  </p>
                  <p className="text-xs text-moss">
                    {t.start_date
                      ? new Date(t.start_date).toLocaleDateString()
                      : "No dates"}
                    {t.end_date
                      ? ` → ${new Date(t.end_date).toLocaleDateString()}`
                      : ""}
                    {t.total_budget_dzd != null
                      ? ` · ${t.total_budget_dzd.toLocaleString("en-US")} DZD`
                      : ""}
                  </p>
                </div>
                <Link
                  href={`/trips/${t.id}`}
                  className="shrink-0 rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}