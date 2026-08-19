"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import { WILAYA_NAMES } from "@/lib/sample-data";
import type {
  ExperienceRead,
  PoiRead,
  WilayaSummary,
} from "@/lib/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WilayaCarousel from "@/components/explore/WilayaCarousel";
import CategoryPicker from "@/components/explore/CategoryPicker";
import ActivityExplorer from "@/components/explore/ActivityExplorer";
import { buildCategories } from "@/components/explore/categories";

export default function ExplorePage() {
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [pois, setPois] = useState<PoiRead[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [wRes, pRes, eRes] = await Promise.all([
          client.GET("/api/v1/discover/wilayas"),
          client.GET("/api/v1/pois", { params: { query: { page_size: 200 } } }),
          client.GET("/api/v1/experiences", { params: { query: { page_size: 100 } } }),
        ]);
        if (cancelled) return;
        setWilayas(unwrap(wRes));
        setPois(unwrap(pRes).items);
        setExperiences(unwrap(eRes).items);
      } catch {
        // silently leave arrays empty
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
