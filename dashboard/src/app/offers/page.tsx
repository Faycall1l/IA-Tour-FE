"use client";

import { useEffect, useMemo, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ExperienceRead } from "@/lib/types";
import ExperienceCard from "@/components/cards/ExperienceCard";
import OffersFilterBar, {
  type OffersSort,
} from "@/components/offers/OffersFilterBar";
import SectionHeading from "@/components/ui/SectionHeading";
import { LoadingGrid, ErrorPanel, EmptyPanel } from "@/components/ui/StatePanel";

const PAGE_SIZE = 12;

export default function OffersPage() {
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [wilayaId, setWilayaId] = useState<number | undefined>();
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<OffersSort>("featured");
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/experiences", {
        params: {
          query: {
            wilaya_id: wilayaId,
            category: category || undefined,
            status: "active",
            page,
            page_size: PAGE_SIZE,
          },
        },
      })
      .then((res) => {
        if (cancelled) return;
        const feed = unwrap(res);
        setExperiences(feed.items ?? []);
        setTotal(feed.total ?? 0);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [wilayaId, category, page, retry]);

  const sorted = useMemo(() => {
    const list = [...experiences];
    switch (sort) {
      case "price-asc":
        return list.sort(
          (a, b) => (a.price_dzd ?? Infinity) - (b.price_dzd ?? Infinity),
        );
      case "price-desc":
        return list.sort(
          (a, b) => (b.price_dzd ?? -1) - (a.price_dzd ?? -1),
        );
      case "duration":
        return list.sort(
          (a, b) => (b.duration_hours ?? 0) - (a.duration_hours ?? 0),
        );
      default:
        return list;
    }
  }, [experiences, sort]);

  function applyFilter(next: {
    wilayaId?: number;
    category?: string;
    sort?: OffersSort;
  }) {
    if (next.sort) setSort(next.sort);
    else {
      setPage(1);
      if (next.wilayaId !== undefined) setWilayaId(next.wilayaId);
      if (next.category !== undefined) setCategory(next.category);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          backHref="/"
          backLabel="Home"
          eyebrow="Experiences & tours"
          title="Browse offers"
          subtitle={`${total.toLocaleString("en-US")} real tours and experiences across Algeria`}
          center
        />

        <OffersFilterBar
          wilayaId={wilayaId}
          category={category}
          sort={sort}
          onChange={applyFilter}
        />

        {status === "loading" && <LoadingGrid count={8} />}

        {status === "error" && (
          <ErrorPanel
            message="Could not load offers — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {status === "ready" && experiences.length === 0 && (
          <EmptyPanel title="No offers match these filters." />
        )}

        {status === "ready" && experiences.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sorted.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
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
