"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";

export default function TrendingDestinations() {
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        setWilayas(unwrap(res));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = wilayas.slice(0, 12);

  return (
    <section id="trending" className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
              Trending destinations
            </p>
            <h2 className="mt-1 text-2xl font-bold text-pine">
              Where travelers are heading
            </h2>
          </div>
          <Link
            href="/destinations"
            className="hidden shrink-0 rounded-full border border-champagne px-4 py-2 text-sm font-medium text-moss transition hover:border-rustic-gold hover:text-rustic-gold sm:inline-block"
          >
            All destinations →
          </Link>
        </div>

        {status === "error" && wilayas.length === 0 && (
          <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not reach the destinations API.
          </p>
        )}

        <div className="no-scrollbar -mx-6 overflow-x-auto px-6 pb-4">
          {status === "loading" && wilayas.length === 0 ? (
            <div className="flex gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 w-52 shrink-0 animate-pulse rounded-xl bg-champagne"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-5">
              {shown.map((w) => (
                <Link
                  key={w.id}
                  href="/destinations"
                  className="group w-56 shrink-0 overflow-hidden rounded-xl border border-champagne bg-white shadow-sm transition hover:shadow-md"
                >
                  {w.highlight_poi_photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={w.highlight_poi_photo}
                      alt={w.name}
                      className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-champagne text-3xl text-pine">
                      {w.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-pine">{w.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-moss">
                      {w.highlight_poi ?? w.description ?? "Explore this wilaya"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-champagne px-2 py-0.5 font-medium text-pine">
                        {w.total_pois} POIs
                      </span>
                      <span className="rounded bg-champagne px-2 py-0.5 font-medium text-pine">
                        {w.total_stays} stays
                      </span>
                      {w.total_artisans > 0 && (
                        <span className="rounded bg-sea-foam/50 px-2 py-0.5 font-medium text-pine">
                          {w.total_artisans} artisans
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/destinations"
          className="mt-2 inline-block text-sm font-medium text-rustic-gold hover:underline sm:hidden"
        >
          All destinations →
        </Link>
      </div>
    </section>
  );
}
