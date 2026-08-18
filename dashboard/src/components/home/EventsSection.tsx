"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { EventRead } from "@/lib/types";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const PER_PAGE = 4;

export default function EventsSection() {
  const [events, setEvents] = useState<EventRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/events", { params: { query: { page: 1, page_size: 20 } } })
      .then((res) => {
        if (cancelled) return;
        setEvents(unwrap(res).items);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.ceil(events.length / PER_PAGE);
  const slice = events.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section id="events" className="py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
              Events of this season
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-pine">
              What&apos;s happening across Algeria
            </h2>
          </div>
          <Link
            href="/explore"
            className="hidden shrink-0 text-xs font-medium text-rustic-gold hover:underline sm:inline-block"
          >
            Explore more →
          </Link>
        </div>

        {status === "loading" && events.length === 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-champagne" />
            ))}
          </div>
        )}

        {status === "error" && events.length === 0 && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Could not load events.
          </p>
        )}

        {slice.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slice.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-xl border border-champagne bg-white shadow-sm"
              >
                {event.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.photo_url}
                    alt={event.title}
                    className="h-24 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-24 items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-sm font-bold text-pine/40">
                    No image
                  </div>
                )}
                <div className="p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded-full bg-champagne px-1.5 py-0.5 text-[9px] font-bold uppercase text-rustic-gold">
                      {event.category}
                    </span>
                    <span className="text-[10px] text-moss">
                      {MONTHS[event.month - 1] ?? ""}
                    </span>
                  </div>
                  <h3 className="mt-1 text-xs font-bold leading-tight text-pine line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-moss line-clamp-2">
                    {event.description}
                  </p>
                  <p className="mt-1 text-[9px] text-moss/60">
                    {event.duration_days ? `${event.duration_days}d` : ""}
                    {event.is_recurring ? " · annual" : " · once-off"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-[11px] text-moss">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
