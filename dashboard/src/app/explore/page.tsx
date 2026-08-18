"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { resolveMockPath } from "@/lib/mock-data";
import { WILAYA_NAMES } from "@/lib/sample-data";
import type {
  ExperienceFeed,
  ExperienceRead,
  PoiFeed,
  PoiRead,
  WilayaSummary,
} from "@/lib/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WilayaCarousel from "@/components/explore/WilayaCarousel";
import CategoryPicker from "@/components/explore/CategoryPicker";
import ActivityExplorer from "@/components/explore/ActivityExplorer";
import { buildCategories } from "@/components/explore/categories";

/**
 * The explore page is currently served from the offline mock dataset so the
 * design can be reviewed without the backend. Swap these initializers back to
 * `client.GET` (see src/lib/client.ts) once the API contract for this page is
 * ready. This is scoped to this page only — it does not touch the global
 * NEXT_PUBLIC_USE_MOCK_API flag.
 */
const mockExplorer = {
  wilayas: resolveMockPath(
    "/api/v1/discover/wilayas",
    new URLSearchParams(),
  ) as WilayaSummary[],
  pois: (resolveMockPath(
    "/api/v1/pois",
    new URLSearchParams({ page_size: "100" }),
  ) as PoiFeed).items,
  experiences: (resolveMockPath(
    "/api/v1/experiences",
    new URLSearchParams({ page_size: "100" }),
  ) as ExperienceFeed).items,
};

export default function ExplorePage() {
  const [wilayas] = useState<WilayaSummary[]>(mockExplorer.wilayas);
  const [pois] = useState<PoiRead[]>(mockExplorer.pois);
  const [experiences] = useState<ExperienceRead[]>(mockExplorer.experiences);
  const [selected, setSelected] = useState<string[]>([]);

  const poisByWilaya = useMemo(() => {
    const map = new Map<number, PoiRead[]>();
    for (const p of pois) {
      const bucket = map.get(p.wilaya_id) ?? [];
      bucket.push(p);
      map.set(p.wilaya_id, bucket);
    }
    return map;
  }, [pois]);

  const wilayaNames = useMemo(() => {
    const names: Record<number, string> = { ...WILAYA_NAMES };
    for (const w of wilayas) names[w.id] = w.name;
    return names;
  }, [wilayas]);

  const categories = useMemo(
    () => buildCategories(wilayas, pois, experiences),
    [wilayas, pois, experiences],
  );

  function surpriseMe() {
    if (categories.length === 0) return;
    const shuffled = [...categories].sort(() => Math.random() - 0.5);
    setSelected(shuffled.slice(0, Math.min(3, shuffled.length)));
  }

  function toggleCategory(c: string) {
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-24">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb segments={[{ label: "home", href: "/" }, { label: "Explore" }]} />

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            Don&apos;t know where to go?
          </h1>
          <p className="mt-1 text-sm text-moss">
            Flip through wilayas, then pick a vibe — we&apos;ll show you places
            and activities that fit.
          </p>
        </header>

        <WilayaCarousel wilayas={wilayas} poisByWilaya={poisByWilaya} />

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-pine">Pick a vibe</h2>
            <p className="text-sm text-moss">
              Choose one or several categories, or roll the dice.
            </p>
          </div>
          <CategoryPicker
            categories={categories}
            selected={selected}
            onToggle={toggleCategory}
            onSurprise={surpriseMe}
          />
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-bold text-pine">
              Places &amp; activities
            </h2>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-xs font-semibold text-rustic-gold hover:text-pine hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <ActivityExplorer
          pois={pois}
          experiences={experiences}
          wilayaNames={wilayaNames}
          selectedCategories={selected}
        />
        </section>
      </div>

      <Link
        href="/plan"
        className="fixed bottom-44 right-6 z-50 rounded-lg border-2 border-pine bg-white/70 px-4 py-1.5 text-xs font-bold text-pine shadow-lg backdrop-blur-sm transition hover:border-rustic-gold hover:bg-white/70 hover:text-rustic-gold hover:shadow-xl"
      >
        Start planning your trip
      </Link>
    </main>
  );
}
