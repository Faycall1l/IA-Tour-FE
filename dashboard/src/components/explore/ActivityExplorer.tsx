"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExperienceRead, PoiRead } from "@/lib/types";
import { categoryMeta, normalizeCategory } from "./categories";
import type { ExploreItem } from "./types";
import {
  itemCategory,
  itemDescription,
  itemName,
  itemPhotos,
  itemWilayaId,
} from "./types";
import ActivityModal from "./ActivityModal";

const PER_PAGE = 6;

export default function ActivityExplorer({
  pois,
  experiences,
  wilayaNames,
  selectedCategories,
}: {
  pois: PoiRead[];
  experiences: ExperienceRead[];
  wilayaNames: Record<number, string>;
  selectedCategories: string[];
}) {
  const [open, setOpen] = useState<ExploreItem | null>(null);
  const [page, setPage] = useState(0);

  const items = useMemo<ExploreItem[]>(() => {
    const all: ExploreItem[] = [
      ...pois.map((poi): ExploreItem => ({ kind: "poi", poi })),
      ...experiences.map((exp): ExploreItem => ({ kind: "exp", exp })),
    ];
    if (selectedCategories.length === 0) return all;
    return all.filter((it) =>
      selectedCategories.includes(normalizeCategory(itemCategory(it))),
    );
  }, [pois, experiences, selectedCategories]);

  const totalPages = Math.ceil(items.length / PER_PAGE);
  const slice = items.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  useEffect(() => setPage(0), [selectedCategories]);

  return (
    <div>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-champagne bg-champagne/30 p-10 text-center">
          <p className="mt-2 text-sm font-bold text-pine">Nothing here yet</p>
          <p className="mt-1 text-xs text-moss">
            Try another category, or let the dice decide.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {slice.map((it) => (
              <ActivityCard
                key={it.kind + (it.kind === "poi" ? it.poi.id : it.exp.id)}
                item={it}
                wilayaNames={wilayaNames}
                onClick={() => setOpen(it)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setPage((p) => Math.max(0, p - 1));
                  setOpen(null);
                }}
                disabled={page === 0}
                className="rounded-full bg-champagne px-4 py-1.5 text-sm font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30 disabled:hover:bg-champagne disabled:hover:text-pine"
              >
                ← Prev
              </button>
              <span className="px-3 text-sm text-moss">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => {
                  setPage((p) => Math.min(totalPages - 1, p + 1));
                  setOpen(null);
                }}
                disabled={page >= totalPages - 1}
                className="rounded-full bg-champagne px-4 py-1.5 text-sm font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30 disabled:hover:bg-champagne disabled:hover:text-pine"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {open && (
        <ActivityModal
          item={open}
          wilayaNames={wilayaNames}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}

function ActivityCard({
  item,
  wilayaNames,
  onClick,
}: {
  item: ExploreItem;
  wilayaNames: Record<number, string>;
  onClick: () => void;
}) {
  const name = itemName(item);
  const meta = categoryMeta(normalizeCategory(itemCategory(item)));
  const desc = itemDescription(item);
  const photos = itemPhotos(item);
  const location = wilayaNames[itemWilayaId(item)] ?? "";

  const facts: string[] = [];
  if (location) facts.push(location);
  if (item.kind === "exp" && item.exp.duration_hours) {
    facts.push(`${item.exp.duration_hours}h`);
  }
  facts.push("All ages");

  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl border border-champagne bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-44 overflow-hidden">
        {photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[0]}
            alt={name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-4xl">
            {meta.emoji}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
          {meta.emoji} {meta.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold leading-tight text-pine">{name}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {facts.map((f) => (
            <span
              key={f}
              className="rounded-full bg-champagne/70 px-2 py-0.5 text-[11px] font-medium text-moss"
            >
              {f}
            </span>
          ))}
        </div>
        {desc && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-moss">{desc}</p>
        )}
        <span className="mt-auto pt-3 text-xs font-bold text-rustic-gold transition group-hover:text-pine">
          More →
        </span>
      </div>
    </button>
  );
}
