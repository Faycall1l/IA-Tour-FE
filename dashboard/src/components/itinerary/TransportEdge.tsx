"use client";

import type { RouteStatus, TransportOption } from "./types";
import {
  calendarUrl,
  formatDuration,
  hasScheduleCalendar,
  modeIcon,
  modeLabel,
  websiteLabel,
} from "./modes";

type Props = {
  fromName: string;
  toName: string;
  heading?: string;
  data: RouteStatus;
  chosen: string | null;
  onChoose: (mode: string) => void;
};

function suggestedOption(options: TransportOption[]): TransportOption {
  const nonDriving = options
    .filter((o) => o.mode !== "driving" && o.duration_min != null)
    .sort((a, b) => (a.duration_min ?? Infinity) - (b.duration_min ?? Infinity));
  const pool = nonDriving.length > 0 ? nonDriving : options;
  return pool.sort(
    (a, b) => (a.duration_min ?? Infinity) - (b.duration_min ?? Infinity),
  )[0];
}

export default function TransportEdge({
  fromName,
  toName,
  heading,
  data,
  chosen,
  onChoose,
}: Props) {
  const options = data.route?.options ?? [];
  const selectedMode =
    chosen && options.some((o) => o.mode === chosen) ? chosen : null;
  const selected =
    options.find((o) => o.mode === selectedMode) ?? suggestedOption(options);
  const suggested = suggestedOption(options);

  return (
    <div className="flex items-stretch gap-3 sm:gap-5">
      {/* connector — a plain line, transport is NOT a node */}
      <div className="flex w-10 flex-col items-center">
        <div className="w-px flex-1 bg-gradient-to-b from-champagne to-sea-foam" />
      </div>

      <div className="flex-1 pb-2">
        <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
          {heading ?? `Getting from ${fromName} to ${toName}`}
        </p>

        {data.status === "loading" && (
          <div className="mt-2 h-9 animate-pulse rounded-full bg-champagne/70" />
        )}

        {data.status === "error" && (
          <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Could not load transport options for this leg.
          </p>
        )}

        {data.status === "ready" && options.length === 0 && (
          <p className="mt-2 rounded-xl border border-champagne bg-champagne/20 px-3 py-2 text-xs text-moss">
            No scheduled line on this leg — plan a cab or drive.
            {data.route?.driving_time_minutes != null
              ? ` (${formatDuration(data.route.driving_time_minutes)})`
              : ""}
          </p>
        )}

        {data.status === "ready" && options.length > 0 && selected && (
          <>
            {/* the edge line with the chosen transport written on it */}
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl border border-champagne bg-white px-4 py-3 shadow-sm">
              <span className="text-sm">
                {modeIcon(selected.mode)} {modeLabel(selected.mode)}
                {selected.duration_min != null && (
                  <span className="ml-1 text-xs text-moss">
                    · {formatDuration(selected.duration_min)}
                  </span>
                )}
              </span>

              {(() => {
                const cal = hasScheduleCalendar(selected.mode)
                  ? calendarUrl(selected)
                  : null;
                if (!cal) return null;
                return (
                  <a
                    href={cal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-champagne px-3 py-1 text-[11px] font-semibold text-pine transition hover:bg-rustic-gold hover:text-white"
                  >
                    🗓 Calendar · {websiteLabel(cal)} ↗
                  </a>
                );
              })()}

              {/* switch line — small inline chips */}
              {options.length > 1 && (
                <span className="ml-auto flex flex-wrap gap-1">
                  {options.map((opt) => {
                    const isSelected = opt.mode === selected.mode;
                    const isSuggested = opt.mode === suggested.mode;
                    return (
                      <button
                        key={opt.mode}
                        type="button"
                        onClick={() => onChoose(opt.mode)}
                        aria-pressed={isSelected}
                        title={modeLabel(opt.mode)}
                        className={`relative rounded-full border px-2 py-0.5 text-[10px] transition ${
                          isSelected
                            ? "border-sea-foam bg-sea-foam/40 font-semibold text-pine"
                            : "border-champagne bg-white text-moss hover:border-sea-foam hover:text-pine"
                        }`}
                      >
                        {modeIcon(opt.mode)} {modeLabel(opt.mode)}
                        {isSuggested && !isSelected && (
                          <span className="absolute -top-1.5 -right-1 rounded-full bg-rustic-gold px-1 text-[7px] font-semibold uppercase text-white">
                            Best
                          </span>
                        )}
                      </button>
                    );
                  })}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
