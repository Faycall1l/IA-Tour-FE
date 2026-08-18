"use client";

import Link from "next/link";
import type { PickedStay } from "@/lib/itinerary";

type Props = {
  stay: PickedStay | null;
  wilayaName?: string;
  onRemove: () => void;
};

function mapsUrl(stay: PickedStay): string {
  if (stay.latitude != null && stay.longitude != null) {
    return `https://www.google.com/maps/search/?api=1&query=${stay.latitude},${stay.longitude}`;
  }
  if (stay.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      stay.address,
    )}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    stay.name,
  )}`;
}

export default function StayNode({ stay, wilayaName, onRemove }: Props) {
  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      {/* node marker */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rustic-gold text-base shadow-sm">
           
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-champagne to-sea-foam" />
      </div>

      <div className="min-w-0 flex-1 pb-2">
        {!stay ? (
          <Link href="/stays" className="group block">
            <div className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-5 transition hover:border-sea-foam hover:bg-champagne/30">
              <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
                Your stay — where you sleep
              </p>
              <p className="mt-1 text-sm text-moss">
                No stay yet. Every itinerary starts where you lay your head.
              </p>
              <span className="mt-3 inline-block rounded-full bg-sea-foam px-5 py-2 text-xs font-semibold text-pine shadow-sm transition group-hover:bg-champagne">
                Pick a stay →
              </span>
            </div>
          </Link>
        ) : (
          <article className="overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3 px-4 py-4">
              <div className="min-w-0">
                <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
                  Your stay
                </p>
                <Link
                  href={`/places/${stay.id}`}
                  className="mt-0.5 block truncate text-lg font-bold text-pine transition hover:text-rustic-gold"
                  title="More details about this place"
                >
                  {stay.name}
                </Link>
                <p className="mt-0.5 text-xs text-moss">
                  <span className="capitalize">{stay.property_type}</span>
                  {wilayaName ? ` · ${wilayaName}` : ` · Wilaya ${stay.wilaya_id}`}
                </p>
                <a
                  href={mapsUrl(stay)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-normal text-rustic-gold underline-offset-2 transition hover:text-pine hover:underline"
                >
                   Open in Maps
                </a>
              </div>

              <div className="flex shrink-0 items-start gap-2">
                <div className="text-right">
                  <p className="text-[10px] font-normal uppercase tracking-wide text-moss">
                    Per night
                  </p>
                  <p className="text-lg font-bold text-pine">
                    {stay.price_per_night_dzd.toLocaleString("en-US")}{" "}
                    <span className="text-xs font-normal text-moss">DZD</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    href="/stays"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-champagne bg-white text-xs text-moss transition hover:border-sea-foam hover:bg-sea-foam/20 hover:text-pine"
                    title="Edit stay"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </Link>
                  <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Remove stay"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-champagne bg-white text-xs text-moss transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
