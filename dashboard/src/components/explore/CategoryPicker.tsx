"use client";

import { categoryMeta } from "./categories";

export default function CategoryPicker({
  categories,
  selected,
  onToggle,
  onSurprise,
}: {
  categories: string[];
  selected: string[];
  onToggle: (c: string) => void;
  onSurprise: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((c) => {
        const meta = categoryMeta(c);
        const active = selected.includes(c);
        return (
          <button
            key={c}
            onClick={() => onToggle(c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-sea-foam text-pine shadow"
                : "border border-champagne bg-white text-moss hover:border-sea-foam hover:text-pine"
            }`}
          >
            <span className="mr-1.5">{meta.emoji}</span>
            {meta.label}
          </button>
        );
      })}
      <button
        onClick={onSurprise}
        className="rounded-full bg-rustic-gold px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pine"
      >
        🎲 Surprise me
      </button>
    </div>
  );
}
