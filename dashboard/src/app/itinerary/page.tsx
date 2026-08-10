"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AgentChat from "@/components/AgentChat";

type PickedSite = {
  id: string;
  name: string;
  category: string;
  wilaya_id: number;
  wilaya_name: string;
  photo_url?: string | null;
};

const STORAGE_KEY = "athar:selected-sites";

function loadSavedSites(): PickedSite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PickedSite[]) : [];
  } catch {
    return [];
  }
}

export default function ItineraryPage() {
  const [sites, setSites] = useState<PickedSite[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSites(loadSavedSites());
    setLoaded(true);
  }, []);

  const days = useMemo(() => {
    const map = new Map<number, { name: string; sites: PickedSite[] }>();
    for (const site of sites) {
      const day = map.get(site.wilaya_id) ?? {
        name: site.wilaya_name,
        sites: [],
      };
      day.sites.push(site);
      map.set(site.wilaya_id, day);
    }
    return [...map.values()];
  }, [sites]);

  function clearAll() {
    setSites([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/plan"
          className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
        >
          ← Plan
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            My itinerary
          </h1>
          <p className="mt-1 text-sm text-moss">
            {loaded
              ? sites.length === 0
                ? "Pick sites on the plan page and they&apos;ll appear here, day by day."
                : `${sites.length} site${sites.length === 1 ? "" : "s"} across ${days.length} day${days.length === 1 ? "" : "s"}.`
              : "Loading your picks…"}
          </p>
        </header>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/plan"
            className="rounded-full bg-sea-foam px-4 py-1.5 text-xs font-normal text-pine shadow-sm transition hover:bg-champagne"
          >
            Optimize my itinerary
          </Link>
          <Link
            href="/stays"
            className="rounded-full border border-champagne bg-white px-4 py-1.5 text-xs font-normal text-moss transition hover:border-sea-foam hover:text-pine"
          >
            Choose my stay
          </Link>
          {sites.length > 0 && (
            <button
              onClick={clearAll}
              className="rounded-full border border-amber-200 bg-white px-4 py-1.5 text-xs font-normal text-amber-700 transition hover:bg-amber-50"
            >
              Clear selection
            </button>
          )}
        </div>

        {loaded && sites.length === 0 && (
          <div className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-10 text-center">
            <p className="text-sm text-moss">
              Your trip, optimized day by day. Head to the plan page, pick the
              wilayas you want to visit and add the sites you don&apos;t want to
              miss.
            </p>
            <Link
              href="/plan"
              className="mt-4 inline-block rounded-full bg-rustic-gold px-6 py-2.5 text-sm font-normal text-white shadow-sm transition hover:bg-pine"
            >
              Start planning →
            </Link>
          </div>
        )}

        {loaded && sites.length > 0 && (
          <div className="space-y-8">
            {days.map((day, i) => (
              <section key={i}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-foam text-xs font-bold text-pine">
                    D{i + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-pine">
                      Day {i + 1} — {day.name}
                    </h2>
                    <p className="text-xs text-moss">
                      {day.sites.length} site{day.sites.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {day.sites.map((site) => (
                    <article
                      key={site.id}
                      className="overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm"
                    >
                      {site.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={site.photo_url}
                          alt={site.name}
                          className="h-36 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-3xl">
                          {site.category.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="p-4">
                        <p className="text-sm font-bold text-pine">
                          {site.name}
                        </p>
                        <p className="mt-0.5 text-[10px] font-normal uppercase tracking-wider text-rustic-gold">
                          {site.category}
                        </p>
                        <Link
                          href={`/pois/${site.id}`}
                          className="mt-2 inline-block text-[10px] font-normal text-rustic-gold transition hover:text-pine hover:underline"
                        >
                          View details →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Real agent refinement */}
        <section className="mt-12">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-pine">
              Refine with the ATHAR agent
            </h2>
            <p className="text-sm text-moss">
              Ask for day-by-day order, transport between stops or what to pack.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-2xl border border-champagne bg-white p-4 shadow-sm">
            <AgentChat />
          </div>
        </section>
      </div>
    </main>
  );
}
