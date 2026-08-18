"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { StayRead, WilayaSummary } from "@/lib/types";
import {
  loadChosenStay,
  saveChosenStay,
  type PickedStay,
} from "@/lib/itinerary";

const PAGE_SIZE = 12;

const PROPERTY_TYPES = ["hotel", "hostel", "guesthouse", "apartment", "riad", "resort", "camp_site"];

export default function StaysPage() {
  const [stays, setStays] = useState<StayRead[]>([]);
  const [total, setTotal] = useState(0);
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [wilayaId, setWilayaId] = useState<number | undefined>();
  const [propertyType, setPropertyType] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [chosen, setChosen] = useState<PickedStay | null>(null);

  useEffect(() => {
    setChosen(loadChosenStay());
  }, []);

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

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (!cancelled) setWilayas(unwrap(res) ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/stays", {
        params: {
          query: {
            wilaya_id: wilayaId,
            property_type: propertyType || undefined,
            max_price: maxPrice,
            page,
            page_size: PAGE_SIZE,
          },
        },
      })
      .then((res) => {
        if (cancelled) return;
        const feed = unwrap(res);
        setStays(feed.items ?? []);
        setTotal(feed.total ?? 0);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [wilayaId, propertyType, maxPrice, page, retry]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const wilayaName = wilayas.find((w) => w.id === wilayaId)?.name;

  function resetPage(fn: () => void) {
    setPage(1);
    fn();
  }

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
            Pick a stay
          </h1>
          <p className="mt-1 text-sm text-moss">
            {total > 0
              ? `${total.toLocaleString("en-US")} real stays across Algeria — pick one and it becomes the start of your itinerary.`
              : "Real hotels, hostels and guesthouses from the ATHAR database."}
          </p>
        </header>

        {/* Chosen stay banner */}
        {chosen && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sea-foam bg-sea-foam/20 px-5 py-4">
            <div>
              <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
                Your sleeping spot
              </p>
              <p className="text-lg font-bold text-pine">{chosen.name}</p>
              <p className="text-xs text-moss">
                Wilaya {chosen.wilaya_id} ·{" "}
                {chosen.price_per_night_dzd.toLocaleString("en-US")} DZD/night
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/itinerary"
                className="rounded-full bg-pine px-5 py-2 text-xs font-normal text-white shadow-sm transition hover:bg-moss"
              >
                Go to itinerary →
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

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-champagne bg-white p-4 shadow-sm sm:grid-cols-3">
          <select
            value={wilayaId ?? ""}
            onChange={(e) =>
              resetPage(() =>
                setWilayaId(e.target.value ? Number(e.target.value) : undefined),
              )
            }
            aria-label="Filter by wilaya"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            <option value="">All wilayas</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id} — {w.name}
              </option>
            ))}
          </select>

          <select
            value={propertyType}
            onChange={(e) => resetPage(() => setPropertyType(e.target.value))}
            aria-label="Filter by property type"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            <option value="">All property types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={maxPrice ?? ""}
            onChange={(e) =>
              resetPage(() =>
                setMaxPrice(e.target.value ? Number(e.target.value) : undefined),
              )
            }
            aria-label="Max price per night"
            className="rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none"
          >
            <option value="">Any price</option>
            <option value={3000}>Under 3,000 DZD</option>
            <option value={6000}>Under 6,000 DZD</option>
            <option value={10000}>Under 10,000 DZD</option>
            <option value={15000}>Under 15,000 DZD</option>
          </select>
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-champagne" />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm text-amber-800">
              Could not load stays — is the API running?
            </p>
            <button
              onClick={() => setRetry((n) => n + 1)}
              className="mt-3 rounded-full bg-amber-800 px-4 py-1.5 text-xs font-normal text-white"
            >
              Retry
            </button>
          </div>
        )}

        {status === "ready" && stays.length === 0 && (
          <p className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-6 text-center text-sm text-moss">
            No stays match these filters.
          </p>
        )}

        {status === "ready" && stays.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stays.map((s) => {
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
                        Wilaya {s.wilaya_id}
                        {wilayaName ? ` — ${wilayaName}` : ""}
                      </p>
                      {s.description && (
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-moss">
                          {s.description}
                        </p>
                      )}
                      <p className="mt-3 font-semibold text-emerald-700">
                        {s.price_per_night_dzd.toLocaleString("en-US")} DZD
                        <span className="text-xs font-normal text-moss"> /night</span>
                      </p>
                      {s.amenities && s.amenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {s.amenities.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] text-moss"
                            >
                              {a}
                            </span>
                          ))}
                          {s.amenities.length > 4 && (
                            <span className="rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] text-moss">
                              +{s.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => chooseStay(s)}
                        className={`mt-3 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          isChosen
                            ? "border-pine bg-pine text-white hover:bg-moss"
                            : "border-sea-foam bg-sea-foam/20 text-pine hover:bg-sea-foam"
                        }`}
                      >
                        {isChosen ? "Chosen — my stay" : "Choose this stay"}
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
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-foam text-pine transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>
                <span className="text-xs font-normal text-moss">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-foam text-pine transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
