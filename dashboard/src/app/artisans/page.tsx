"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ArtisanRead } from "@/lib/types";
import ArtisanCard from "@/components/cards/ArtisanCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ErrorPanel, EmptyPanel } from "@/components/ui/StatePanel";

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<ArtisanRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [query, setQuery] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/artisans", { params: { query: { page: 1, page_size: 50 } } })
      .then((res) => {
        if (cancelled) return;
        setArtisans(unwrap(res).items);
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
  const filtered =
    q.length === 0
      ? artisans
      : artisans.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.craft_type.toLowerCase().includes(q) ||
            (a.description ?? "").toLowerCase().includes(q),
        );

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          backHref="/"
          backLabel="Home"
          eyebrow="Craftspeople"
          title="All artisans"
          subtitle="Craftspeople across Algeria, from Kabyle pottery to Tuareg silver. Visit a workshop or order a piece."
        />

        <div className="mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artisans, crafts, workshops…"
            className="w-full max-w-md rounded-xl border border-champagne bg-white px-4 py-2.5 text-sm text-pine placeholder-zinc-400 focus:border-rustic-gold focus:outline-none focus:ring-2 focus:ring-champagne"
          />
        </div>

        {status === "error" && artisans.length === 0 && (
          <div className="mb-6">
            <ErrorPanel
              message="Could not reach the artisans API."
              onRetry={() => setRetry((n) => n + 1)}
            />
          </div>
        )}

        {status === "ready" && filtered.length === 0 && (
          <EmptyPanel title="No artisans match your search." />
        )}

        <p className="mb-4 text-sm text-moss">
          {filtered.length} workshop{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArtisanCard key={a.id} artisan={a} />
          ))}
        </div>
      </div>
    </main>
  );
}
