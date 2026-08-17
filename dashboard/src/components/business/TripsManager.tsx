"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { TripRead } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";

type Status = "active" | "completed" | "cancelled";

const STATUSES: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "All trips" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

/**
 * Trips manager: lists the signed-in user's trip plans with a status filter,
 * destinations and day/cost summaries. Links to /trips/{id} for the full plan.
 */
export default function TripsManager() {
  const auth = useAuth();
  const [trips, setTrips] = useState<TripRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/trips", { params: { query: { page_size: 100 } } })
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
  }, [auth, retry]);

  if (auth.status !== "authenticated") {
    return (
      <div className="max-w-md rounded-2xl border border-champagne bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pine">Trip tracking</h2>
        <p className="mb-4 mt-1 text-sm text-moss">
          Sign in to view and manage your trip plans.
        </p>
        {auth.status === "loading" ? (
          <p className="text-sm text-moss">Loading…</p>
        ) : (
          <AuthGate onAuthed={auth.signIn} submitLabel="Sign in to view trips" />
        )}
      </div>
    );
  }

  if (status === "loading") return <LoadingPanel />;
  if (status === "error")
    return (
      <ErrorPanel
        message="Could not load your trips — is the API running?"
        onRetry={() => setRetry((n) => n + 1)}
      />
    );

  const filtered = filter === "all" ? trips : trips.filter((t) => t.status === filter);

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Trip tracking</h2>
      <p className="mt-1 text-sm text-moss">
        {trips.length} trip {trips.length === 1 ? "plan" : "plans"} on your
        account.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === s.value
                ? "bg-sea-foam text-pine"
                : "bg-champagne/40 text-moss hover:bg-champagne"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-moss">
          No {filter === "all" ? "" : `${filter} `}trips yet. Plan a trip to see
          it here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-champagne/60">
          {filtered.map((t) => (
            <li key={t.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-pine">
                    {t.title}
                  </p>
                  <p className="text-xs text-moss">
                    {t.days.length} day{t.days.length === 1 ? "" : "s"} ·{" "}
                    {t.budget_spent.toLocaleString("en-US")} DZD spent
                    {t.status !== "cancelled" &&
                      t.budget_remaining != null &&
                      ` · ${t.budget_remaining.toLocaleString("en-US")} DZD left`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                      t.status === "active"
                        ? "bg-sea-foam/60 text-pine"
                        : "bg-champagne/40 text-moss"
                    }`}
                  >
                    {t.status}
                  </span>
                  <Link
                    href={`/trips/${t.id}`}
                    className="rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}