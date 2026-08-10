"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";

const modes = [
  { title: "Browse by wilaya", href: "/wilayas", emoji: "🗺" },
  { title: "Search all POIs", href: "/search", emoji: "🔍" },
  { title: "Browse stays", href: "/stays", emoji: "🛏" },
  { title: "Plan a trip", href: "/plan", emoji: "🧭" },
];

export default function ExplorePage() {
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [surprise, setSurprise] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
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
  }, []);

  const top = useMemo(
    () => [...wilayas].sort((a, b) => b.total_pois - a.total_pois).slice(0, 8),
    [wilayas],
  );

  function surpriseMe() {
    if (wilayas.length === 0) return;
    setSurprise(wilayas[Math.floor(Math.random() * wilayas.length)].id);
  }

  const surpriseWilaya = surprise
    ? wilayas.find((w) => w.id === surprise)
    : null;

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
            Don&apos;t know where to go?
          </h1>
          <p className="mt-1 text-sm text-moss">
            Start from the wilayas with the most to see, or let us surprise you.
          </p>
        </header>

        {/* Inspiration feed */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-pine">Get inspired</h2>
            <button
              onClick={surpriseMe}
              className="rounded-full bg-sea-foam px-4 py-1.5 text-xs font-normal text-pine shadow-sm transition hover:bg-champagne"
            >
              Surprise me 🎲
            </button>
          </div>

          {surpriseWilaya && (
            <div className="mb-5 overflow-hidden rounded-2xl border border-sea-foam bg-champagne/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
                    How about…
                  </p>
                  <p className="text-lg font-bold text-pine">
                    {surpriseWilaya.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-moss">
                    {surpriseWilaya.highlight_poi ??
                      surpriseWilaya.description ??
                      `${surpriseWilaya.total_pois} POIs to explore`}
                  </p>
                </div>
                <Link
                  href={`/wilayas/${surpriseWilaya.id}`}
                  className="rounded-full bg-rustic-gold px-5 py-2 text-xs font-normal text-white transition hover:bg-pine"
                >
                  Explore →
                </Link>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-champagne" />
              ))}
            </div>
          )}

          {status === "error" && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Could not load wilayas — is the API running?
            </p>
          )}

          {status === "ready" && top.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {top.map((w) => (
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
                      className="h-32 w-full object-cover transition group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-3xl">
                      {w.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-pine">{w.name}</h3>
                      <span className="shrink-0 rounded-full bg-champagne px-2 py-0.5 text-[10px] font-normal text-rustic-gold">
                        {w.total_pois} POIs
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-moss">
                      {w.highlight_poi ?? w.description ?? ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-pine">Start exploring</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {modes.map((mode) => (
              <Link
                key={mode.href}
                href={mode.href}
                className="rounded-2xl border border-champagne bg-white px-5 py-4 text-sm font-normal text-moss transition hover:border-sea-foam hover:text-pine"
              >
                <span className="mr-2">{mode.emoji}</span>
                {mode.title} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
