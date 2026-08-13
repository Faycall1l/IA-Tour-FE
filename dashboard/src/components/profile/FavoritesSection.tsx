"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { FavoriteRead } from "@/lib/types";
import { LoadingPanel, ErrorPanel, EmptyPanel } from "@/components/ui/StatePanel";

const ENTITY_PATHS: Record<string, string> = {
  poi: "/pois",
  stay: "/stays",
  experience: "/offers",
};

const ENTITY_LABELS: Record<string, string> = {
  poi: "POI",
  stay: "Stay",
  experience: "Experience",
};

/**
 * Profile favorites: lists the authenticated user's favorites, newest first,
 * with an optional entity-type filter. Each row links to the entity's page.
 */
export default function FavoritesSection() {
  const [favorites, setFavorites] = useState<FavoriteRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [filter, setFilter] = useState<string>("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/favorites", {
        params: { query: { entity_type: filter || null } },
      })
      .then((res) => {
        if (cancelled) return;
        setFavorites(unwrap(res).items ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [filter, retry]);

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-pine">Favorites</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by save type"
          className="rounded-lg border border-champagne bg-white px-3 py-1.5 text-xs text-pine focus:border-rustic-gold focus:outline-none"
        >
          <option value="">All saves</option>
          <option value="poi">POIs</option>
          <option value="stay">Stays</option>
          <option value="experience">Experiences</option>
        </select>
      </div>

      <div className="mt-4">
        {status === "loading" && <LoadingPanel />}
        {status === "error" && (
          <ErrorPanel
            message="Could not load favorites."
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}
        {status === "ready" && favorites.length === 0 && (
          <EmptyPanel title="No favorites yet — save places you love." />
        )}
        {status === "ready" && favorites.length > 0 && (
          <ul className="divide-y divide-champagne/60">
            {favorites.map((f) => {
              const base = ENTITY_PATHS[f.entity_type] ?? "/places";
              return (
                <li key={f.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-pine">
                      {ENTITY_LABELS[f.entity_type] ?? f.entity_type}
                    </p>
                    <p className="text-xs text-moss">
                      {new Date(f.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`${base}/${f.entity_id}`}
                    className="shrink-0 rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                  >
                    View →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}