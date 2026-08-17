import type { ExperienceRead, PoiRead, WilayaSummary } from "@/lib/types";

export const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  heritage: { label: "Heritage", emoji: "🏛" },
  culture: { label: "Culture", emoji: "🎭" },
  nature: { label: "Nature", emoji: "🌿" },
  coast: { label: "Coast", emoji: "🌊" },
  crafts: { label: "Crafts", emoji: "🧶" },
  desert: { label: "Desert", emoji: "🏜" },
  trekking: { label: "Trekking", emoji: "🥾" },
  adventure: { label: "Adventure", emoji: "🧗" },
  seafood: { label: "Seafood", emoji: "🐟" },
  beach: { label: "Beach", emoji: "🏖" },
};

export function normalizeCategory(raw: string): string {
  const key = raw.trim().toLowerCase();
  if (key === "cultural") return "culture";
  if (key === "adventures" || key === "adventurous") return "adventure";
  return key;
}

export function categoryMeta(key: string): { label: string; emoji: string } {
  return CATEGORY_META[key] ?? { label: key, emoji: "✨" };
}

export function buildCategories(
  wilayas: WilayaSummary[],
  pois: PoiRead[],
  experiences: ExperienceRead[],
): string[] {
  const set = new Set<string>();
  for (const w of wilayas) for (const c of w.top_categories) set.add(normalizeCategory(c));
  for (const p of pois) set.add(normalizeCategory(p.category));
  for (const e of experiences) set.add(normalizeCategory(e.category));
  const order = [
    "heritage",
    "culture",
    "nature",
    "coast",
    "desert",
    "trekking",
    "adventure",
    "crafts",
    "seafood",
    "beach",
  ];
  return [...set].filter(Boolean).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
