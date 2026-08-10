"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";

export default function WilayasIndexPage() {
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [query, setQuery] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        setWilayas(unwrap(res) ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [retry]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q.length === 0
        ? wilayas
        : wilayas.filter(
            (w) =>
              w.name.toLowerCase().includes(q) ||
              String(w.id) === q ||
              (w.description ?? "").toLowerCase().includes(q),
          ),
    [wilayas, q],
  );

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
        >
          ← Home
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            Browse by wilaya
          </h1>
          <p className="mt-1 text-sm text-moss">
            {status === "ready"
              ? `${wilayas.length} wilayas · every POI geolocated and routable`
              : "All 69 wilayas of Algeria, with their points of interest."}
          </p>
        </header>

        <div className="mb-8 flex justify-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a wilaya by name or number…"
            className="w-full max-w-md rounded-full border border-champagne bg-white px-4 py-2 text-sm text-pine placeholder-moss focus:border-rustic-gold focus:outline-none"
          />
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-56 animate-pulse rounded-2xl bg-champagne" />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm text-amber-800">
              Could not load wilayas — is the API running?
            </p>
            <button
              onClick={() => setRetry((n) => n + 1)}
              className="mt-3 rounded-full bg-amber-800 px-4 py-1.5 text-xs font-normal text-white"
            >
              Retry
            </button>
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-6 text-center text-sm text-moss">
            No wilaya matches “{query}”.
          </p>
        )}

        {status === "ready" && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((w) => (
              <Link
                key={w.id}
                href={`/wilayas/${w.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm transition hover:shadow-md"
              >
                {w.highlight_poi_photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={w.highlight_poi_photo}
                    alt={w.name}
                    className="h-40 w-full object-cover transition group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-4xl">
                    {w.name.slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-bold text-pine">{w.name}</h2>
                    <span className="shrink-0 rounded-full bg-champagne px-2 py-0.5 text-[10px] font-normal text-rustic-gold">
                      N°{w.id}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-moss">
                    {w.highlight_poi ?? w.description ?? "Explore this wilaya."}
                  </p>
                  <p className="mt-3 text-xs font-medium text-moss">
                    {w.total_pois} POIs · {w.total_stays} stays ·{" "}
                    {w.total_experiences} experiences
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
