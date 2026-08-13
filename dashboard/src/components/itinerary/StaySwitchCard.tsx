"use client";

import Link from "next/link";
import type { PickedStay } from "@/lib/itinerary";

type Props = {
  fromName: string;
  fromWilayaName: string;
  wilayaName: string;
  candidates: PickedStay[];
  chosen: PickedStay | null;
  onChoose: (stay: PickedStay) => void;
};

export default function StaySwitchCard({
  fromName,
  fromWilayaName,
  wilayaName,
  candidates,
  chosen,
  onChoose,
}: Props) {
  const options =
    chosen && !candidates.some((c) => c.id === chosen.id)
      ? [chosen, ...candidates]
      : candidates;

  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      {/* node marker — this is a sleeping stop on the trip */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pine text-base shadow-sm">
          🌙
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-sea-foam to-champagne" />
      </div>

      <div className="min-w-0 flex-1 pb-2">
        <div className="rounded-2xl border border-rustic-gold/40 bg-champagne/30 p-4">
          <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
            Switch your stay
          </p>
          <p className="mt-1 font-bold text-pine">
            Sleep in {wilayaName} instead of flying back to {fromWilayaName}
          </p>
          <p className="mt-1 text-xs text-moss">
            {fromName} is too far for a nightly round trip — check into a place
            near {wilayaName} and explore from there.
          </p>

          {options.length === 0 && (
            <p className="mt-3 rounded-xl border border-champagne bg-white px-3 py-2 text-xs text-moss">
              No stays in {wilayaName} yet —{" "}
              <Link
                href="/stays"
                className="font-semibold text-rustic-gold hover:underline"
              >
                browse the stays page
              </Link>
              .
            </p>
          )}

          {options.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {options.map((c) => {
                const isChosen = chosen?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onChoose(c)}
                    aria-pressed={isChosen}
                    className={`rounded-xl border px-3 py-2 text-left transition ${
                      isChosen
                        ? "border-pine bg-pine text-white"
                        : "border-champagne bg-white text-moss hover:border-sea-foam hover:text-pine"
                    }`}
                  >
                    <span className="block text-xs font-semibold">{c.name}</span>
                    <span
                      className={`block text-[10px] ${
                        isChosen ? "text-white/80" : "text-moss"
                      }`}
                    >
                      {c.price_per_night_dzd.toLocaleString("en-US")} DZD/night
                      {isChosen ? " · ✓ staying here" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
