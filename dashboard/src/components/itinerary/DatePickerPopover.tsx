"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Current ISO datetime for the node (local time), or null when unset. */
  value: string | null;
  onCommit: (iso: string | null) => void;
  /** Friendly short label shown on the trigger pill, e.g. "Wed, 14 Aug". */
  triggerLabel?: string;
  ariaLabel?: string;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}`;
}

/** Format a stored ISO string as a compact pill label. */
export function formatItineraryDate(iso: string | null): string {
  if (!iso) return "Add visit date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Add visit date";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function DatePickerPopover({
  value,
  onCommit,
  triggerLabel,
  ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => {
    const base = value ? new Date(value) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [day, setDay] = useState<number>(() => {
    const base = value ? new Date(value) : new Date();
    return base.getDate();
  });
  const [hour, setHour] = useState<number>(() => {
    const base = value ? new Date(value) : new Date();
    return base.getHours();
  });
  const [minute, setMinute] = useState<number>(() => {
    const base = value ? new Date(value) : new Date();
    return Math.round(base.getMinutes() / 5) * 5;
  });

  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (popRef.current && !popRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  function syncFromValue(nextValue: string | null) {
    const base = nextValue ? new Date(nextValue) : new Date();
    setView(new Date(base.getFullYear(), base.getMonth(), 1));
    setDay(base.getDate());
    setHour(base.getHours());
    setMinute(Math.round(base.getMinutes() / 5) * 5);
  }

  function toggleOpen() {
    if (!open) syncFromValue(value);
    setOpen((o) => !o);
  }

  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mo-first

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = new Date();

  function commit(clear = false) {
    if (clear) {
      onCommit(null);
      setOpen(false);
      return;
    }
    const d = new Date(year, month, day, hour, minute);
    onCommit(toIso(d));
    setOpen(false);
  }

  const label =
    triggerLabel ??
    (value ? formatItineraryDate(value) : "Add visit date");

  return (
    <div ref={popRef} className="relative inline-block">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={ariaLabel ?? label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="rounded-full border border-champagne bg-white px-3 py-1 text-[11px] font-normal text-moss shadow-sm transition hover:border-sea-foam hover:text-pine"
      >
        📅 {label}
        {value ? " ✎" : " +"}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Pick visit date and time"
          className="absolute left-0 z-30 mt-2 w-64 rounded-2xl border border-champagne bg-white p-3 shadow-xl"
        >
          {/* month nav */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setView(new Date(year, month - 1, 1))
              }
              aria-label="Previous month"
              className="flex h-7 w-7 items-center justify-center rounded-full text-pine transition hover:bg-sea-foam"
            >
              ‹
            </button>
            <p className="text-xs font-bold text-pine">
              {MONTHS[month]} {year}
            </p>
            <button
              type="button"
              onClick={() =>
                setView(new Date(year, month + 1, 1))
              }
              aria-label="Next month"
              className="flex h-7 w-7 items-center justify-center rounded-full text-pine transition hover:bg-sea-foam"
            >
              ›
            </button>
          </div>

          {/* weekday header */}
          <div className="mb-1 grid grid-cols-7 text-center text-[9px] font-semibold uppercase tracking-wide text-moss">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1">
                {w}
              </span>
            ))}
          </div>

          {/* day grid */}
          <div className="grid grid-cols-7 text-center">
            {cells.map((c, i) => {
              if (c === null) return <span key={`blank-${i}`} />;
              const isSelected = c === day;
              const isToday =
                c === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDay(c)}
                  aria-pressed={isSelected}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition ${
                    isSelected
                      ? "bg-rustic-gold font-bold text-white"
                      : "text-pine hover:bg-sea-foam"
                  }`}
                >
                  {c}
                  {isToday && !isSelected && (
                    <span className="absolute mt-5 h-1 w-1 rounded-full bg-moss" />
                  )}
                </button>
              );
            })}
          </div>

          {/* time pickers */}
          <div className="mt-3 flex items-center gap-2">
            <label className="flex flex-1 flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-moss">
                Hour
              </span>
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="rounded-lg border border-champagne bg-white px-2 py-1.5 text-xs text-pine focus:border-rustic-gold focus:outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {pad2(h)}
                  </option>
                ))}
              </select>
            </label>
            <span className="pt-4 text-xs text-moss">:</span>
            <label className="flex flex-1 flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-moss">
                Minute
              </span>
              <select
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="rounded-lg border border-champagne bg-white px-2 py-1.5 text-xs text-pine focus:border-rustic-gold focus:outline-none"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {pad2(m)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* actions */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => commit(true)}
              className="rounded-full border border-champagne px-3 py-1.5 text-[11px] font-normal text-moss transition hover:border-amber-200 hover:text-amber-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => commit(false)}
              className="rounded-full bg-pine px-4 py-1.5 text-[11px] font-semibold text-white transition hover:bg-moss"
            >
              Set visit date
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
