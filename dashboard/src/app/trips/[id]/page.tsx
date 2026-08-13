"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { TripRead } from "@/lib/types";
import SectionHeading from "@/components/ui/SectionHeading";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";

/**
 * Trip detail: renders the days of a trip plan, each with its items
 * (POIs/stays/experiences) and per-day distance + cost. Owner-only via API.
 */
export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const auth = useAuth();

  const [trip, setTrip] = useState<TripRead | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/trips/{trip_id}", { params: { path: { trip_id: id } } })
      .then((res) => {
        if (cancelled) return;
        setTrip(unwrap(res));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, retry, auth.status]);

  if (auth.status !== "authenticated") {
    return (
      <main className="min-h-screen bg-white px-6 pb-16 pt-24">
        <div className="mx-auto max-w-md">
          <SectionHeading
            backHref="/"
            backLabel="Home"
            eyebrow="Trips"
            title="Sign in"
            subtitle="Sign in to view your trip plan."
          />
          {auth.status === "loading" ? (
            <p className="text-sm text-moss">Loading…</p>
          ) : (
            <AuthGate onAuthed={auth.signIn} submitLabel="Sign in to view trip" />
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          backHref="/profile"
          backLabel="My profile"
          eyebrow="Trip plan"
          title={trip?.title ?? "Trip details"}
          subtitle={
            trip
              ? `${trip.days.length} day${trip.days.length === 1 ? "" : "s"}` +
                (trip.total_budget_dzd != null
                  ? ` · ${trip.total_budget_dzd.toLocaleString("en-US")} DZD budget`
                  : "")
              : undefined
          }
        />

        {status === "loading" && <LoadingPanel />}

        {status === "error" && (
          <ErrorPanel
            message="Could not load this trip — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {status === "ready" && trip && (
          <>
            <div className="mb-6 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-champagne/40 px-3 py-1 capitalize text-moss">
                {trip.status}
              </span>
              {trip.start_date && (
                <span className="rounded-full bg-champagne/40 px-3 py-1 text-moss">
                  {new Date(trip.start_date).toLocaleDateString()}
                  {trip.end_date
                    ? ` → ${new Date(trip.end_date).toLocaleDateString()}`
                    : ""}
                </span>
              )}
              <span className="rounded-full bg-sea-foam/60 px-3 py-1 font-medium text-pine">
                {trip.budget_spent.toLocaleString("en-US")} DZD spent
                {trip.budget_remaining != null
                  ? ` · ${trip.budget_remaining.toLocaleString("en-US")} left`
                  : ""}
              </span>
            </div>

            <div className="space-y-6">
              {trip.days.map((day) => (
                <section
                  key={day.day_number}
                  className="rounded-2xl border border-champagne bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-pine">
                      Day {day.day_number}
                    </h2>
                    <span className="text-xs text-moss">
                      {day.total_distance_km} km
                      {day.total_cost_dzd
                        ? ` · ${day.total_cost_dzd.toLocaleString("en-US")} DZD`
                        : ""}
                    </span>
                  </div>

                  {day.items.length === 0 ? (
                    <p className="mt-3 text-sm text-moss">
                      No items planned for this day yet.
                    </p>
                  ) : (
                    <ol className="mt-4 space-y-3">
                      {day.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex gap-3 text-sm"
                        >
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne text-xs font-semibold text-rustic-gold">
                            {item.sort_order}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-pine">
                              {item.item_name ?? `${item.item_type} item`}
                              <span className="ml-2 rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] capitalize text-moss">
                                {item.item_type}
                              </span>
                              {item.time_slot && (
                                <span className="ml-2 text-xs font-normal text-moss">
                                  {item.time_slot}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-moss">
                              {item.estimated_duration_minutes
                                ? `${item.estimated_duration_minutes} min`
                                : ""}
                              {item.estimated_cost_dzd
                                ? ` · ${item.estimated_cost_dzd.toLocaleString("en-US")} DZD`
                                : ""}
                            </p>
                            {item.notes && (
                              <p className="mt-0.5 text-xs text-moss">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}