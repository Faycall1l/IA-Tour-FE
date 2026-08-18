"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { categoryMeta, normalizeCategory } from "./categories";
import type { ExploreItem } from "./types";
import {
  itemCategory,
  itemDescription,
  itemName,
  itemPhotos,
  itemWilayaId,
} from "./types";

const ROTATE_MS = 3500;

export default function ActivityModal({
  item,
  wilayaNames,
  onClose,
}: {
  item: ExploreItem;
  wilayaNames: Record<number, string>;
  onClose: () => void;
}) {
  const photos = itemPhotos(item);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const name = itemName(item);
  const meta = categoryMeta(normalizeCategory(itemCategory(item)));
  const desc = itemDescription(item);
  const location = wilayaNames[itemWilayaId(item)] ?? "";
  const current = photos[Math.min(idx, Math.max(photos.length - 1, 0))];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg text-pine shadow transition hover:bg-champagne"
        >
          X
        </button>

        <div className="grid sm:grid-cols-2">
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-champagne/40 p-6 sm:min-h-[420px]">
            {photos.length > 0 ? (
              <>
                {photos.map((p, i) =>
                  i === 0 ? null : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={p}
                      alt=""
                      className={`absolute h-[60%] w-[72%] rounded-2xl border-4 border-white object-cover shadow-xl ${
                        i === 1 ? "-left-4 top-6 -rotate-6" : "-right-4 bottom-6 rotate-6"
                      }`}
                    />
                  ),
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={idx}
                  src={current}
                  alt={name}
                  className="absolute z-10 h-[72%] w-[76%] rounded-2xl border-4 border-white object-cover shadow-2xl"
                />
                {photos.length > 1 && (
                  <div className="absolute bottom-4 z-20 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(i)}
                        aria-label={`Photo ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          i === idx ? "w-5 bg-pine" : "w-2 bg-white/70 hover:bg-white"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-pine to-sea-foam text-sm font-bold text-white/60">
                No image
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <div className="rounded-3xl border-2 border-champagne bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-rustic-gold">
                {meta.label}
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-pine">
                {name}
              </h2>

              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                <FactChip>{location}</FactChip>
                {item.kind === "exp" && item.exp.duration_hours ? (
                  <FactChip>{item.exp.duration_hours}h</FactChip>
                ) : null}
                {item.kind === "exp" && item.exp.season ? (
                  <FactChip>{item.exp.season}</FactChip>
                ) : null}
                <FactChip>All ages</FactChip>
              </div>

              {desc && <p className="mt-4 text-sm leading-relaxed text-moss">{desc}</p>}

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                {item.kind === "exp" ? (
                  <>
                    {item.exp.price_dzd != null && (
                      <FactBox label="Price" value={`${item.exp.price_dzd} DZD`} />
                    )}
                    {item.exp.duration_hours != null && (
                      <FactBox label="Duration" value={`${item.exp.duration_hours} hours`} />
                    )}
                    {item.exp.max_participants != null && (
                      <FactBox label="Group" value={`Up to ${item.exp.max_participants}`} />
                    )}
                    {item.exp.meeting_point && (
                      <FactBox label="Meeting" value={item.exp.meeting_point} />
                    )}
                  </>
                ) : (
                  <>
                    {item.poi.entry_fee_dzd != null && (
                      <FactBox label="Entry fee" value={`${item.poi.entry_fee_dzd} DZD`} />
                    )}
                    {item.poi.price_level && (
                      <FactBox label="Price level" value={item.poi.price_level} />
                    )}
                    {item.poi.opening_hours && (
                      <FactBox label="Hours" value={item.poi.opening_hours} />
                    )}
                    {item.poi.suggested_duration_min != null && (
                      <FactBox label="Visit" value={`~${item.poi.suggested_duration_min} min`} />
                    )}
                  </>
                )}
              </div>

              {item.kind === "poi" && item.poi.fun_fact && (
                <p className="mt-4 rounded-2xl bg-champagne/40 p-3 text-xs italic text-moss">
                  Fun fact: {item.poi.fun_fact}
                </p>
              )}

              <div className="mt-5 border-t border-dashed border-champagne pt-3 text-center">
                <button
                  onClick={onClose}
                  className="rounded-full bg-sea-foam px-5 py-2 text-xs font-bold text-pine transition hover:bg-champagne"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-champagne/70 px-2.5 py-1 font-medium text-moss">
      {children}
    </span>
  );
}

function FactBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-champagne/80 bg-champagne/30 px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-rustic-gold">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-pine">{value}</p>
    </div>
  );
}
