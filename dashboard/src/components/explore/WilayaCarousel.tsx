"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PoiRead, WilayaSummary } from "@/lib/types";

const ROTATE_MS = 6000;

export default function WilayaCarousel({
  wilayas,
  poisByWilaya,
}: {
  wilayas: WilayaSummary[];
  poisByWilaya: Map<number, PoiRead[]>;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (wilayas.length === 0 || paused) return;
    const el = scroller.current;
    if (!el) return;
    const timer = setInterval(() => {
      const first = el.children[0] as HTMLElement | undefined;
      const cardWidth = first?.getBoundingClientRect().width ?? 0;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + cardWidth + 24;
      el.scrollTo({ left: next > maxScroll ? 0 : next, behavior: "smooth" });
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [wilayas.length, paused]);

  return (
    <section className="mb-14">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-pine">Destinations</h2>
          <p className="text-sm text-moss">
            It rotates by itself every few seconds — swipe for more wilayas.
          </p>
        </div>
        <span className="hidden rounded-full bg-champagne px-3 py-1 text-[11px] font-semibold text-rustic-gold sm:inline-block">
          {wilayas.length} wilayas
        </span>
      </div>

      {wilayas.length === 0 ? (
        <div className="h-52 animate-pulse rounded-3xl bg-champagne" />
      ) : (
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {wilayas.map((w) => (
            <WilayaCard
              key={w.id}
              wilaya={w}
              pois={poisByWilaya.get(w.id) ?? []}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function WilayaCard({
  wilaya,
  pois,
}: {
  wilaya: WilayaSummary;
  pois: PoiRead[];
}) {
  const mainPhoto = wilaya.highlight_poi_photo ?? pois[0]?.photo_url;
  return (
    <div className="group flex h-52 w-[300px] shrink-0 snap-center overflow-hidden rounded-3xl border border-champagne bg-white shadow-sm transition hover:shadow-xl sm:w-[560px]">
      <div className="relative w-1/2 overflow-hidden">
        <Link
          href={`/wilayas/${wilaya.id}`}
          className="absolute inset-0 z-10"
          aria-label={`Go to ${wilaya.name}`}
        />
        {mainPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainPhoto}
            alt={wilaya.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-pine via-sea-foam to-champagne" />
        )}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
        <p className="absolute left-3 top-3 z-20 text-xl font-bold tracking-tight text-white drop-shadow-md">
          {wilaya.name}
        </p>
      </div>

      <div className="grid w-1/2 grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
        {pois[0] && <MosaicTile poi={pois[0]} className="row-span-2" />}
        {pois[1] && <MosaicTile poi={pois[1]} />}
        {pois[2] && <MosaicTile poi={pois[2]} />}
      </div>
    </div>
  );
}

function MosaicTile({
  poi,
  className = "",
}: {
  poi: PoiRead;
  className?: string;
}) {
  return (
    <Link
      href={`/pois/${poi.id}`}
      className={`relative min-h-0 overflow-hidden rounded-2xl ${className}`}
      aria-label={`Go to ${poi.name}`}
    >
      {poi.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poi.photo_url}
          alt={poi.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-champagne to-sea-foam/70" />
      )}
      <span className="absolute bottom-1.5 left-1.5 max-w-[92%] truncate rounded-lg bg-black/45 px-1.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
        {poi.name}
      </span>
    </Link>
  );
}
