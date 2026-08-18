"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ArtisanRead } from "@/lib/types";
import type { ArtisanCard } from "@/lib/sample-data";
import AlgeriaMap from "@/components/AlgeriaMap";

const ROTATION_MS = 20000;

function craftEmoji(craft: string): string {
  return craft;
}

function toCard(a: ArtisanRead): ArtisanCard {
  const products = (a.photos ?? []).slice(0, 4).map((src) => ({
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

export default function ArtisansSection() {
  const [artisans, setArtisans] = useState<ArtisanCard[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/artisans", { params: { query: { page: 1, page_size: 12 } } })
      .then((res) => {
        if (cancelled) return;
        const feed = unwrap(res);
        setArtisans(feed.items.map(toCard));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (artisans.length <= 1) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % artisans.length),
      ROTATION_MS,
    );
    return () => clearInterval(t);
  }, [artisans.length]);

  const artisan = artisans[index];
  const displayProducts = (artisan?.products ?? []).slice(0, 3);

  return (
    <section id="artisans" className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
            Artisanal arts
          </p>
          <h2 className="mt-1 text-2xl font-bold text-pine">
            Explore artisanal arts
          </h2>
        </div>

        {status === "loading" && artisans.length === 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            <div className="h-64 animate-pulse rounded-2xl bg-champagne lg:col-span-3" />
            <div className="h-64 animate-pulse rounded-2xl bg-champagne lg:col-span-2" />
          </div>
        )}

        {status === "error" && artisans.length === 0 && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not load artisans from the API.
          </p>
        )}

        {artisan && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div
              key={artisan.id}
              className="flex h-full flex-col justify-between rounded-2xl border border-champagne bg-white p-3 shadow-sm transition-opacity duration-700"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-rustic-gold">
                      {artisan.craft_type}
                    </p>
                    <h3 className="mt-0.5 text-base font-bold text-pine">
                      {artisan.name}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-champagne px-2.5 py-0.5 text-[11px] font-medium text-moss">
                    {craftEmoji(artisan.craft_type)} workshop
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-moss">
                  {artisan.description}
                </p>
              </div>

              {displayProducts.length > 0 && (
                <div className="mt-2.5 flex justify-center">
                  <div className="inline-flex gap-1.5 overflow-hidden rounded-lg bg-white p-1">
                    {displayProducts.map((p, i) => (
                      <div key={i} className="w-24 shrink-0 border border-champagne bg-white">
                        {p.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.src}
                            alt={p.label}
                            className="aspect-square w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-xl">
                            {p.emoji}
                          </div>
                        )}
                        <p className="px-1 py-0.5 text-[10px] font-medium text-moss">
                          {p.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link
              href="/artisans"
              className="flex w-full items-center justify-center rounded-full border border-champagne px-4 py-2 text-sm font-medium text-moss transition hover:border-rustic-gold hover:text-rustic-gold"
            >
              See more artisans →
            </Link>

            <div className="flex-1 rounded-2xl border border-champagne bg-white p-2.5 shadow-sm">
              <p className="mb-1.5 text-xs font-semibold text-moss">
                Where the craft happens
              </p>
              <AlgeriaMap
                className="h-32 w-full"
                longitude={artisan.longitude}
                latitude={artisan.latitude}
                label={artisan.name.split(" ")[0]}
              />
            </div>
          </div>
        </div>
        )}

        {artisan && (
        <div className="mt-4 flex items-center gap-2">
          {artisans.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setIndex(i)}
              aria-label={`Show ${a.name}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-rustic-gold" : "w-2 bg-champagne hover:bg-rustic-gold"
              }`}
            />
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
