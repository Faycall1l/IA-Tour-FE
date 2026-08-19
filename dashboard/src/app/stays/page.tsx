"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { StayRead, WilayaSummary } from "@/lib/types";
import {
  loadChosenStay,
  saveChosenStay,
  type PickedStay,
} from "@/lib/itinerary";

const PAGE_SIZE = 8;

const PROPERTY_TYPES = [
  "hotel",
  "hostel",
  "guesthouse",
  "apartment",
  "riad",
  "resort",
  "camp_site",
];

const PRICE_RANGES = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under 5,000 DZD", min: 0, max: 5000 },
  { label: "5,000 - 8,000 DZD", min: 5000, max: 8000 },
  { label: "8,000 - 12,000 DZD", min: 8000, max: 12000 },
  { label: "Over 12,000 DZD", min: 12000, max: Infinity },
];

const GUEST_OPTIONS = [
  { label: "Any size", value: 0 },
  { label: "1-2 guests", value: 2 },
  { label: "3-4 guests", value: 4 },
  { label: "5+ guests", value: 5 },
];

export default function StaysPage() {
  const [chosen, setChosen] = useState<PickedStay | null>(() => loadChosenStay());
  const [wilayaId, setWilayaId] = useState<number | "">("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [guests, setGuests] = useState(0);
  const [page, setPage] = useState(1);

  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [allStays, setAllStays] = useState<StayRead[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const wRes = await client.GET("/api/v1/discover/wilayas");
        if (cancelled) return;
        setWilayas(unwrap(wRes));
      } catch { /* ignore */ }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const params: Record<string, string | number> = { page, page_size: PAGE_SIZE };
        if (wilayaId !== "") params.wilaya_id = wilayaId;
        if (propertyType) params.property_type = propertyType;
        const range = PRICE_RANGES[priceRange];
        if (range.min > 0) params.min_price = range.min;
        if (range.max < Infinity) params.max_price = range.max;
        const res = await client.GET("/api/v1/stays", { params: { query: params } });
        if (cancelled) return;
        const data = unwrap(res);
        let items = data.items;
        if (guests > 0) {
          items = items.filter((s: StayRead) => {
            if (guests >= 5 && (s.max_guests ?? 2) < 5) return false;
            if (guests < 5 && (s.max_guests ?? 2) < guests) return false;
            return true;
          });
        }
        setAllStays(items);
        setTotalCount(data.total);
      } catch {
        if (!cancelled) {
          setAllStays([]);
          setTotalCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [wilayaId, propertyType, priceRange, guests, page]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const wilayaName = (id: number) =>
    wilayas.find((w) => w.id === id)?.name ?? `Wilaya ${id}`;

  function chooseStay(s: StayRead) {
    const picked: PickedStay = {
      id: s.id,
      name: s.name,
      property_type: s.property_type,
      wilaya_id: s.wilaya_id,
      address: s.address,
      latitude: s.latitude,
      longitude: s.longitude,
      price_per_night_dzd: s.price_per_night_dzd,
      photos: s.photos,
    };
    const next = chosen?.id === s.id ? null : picked;
    setChosen(next);
    saveChosenStay(next);
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/itinerary"
          className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
        >
          &larr; Back to itinerary
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            Pick a stay
          </h1>
          <p className="mt-1 text-sm text-moss">
            {totalCount} stays across Algeria — pick one for your trip.
          </p>
        </header>

        {chosen && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sea-foam bg-sea-foam/20 px-5 py-4">
            <div>
              <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
                Your sleeping spot
              </p>
              <p className="text-lg font-bold text-pine">{chosen.name}</p>
              <p className="text-xs text-moss">
                {wilayaName(chosen.wilaya_id)} ·{" "}
                {chosen.price_per_night_dzd.toLocaleString("en-US")} DZD/night
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/itinerary"
                className="rounded-full bg-pine px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rustic-gold"
              >
                Go to itinerary &rarr;
              </Link>
              <button
                onClick={() => {
                  setChosen(null);
                  saveChosenStay(null);
                }}
                className="rounded-full border border-champagne bg-white px-4 py-2 text-xs font-normal text-moss transition hover:border-sea-foam hover:text-pine"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-champagne bg-white p-4 shadow-sm sm:grid-cols-4">
          <select
            value={wilayaId}
            onChange={(e) => {
              setWilayaId(e.target.value ? Number(e.target.value) : "");
              setPage(1);
            }}
            aria-label="Filter by place"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            <option value="">All places</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by type"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            <option value="">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => {
              setPriceRange(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Filter by price"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            {PRICE_RANGES.map((r, i) => (
              <option key={i} value={i}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            value={guests}
            onChange={(e) => {
              setGuests(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Filter by number of guests"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            {GUEST_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-6 text-center text-sm text-moss">
            Loading stays…
          </p>
        )}

        {!loading && allStays.length === 0 && (
          <p className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-6 text-center text-sm text-moss">
            No stays match these filters.
          </p>
        )}

        {!loading && allStays.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allStays.map((s) => {
                const isChosen = chosen?.id === s.id;
                return (
                  <article
                    key={s.id}
                    className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                      isChosen
                        ? "border-sea-foam ring-2 ring-sea-foam/50"
                        : "border-champagne"
                    }`}
                  >
                    {s.photos && s.photos.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.photos[0]}
                        alt={s.name}
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-sm font-bold text-pine/40">
                        No image
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-bold text-pine">{s.name}</h2>
                        <span className="shrink-0 rounded-full bg-champagne px-2 py-0.5 text-[10px] font-normal capitalize text-rustic-gold">
                          {s.property_type}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-moss">
                        {wilayaName(s.wilaya_id)}
                      </p>
                      {s.description && (
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-moss">
                          {s.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <p className="font-semibold text-emerald-700">
                          {s.price_per_night_dzd.toLocaleString("en-US")} DZD
                          <span className="text-xs font-normal text-moss"> /night</span>
                        </p>
                        {s.max_guests && (
                          <span className="text-[10px] text-moss">
                            up to {s.max_guests} guests
                          </span>
                        )}
                      </div>
                      {s.amenities && s.amenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {s.amenities.slice(0, 3).map((a) => (
                            <span
                              key={a}
                              className="rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] text-moss"
                            >
                              {a}
                            </span>
                          ))}
                          {s.amenities.length > 3 && (
                            <span className="rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] text-moss">
                              +{s.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => chooseStay(s)}
                        className={`mt-3 rounded-full border px-4 py-2 text-xs font-bold transition ${
                          isChosen
                            ? "border-pine bg-pine text-white hover:bg-moss"
                            : "border-sea-foam bg-sea-foam/20 text-pine hover:bg-sea-foam"
                        }`}
                      >
                        {isChosen ? "Chosen" : "Choose this stay"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-full bg-champagne px-4 py-1.5 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
                >
                  &larr; Prev
                </button>
                <span className="min-w-[48px] text-center text-[11px] text-moss">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-full bg-champagne px-4 py-1.5 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
