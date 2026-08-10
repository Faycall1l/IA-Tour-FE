"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { EventRead } from "@/lib/types";

const PAGE_SIZE = 4;
const FLIP_MS = 30000;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ReviewsSection() {
  const [events, setEvents] = useState<EventRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/events", { params: { query: { page: 1, page_size: 8 } } })
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

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));

  useEffect(() => {
    if (events.length <= PAGE_SIZE) return;
    const t = setInterval(
      () => setPage((p) => (p + 1) % totalPages),
      FLIP_MS,
    );
    return () => clearInterval(t);
  }, [events.length, totalPages]);

  const visible = events.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <section id="reviews" className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
              Events & festivals
            </p>
            <h2 className="mt-1 text-2xl font-bold text-pine">
              What&apos;s on across Algeria
            </h2>
          </div>
          <Link
            href="/explore"
            className="hidden shrink-0 rounded-full border border-champagne px-4 py-2 text-sm font-medium text-moss transition hover:border-rustic-gold hover:text-rustic-gold sm:inline-block"
          >
            Explore more →
          </Link>
        </div>

        {status === "loading" && events.length === 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-champagne"
              />
            ))}
          </div>
        )}

        {status === "error" && events.length === 0 && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not load events from the API.
          </p>
        )}

        {visible.length > 0 && (
          <>
            <div key={page} className="animate-fade-in-up">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {visible.map((event) => {
                  const month = MONTHS[event.month - 1] ?? `Month ${event.month}`;
                  return (
                    <article
                      key={event.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm"
                    >
                      {event.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.photo_url}
                          alt={event.title}
                          className="h-32 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-32 items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-3xl">
                          🎉
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-champagne px-2.5 py-0.5 text-[11px] font-semibold capitalize text-rustic-gold">
                            {event.category}
                          </span>
                          <span className="text-xs font-medium text-moss">
                            {month}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-pine">
                          {event.title}
                        </h3>
                        <p className="mt-1 flex-1 text-sm leading-relaxed text-moss">
                          {event.description}
                        </p>
                        <p className="mt-3 text-xs text-moss">
                          {event.duration_days
                            ? `${event.duration_days} day${event.duration_days === 1 ? "" : "s"}`
                            : "Recurring"}
                          {event.is_recurring ? " · annual" : ""} · wilaya{" "}
                          {event.wilaya_id}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {events.length > PAGE_SIZE && (
              <div className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Events page ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === page
                        ? "w-6 bg-rustic-gold"
                        : "w-2 bg-champagne hover:bg-rustic-gold"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
