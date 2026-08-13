"use client";

import WilayaSelect from "@/components/selects/WilayaSelect";

const selectClass =
  "rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none";

export const EXPERIENCE_CATEGORIES = [
  "tour",
  "cultural",
  "adventure",
  "hiking",
  "wellness",
  "food",
  "nature",
  "desert",
  "city",
];

export type OffersSort = "featured" | "price-asc" | "price-desc" | "duration";

export default function OffersFilterBar({
  wilayaId,
  category,
  sort,
  onChange,
}: {
  wilayaId: number | undefined;
  category: string;
  sort: OffersSort;
  onChange: (next: {
    wilayaId?: number;
    category?: string;
    sort?: OffersSort;
  }) => void;
}) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 rounded-2xl border border-champagne bg-white p-4 shadow-sm sm:grid-cols-3">
      <WilayaSelect
        value={wilayaId}
        onChange={(id) => onChange({ wilayaId: id })}
      />
      <select
        value={category}
        onChange={(e) => onChange({ category: e.target.value })}
        aria-label="Filter by category"
        className={selectClass}
      >
        <option value="">All categories</option>
        {EXPERIENCE_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => onChange({ sort: e.target.value as OffersSort })}
        aria-label="Sort offers"
        className={selectClass}
      >
        <option value="featured">Sort: featured</option>
        <option value="price-asc">Price: low → high</option>
        <option value="price-desc">Price: high → low</option>
        <option value="duration">Duration: longest</option>
      </select>
    </div>
  );
}
