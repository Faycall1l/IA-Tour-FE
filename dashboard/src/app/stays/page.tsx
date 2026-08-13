"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { StayRead, WilayaSummary } from "@/lib/types";
import StayCard from "@/components/cards/StayCard";
import { LoadingGrid, ErrorPanel, EmptyPanel } from "@/components/ui/StatePanel";
import SectionHeading from "@/components/ui/SectionHeading";

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
        <SectionHeading
          backHref="/"
          backLabel="Home"
          eyebrow="Where to sleep"
          title="Pick a stay"
          subtitle={
            total > 0
              ? `${total.toLocaleString("en-US")} real stays across Algeria`
              : "Real hotels, hostels and guesthouses from the ATHAR database."
          }
          center
        />

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

        {status === "loading" && <LoadingGrid count={8} />}

        {status === "error" && (
          <ErrorPanel
            message="Could not load stays — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {status === "ready" && stays.length === 0 && (
          <EmptyPanel title="No stays match these filters." />
        )}

        {status === "ready" && stays.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stays.map((s) => (
                <StayCard key={s.id} stay={s} wilayaName={wilayaName} />
              ))}
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
