"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ArtisanRead } from "@/lib/types";
import { SAMPLE_ARTISANS } from "@/lib/sample-data";
import type { ArtisanCard } from "@/lib/sample-data";

const CRAFT_EMOJIS: Record<string, string> = {
  pottery: "🏺",
  "leather crafts": "👜",
  "carpets & textiles": "🧶",
  "silver jewellery": "💍",
  "coral & jewellery": "📿",
  woodcraft: "🪵",
  weaving: "🧵",
  embroidery: "🪡",
  calligraphy: "🖋️",
  "metal work": "⚒️",
  "glass work": "🫙",
};

function craftEmoji(craft: string): string {
  const key = craft.toLowerCase();
  return CRAFT_EMOJIS[key] ?? CRAFT_EMOJIS[key.split(" ")[0]] ?? "🛠️";
}

function toCard(a: ArtisanRead): ArtisanCard {
  const products = (a.photos ?? []).slice(0, 1).map((src) => ({
    label: a.craft_type,
    emoji: craftEmoji(a.craft_type),
    src,
  }));
  return {
    id: a.id,
    name: a.name,
    craft_type: a.craft_type,
    description: a.description ?? "A local artisan workshop.",
    latitude: a.latitude,
    longitude: a.longitude,
    products,
  };
}

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<ArtisanCard[]>(SAMPLE_ARTISANS);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/artisans", { params: { query: { page: 1, page_size: 50 } } })
      .then((res) => {
        if (cancelled) return;
        const feed = unwrap(res);
        if (feed.items.length > 0) setArtisans(feed.items.map(toCard));
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
      ? artisans
      : artisans.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.craft_type.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q),
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
          <h1 className="text-3xl font-bold text-zinc-900">All artisans</h1>
          <p className="mt-1 text-zinc-600">
            Craftspeople across Algeria, from Kabyle pottery to Tuareg silver.
            Visit a workshop or order a piece.
          </p>
        </header>

        <div className="mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artisans, crafts, workshops…"
            className="w-full max-w-md rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {status === "error" && artisans.length === 0 && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not reach the artisans API.
          </div>
        )}

        <p className="mb-4 text-sm text-zinc-500">
          {filtered.length} workshop{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Link
              key={a.id}
              href={`/artisans/${a.id}`}
              className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 text-2xl">
                  {a.products[0]?.emoji ?? craftEmoji(a.craft_type)}
                </div>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600">
                  {a.craft_type}
                </span>
              </div>
              <h2 className="mt-3 font-semibold text-zinc-900">{a.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                {a.description}
              </p>
              <p className="mt-3 text-xs font-medium text-emerald-700">
                Visit workshop →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
