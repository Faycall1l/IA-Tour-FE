"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type {
  ArtisanRead,
  ArtisanTransitAccessRead,
} from "@/lib/types";

interface RouteStep {
  type: "walking" | "transit" | "transfer";
  description?: string;
  mode?: string;
  line_name?: string;
  line_color?: string;
  operator?: string;
  from?: { name?: string };
  to?: { name?: string };
  distance_km?: number;
  estimated_minutes?: number;
  wait_minutes?: number;
  from_line?: string;
  to_line?: string;
}

interface RouteToArtisanResponse {
  error?: string;
  artisan_name?: string;
  craft_type?: string;
  from?: { lat: number; lng: number; name: string };
  plan?: {
    from?: { lat: number; lng: number; name: string };
    to?: { lat: number; lng: number; name: string };
    total_walking_km?: number;
    total_transit_km?: number;
    total_transfers?: number;
    total_estimated_minutes?: number;
    is_walking_only?: boolean;
    is_driving_recommended?: boolean;
    steps?: RouteStep[];
  };
  nearest_transit?: ArtisanTransitAccessRead[];
}

const CRAFT_EMOJIS: Record<string, string> = {
  pottery: "🏺",
  "leather_work": "👜",
  textile: "🧶",
  jewelry: "💍",
  woodwork: "🪵",
  metalwork: "⚒️",
  glasswork: "🫙",
  "carpet_weaving": "🧶",
  stone_carving: "🗿",
};

function craftEmoji(craft: string): string {
  const key = craft.toLowerCase().replace(/[^a-z_]/g, "");
  return CRAFT_EMOJIS[key] ?? "🛠️";
}

function formatDistance(m: number): string {
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
}

