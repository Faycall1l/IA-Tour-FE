"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { PickedWilaya } from "./AlgeriaWilayaMap";
import PlanSearch from "./PlanSearch";

const AlgeriaWilayaMap = dynamic(() => import("./AlgeriaWilayaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-champagne bg-champagne/30 text-sm text-moss">
      Loading map…
    </div>
  ),
});

const DEFAULT_PICKS: PickedWilaya[] = [
  { key: "Alger", name: "Alger", id: 16 },
  { key: "Béjaïa", name: "Béjaïa", id: 6 },
  { key: "Tamanrasset", name: "Tamanrasset", id: 11 },
];

export default function PlanPageClient() {
  const [picked, setPicked] = useState<PickedWilaya[]>(DEFAULT_PICKS);

  function toggle(w: PickedWilaya) {
    setPicked((prev) =>
      prev.some((p) => p.key === w.key)
        ? prev.filter((p) => p.key !== w.key)
        : [...prev, w],
    );
  }

  function addIfAbsent(w: PickedWilaya) {
    setPicked((prev) =>
      prev.some((p) => p.key === w.key) ? prev : [...prev, w],
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
      >
        ← Home
      </Link>

      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pine">
          Wanna go somewhere?
        </h1>
        <p className="mt-1 text-sm text-moss">
          You already know where you&apos;re headed. Pick your wilayas and
          dates, and we&apos;ll optimize your itinerary for maximum fun and
          exploration.
        </p>
      </header>

      <div className="mx-auto mb-8 flex w-full max-w-3xl items-center gap-3 rounded-full border border-champagne bg-white px-4 py-2 shadow-sm">
        <div className="flex w-1/6 shrink-0 items-center gap-2">
          <input
            id="plan-departure"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-champagne bg-white px-2 py-1 text-xs text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
          />
        </div>

        <span className="text-xs text-rustic-gold">→</span>

        <div className="flex w-1/6 shrink-0 items-center gap-2">
          <input
            id="plan-return"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-champagne bg-white px-2 py-1 text-xs text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
          />
        </div>

        <div className="mx-2 h-5 w-px shrink-0 bg-champagne" />

        <PlanSearch
          picked={picked}
          onToggle={toggle}
          onSelect={addIfAbsent}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-champagne bg-white p-3 shadow-sm lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <p className="text-xs font-normal text-moss">
              Click a wilaya on the map to add it to your trip
            </p>
            <span className="shrink-0 rounded-full bg-champagne px-2.5 py-0.5 text-[10px] font-normal text-pine">
              {picked.length} picked
            </span>
          </div>
          <AlgeriaWilayaMap
            selectedKeys={picked.map((p) => p.key)}
            onToggle={toggle}
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-champagne bg-white p-3 shadow-sm">
          <h3 className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
            Your picks
          </h3>
          {picked.length === 0 ? (
            <div className="mt-3 flex flex-1 items-center justify-center rounded-xl border border-dashed border-champagne bg-champagne/20 p-4 text-center text-xs text-moss">
              No wilaya selected yet — click on the map or search above.
            </div>
          ) : (
            <div className="no-scrollbar mt-3 flex flex-1 gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto">
              {picked.map((p) => (
                <div
                  key={p.key}
                  className="flex items-center justify-between gap-2 rounded-xl border border-champagne bg-white px-3 py-2 shadow-sm lg:w-full"
                >
                  <span className="text-sm font-medium text-pine">
                    {p.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {p.id && (
                      <Link
                        href={`/wilayas/${p.id}`}
                        className="text-[11px] font-semibold text-rustic-gold transition hover:text-pine hover:underline"
                      >
                        View {p.name}
                      </Link>
                    )}
                    <button
                      onClick={() => toggle(p)}
                      aria-label={`Remove ${p.name}`}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-champagne text-[11px] text-pine transition hover:bg-sea-foam"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
