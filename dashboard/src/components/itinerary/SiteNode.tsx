"use client";

import Link from "next/link";
import type { ProviderUserRead } from "@/lib/types";
import type { PickedSite } from "@/lib/itinerary";
import DatePickerPopover from "./DatePickerPopover";

type Props = {
  index: number;
  total: number;
  site: PickedSite;
  guides: ProviderUserRead[];
  date: string | null;
  onSetDate: (iso: string | null) => void;
  onRemoveSite: (siteId: string) => void;
  onMove: (dir: -1 | 1) => void;
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

function GuideAvatar({ guide }: { guide: ProviderUserRead }) {
  const name = guide.display_name ?? guide.profile?.company_name ?? "Guide";
  const langs = guide.languages?.slice(0, 3) ?? [];
  return (
    <Link
      href={`/guides/${guide.id}`}
      className="group flex w-16 flex-col items-center gap-1"
      title={`${name} — local tourist guide`}
    >
      <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-sea-foam bg-champagne text-sm font-bold text-pine shadow-sm transition group-hover:border-rustic-gold">
        {guide.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={guide.avatar_url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          initials(name)
        )}
      </span>
      <span className="w-full truncate text-center text-[8px] font-semibold text-pine group-hover:text-rustic-gold">
        {name}
      </span>
      {langs.length > 0 && (
        <span className="w-full truncate text-center text-[7px] text-moss">
          {langs.join(" · ")}
        </span>
      )}
    </Link>
  );
}

export default function SiteNode({
  index,
  total,
  site,
  guides,
  date,
  onSetDate,
  onRemoveSite,
  onMove,
}: Props) {
  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      {/* node marker */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-foam text-sm font-bold text-pine shadow-sm">
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-champagne to-sea-foam" />
      </div>

      <div className="min-w-0 flex-1 pb-2">
        <article className="overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
          {/* visit date */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-champagne/60 bg-champagne/30 px-4 py-2">
            <span className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
              Visit date
            </span>
            <DatePickerPopover
              value={date}
              onCommit={onSetDate}
              ariaLabel={`Set visit date for ${site.name}`}
            />
          </div>

          {/* site photo */}
          {site.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={site.photo_url}
              alt={site.name}
              className="h-32 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-3xl font-bold text-pine">
              {site.category.slice(0, 1).toUpperCase()}
            </div>
          )}

          {/* name + actions */}
          <div className="flex flex-wrap items-start justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <Link
                href={`/pois/${site.id}`}
                className="block truncate text-base font-bold text-pine transition hover:text-rustic-gold"
                title="More details about this site"
              >
                {site.name}
              </Link>
              <p className="mt-0.5 text-[10px] font-normal uppercase tracking-wider text-rustic-gold">
                {site.category}
              </p>
              <p className="text-[10px] text-moss">
                📍 {site.wilaya_name}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onMove(-1)}
                disabled={index === 0}
                aria-label={`Move ${site.name} earlier`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne bg-white text-pine transition hover:bg-sea-foam disabled:cursor-not-allowed disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                disabled={index >= total - 1}
                aria-label={`Move ${site.name} later`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne bg-white text-pine transition hover:bg-sea-foam disabled:cursor-not-allowed disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onRemoveSite(site.id)}
                aria-label={`Remove ${site.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-champagne bg-white text-xs text-moss transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
              >
                ×
              </button>
            </div>
          </div>

          {/* tourist guides at this site */}
          {guides.length > 0 && (
            <div className="border-t border-champagne/60 bg-champagne/20 px-4 py-3">
              <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
                Tourist guides here
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {guides.slice(0, 6).map((g) => (
                  <GuideAvatar key={g.id} guide={g} />
                ))}
                {guides.length > 6 && (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-rustic-gold text-xs font-bold text-rustic-gold">
                    +{guides.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
