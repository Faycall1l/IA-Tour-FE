"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { PoiRead } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; poi: PoiRead };

const CATEGORY_STYLES: Record<string, string> = {
  historical: "bg-amber-100 text-amber-800",
  cultural: "bg-purple-100 text-purple-800",
  museum: "bg-indigo-100 text-indigo-800",
  religious: "bg-teal-100 text-teal-800",
  natural: "bg-green-100 text-green-800",
  beach: "bg-sky-100 text-sky-800",
  mountain: "bg-emerald-100 text-emerald-800",
  park: "bg-lime-100 text-lime-800",
  market: "bg-orange-100 text-orange-800",
  restaurant: "bg-red-100 text-red-800",
  cafe: "bg-yellow-100 text-yellow-800",
  other: "bg-zinc-100 text-zinc-700",
};

export default function PoiDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    client
      .GET("/api/v1/pois/{poi_id}", { params: { path: { poi_id: id } } })
      .then((res) => {
        if (!cancelled) setState({ status: "ready", poi: unwrap(res) });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, retry]);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-8 pt-24">
      <a
        href={`/wilayas/${state.status === "ready" ? state.poi.wilaya_id : ""}`}
        className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        ← Back to wilaya
      </a>

      {state.status === "loading" && (
        <p className="mx-auto max-w-3xl text-zinc-500">Loading POI…</p>
      )}

      {state.status === "error" && (
        <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Could not load this POI</p>
          <p className="mt-1 text-sm">{state.message}</p>
          <button
            onClick={() => setRetry((n) => n + 1)}
            className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === "ready" && (() => {
        const p = state.poi;
        const catStyle = CATEGORY_STYLES[p.category] ?? CATEGORY_STYLES.other;
        const images = [
          ...(p.photo_url ? [p.photo_url] : []),
          ...(p.photo_urls ?? []),
        ].filter((u, i, a) => a.indexOf(u) === i);
        return (
          <div className="mx-auto max-w-3xl">
            <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[0]}
                  alt={p.name ?? p.category}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="flex h-72 w-full items-center justify-center bg-zinc-100 text-6xl">
                  {p.category.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${catStyle}`}
                  >
                    {p.category}
                  </span>
                  {p.subtype && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600">
                      {p.subtype.replaceAll("_", " ")}
                    </span>
                  )}
                  {p.is_featured && (
                    <span className="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
                      ★ Featured
                    </span>
                  )}
                  {p.ranking_position != null && p.ranking_total != null && (
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
                      #{p.ranking_position} of {p.ranking_total} in category
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-zinc-900">
                  {p.name ?? `Unnamed ${p.category}`}
                  {p.name_en && p.name_en !== p.name && (
                    <span className="ml-2 align-middle text-lg font-normal text-zinc-500">
                      {p.name_en}
                    </span>
                  )}
                </h1>
                {p.name_ar && (
                  <p dir="rtl" className="mt-1 text-xl text-zinc-500">
                    {p.name_ar}
                  </p>
                )}

                {p.description && (
                  <p className="mt-4 leading-relaxed text-zinc-700">
                    {p.description}
                  </p>
                )}

                {p.fun_fact && (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                      Did you know?
                    </p>
                    <p className="mt-1 text-amber-900">{p.fun_fact}</p>
                  </div>
                )}

                <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-zinc-50 p-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Entry fee
                    </dt>
                    <dd className="mt-1 font-semibold text-emerald-700">
                      {p.entry_fee_dzd
                        ? `${p.entry_fee_dzd} DZD`
                        : "Free"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-zinc-50 p-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Suggested visit
                    </dt>
                    <dd className="mt-1 font-semibold text-zinc-800">
                      {p.suggested_duration_min
                        ? `${p.suggested_duration_min} min`
                        : "—"}
                    </dd>
                  </div>
                  {p.opening_hours && (
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Opening hours
                      </dt>
                      <dd className="mt-1 text-sm text-zinc-800">
                        {p.opening_hours}
                      </dd>
                    </div>
                  )}
                  {p.cuisine && (
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Cuisine
                      </dt>
                      <dd className="mt-1 text-sm capitalize text-zinc-800">
                        {p.cuisine}
                      </dd>
                    </div>
                  )}
                  {p.phone && (
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-zinc-800">{p.phone}</dd>
                    </div>
                  )}
                  {p.latitude != null && p.longitude != null && (
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm text-zinc-800">
                        {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Visit website
                    </a>
                  )}
                  {p.latitude != null && p.longitude != null && (
                    <a
                      href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      Open in Maps
                    </a>
                  )}
                </div>
              </div>
            </article>
          </div>
        );
      })()}
    </main>
  );
}