export default function ArtisanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [artisan, setArtisan] = useState<ArtisanRead | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [fromLat, setFromLat] = useState("");
  const [fromLng, setFromLng] = useState("");
  const [geolocating, setGeolocating] = useState(false);
  const [route, setRoute] = useState<RouteToArtisanResponse | null>(null);
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/artisans/{artisan_id}", { params: { path: { artisan_id: id } } })
      .then((res) => {
        if (cancelled) return;
        setArtisan(unwrap(res));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  function useMyLocation() {
    if (!navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFromLat(pos.coords.latitude.toFixed(5));
        setFromLng(pos.coords.longitude.toFixed(5));
        setGeolocating(false);
      },
      () => setGeolocating(false),
      { timeout: 8000 },
    );
  }

  async function getDirections() {
    const lat = Number(fromLat);
    const lng = Number(fromLng);
    if (!artisan || Number.isNaN(lat) || Number.isNaN(lng)) return;
    setRouting(true);
    setRoute(null);
    try {
      const res = await client.GET("/api/v1/transport/route-to-artisan/{artisan_id}", {
        params: {
          path: { artisan_id: artisan.id },
          query: { from_lat: lat, from_lng: lng },
        },
      });
      setRoute(unwrap(res));
    } catch (e) {
      setRoute({ error: e instanceof Error ? e.message : "Routing failed" });
    } finally {
      setRouting(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-6xl text-sm text-zinc-500">
          Loading artisan…
        </div>
      </main>
    );
  }

  if (status === "error" || !artisan) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/artisans"
            className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
          >
            ← All artisans
          </Link>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Could not load this artisan.
          </div>
        </div>
      </main>
    );
  }

  const transit = artisan.nearest_transit ?? [];

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/artisans"
          className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← All artisans
        </Link>

        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{craftEmoji(artisan.craft_type)}</span>
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">
                    {artisan.name}
                  </h1>
                  <p className="mt-1 text-sm capitalize text-zinc-600">
                    {artisan.craft_type}
                    {artisan.is_verified ? (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        Verified workshop
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
              {artisan.description ? (
                <p className="mt-3 max-w-2xl text-sm text-zinc-600">
                  {artisan.description}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Workshop
              </h2>
              <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {artisan.address ? (
                  <div>
                    <dt className="text-zinc-500">Address</dt>
                    <dd className="mt-0.5 text-zinc-900">{artisan.address}</dd>
                  </div>
                ) : null}
                {artisan.opening_hours ? (
                  <div>
                    <dt className="text-zinc-500">Opening hours</dt>
                    <dd className="mt-0.5 text-zinc-900">
                      {artisan.opening_hours}
                    </dd>
                  </div>
                ) : null}
                {artisan.latitude != null && artisan.longitude != null ? (
                  <div>
                    <dt className="text-zinc-500">Coordinates</dt>
                    <dd className="mt-0.5 text-zinc-900">
                      {artisan.latitude.toFixed(4)}, {artisan.longitude.toFixed(4)}
                    </dd>
                  </div>
                ) : null}
                {artisan.price_range_min != null ? (
                  <div>
                    <dt className="text-zinc-500">Price range</dt>
                    <dd className="mt-0.5 text-zinc-900">
                      {artisan.price_range_min} – {artisan.price_range_max ?? "—"}{" "}
                      DZD
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {artisan.accepts_visitors ? (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">
                    Accepts visitors
                  </span>
                ) : null}
                {artisan.has_workshop ? (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">
                    Has workshop
                  </span>
                ) : null}
                {artisan.accepts_custom_orders ? (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600">
                    Custom orders
                  </span>
                ) : null}
                {(artisan.specializations ?? []).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 capitalize text-zinc-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Transit directions
              </h2>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <div>
                  <label
                    htmlFor="from-lat"
                    className="text-xs font-medium text-zinc-500"
                  >
                    From latitude
                  </label>
                  <input
                    id="from-lat"
                    value={fromLat}
                    onChange={(e) => setFromLat(e.target.value)}
                    placeholder="36.7538"
                    className="mt-1 w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="from-lng"
                    className="text-xs font-medium text-zinc-500"
                  >
                    From longitude
                  </label>
                  <input
                    id="from-lng"
                    value={fromLng}
                    onChange={(e) => setFromLng(e.target.value)}
                    placeholder="3.0588"
                    className="mt-1 w-36 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={geolocating}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                  >
                    {geolocating ? "Locating…" : "Use my location"}
                  </button>
                  <button
                    type="button"
                    onClick={getDirections}
                    disabled={
                      routing || !fromLat.trim() || !fromLng.trim()
                    }
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {routing ? "Planning…" : "Get directions"}
                  </button>
                </div>
              </div>

              {route ? (
                <div className="mt-5">
                  {route.error ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      {route.error}
                    </div>
                  ) : route.plan ? (
                    <RoutePlanView plan={route.plan} />
                  ) : (
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                      No route returned.
                    </div>
                  )}
                </div>
              ) : null}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Nearest transit stops
              </h2>
              {transit.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500">
                  No transit stop within 5 km of this workshop.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {transit.map((t) => (
                    <li
                      key={`${t.station_id}-${t.rank}`}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {t.station_name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {t.station_type}
                          {t.operator ? ` · ${t.operator}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right text-xs text-zinc-600">
                        <p className="font-medium text-emerald-700">
                          {t.walking_time_min} min walk
                        </p>
                        <p>{formatDistance(t.distance_m)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RoutePlanView({ plan }: { plan: NonNullable<RouteToArtisanResponse["plan"]> }) {
  const steps = plan.steps ?? [];
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white">
          {plan.total_estimated_minutes} min
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-600">
          🚶 {plan.total_walking_km} km walking
        </span>
        {plan.total_transit_km ? (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-600">
            🚌 {plan.total_transit_km} km transit
          </span>
        ) : null}
        {plan.total_transfers ? (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-600">
            {plan.total_transfers} transfer{plan.total_transfers === 1 ? "" : "s"}
          </span>
        ) : null}
        {plan.is_walking_only ? (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-600">
            Walking only
          </span>
        ) : null}
        {plan.is_driving_recommended ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            Driving recommended
          </span>
        ) : null}
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-700">
              {i + 1}
            </span>
            <div className="min-w-0">
              {step.type === "transit" ? (
                <p className="font-medium text-zinc-900">
                  {step.mode} {step.line_name ? `· ${step.line_name}` : ""}
                  {step.operator ? ` · ${step.operator}` : ""}
                  <span className="ml-2 font-normal text-zinc-500">
                    {step.estimated_minutes} min · {step.distance_km} km
                  </span>
                </p>
              ) : (
                <p className="font-medium text-zinc-900">
                  {step.description ??
                    (step.type === "walking" ? "Walk" : "Transfer")}
                  <span className="ml-2 font-normal text-zinc-500">
                    {step.estimated_minutes ?? step.wait_minutes} min
                    {step.distance_km ? ` · ${step.distance_km} km` : ""}
                  </span>
                </p>
              )}
              {step.type === "transit" ? (
                <p className="text-xs text-zinc-500">
                  {step.from?.name ?? ""} → {step.to?.name ?? ""}
                </p>
              ) : step.from_line && step.to_line ? (
                <p className="text-xs text-zinc-500">
                  {step.from_line} → {step.to_line}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
