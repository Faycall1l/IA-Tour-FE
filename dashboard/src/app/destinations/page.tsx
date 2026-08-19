"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";
export default function DestinationsPage() {
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        const data = unwrap(res);
        if (data.length > 0) setWilayas(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const filtered =
    q.length === 0
      ? wilayas
      : wilayas.filter(
          (w) =>
            w.name.toLowerCase().includes(q) ||
            (w.highlight_poi ?? "").toLowerCase().includes(q),
        );

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Home
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">
            All destinations & sites
          </h1>
          <p className="mt-1 text-zinc-600">
            Every wilaya of Algeria, from the Mediterranean coast to the deep
            Sahara. Pick one and start exploring.
          </p>
        </header>

        <div className="mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations…"
            className="w-full max-w-md rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {status === "loading" && wilayas.length === 0 && (
          <p className="text-zinc-500">Loading destinations…</p>
        )}

        {status === "error" && wilayas.length === 0 && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not reach the destinations API.
          </div>
        )}

        {wilayas.length > 0 && (
          <>
            <p className="mb-4 text-sm text-zinc-500">
              {filtered.length} destination{filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((w) => (
                <Link
                  key={w.id}
                  href={`/wilayas/${w.id}`}
                  className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {w.highlight_poi_photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={w.highlight_poi_photo}
                      alt={w.name}
                      className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-emerald-200 to-teal-200 text-4xl">
                      {w.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-semibold text-zinc-900">{w.name}</h2>
                    {w.highlight_poi && (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                        {w.highlight_poi}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                        {w.total_pois} POIs
                      </span>
                      <span className="rounded bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                        {w.total_stays} stays
                      </span>
                      <span className="rounded bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                        {w.total_experiences} experiences
                      </span>
                      <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">
                        {w.total_artisans} artisans
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
