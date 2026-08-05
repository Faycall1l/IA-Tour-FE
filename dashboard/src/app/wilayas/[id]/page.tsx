"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PoiSummary, WilayaDetail } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: WilayaDetail };

const POI_LIMIT = 60;

export default function WilayaDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"default" | "name" | "free">("default");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    api
      .get<WilayaDetail>(`/discover/wilayas/${id}`)
      .then((detail) => {
        if (!cancelled) setState({ status: "ready", detail });
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

  const detail = state.status === "ready" ? state.detail : null;
  const categories = detail
    ? [...new Set(detail.pois.map((p) => p.category))].sort()
    : [];
  const pois =
    detail && category !== "all"
      ? detail.pois.filter((p) => p.category === category)
      : (detail?.pois ?? []);
  const query = search.trim().toLowerCase();
  const poisFiltered =
    query.length === 0
      ? pois
      : pois.filter((p) => (p.name ?? p.category).toLowerCase().includes(query));
  const poisSorted = [...poisFiltered].sort((a, b) => {
    if (sort === "name") return (a.name ?? "").localeCompare(b.name ?? "");
    if (sort === "free") {
      const feeA = a.entry_fee_dzd ?? 0;
      const feeB = b.entry_fee_dzd ?? 0;
      return feeA - feeB;
    }
    return 0;
  });
  const poisView = poisSorted.slice(0, POI_LIMIT);
  const categoryCounts = detail
    ? detail.pois.reduce<Record<string, number>>((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8">
      <a
        href="/"
        className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        ← All wilayas
      </a>

      {state.status === "loading" && (
        <p className="mx-auto max-w-6xl text-zinc-500">Loading wilaya…</p>
      )}

      {state.status === "error" && (
        <div className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Could not load wilaya {id}</p>
          <p className="mt-1 text-sm">{state.message}</p>
          <button
            onClick={() => setRetry((n) => n + 1)}
            className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {detail && (
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900">
              {detail.wilaya_name}
            </h1>
            <p className="mt-1 text-zinc-600">
              {detail.pois.length} POIs · {detail.stays.length} stays ·{" "}
              {detail.experiences.length} experiences
            </p>
          </header>

          {/* Category filter */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                category === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100"
              }`}
            >
              All{" "}
              <span className="ml-1 rounded-full bg-black/10 px-1.5 text-xs">
                {detail?.pois.length ?? 0}
              </span>
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                  category === c
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100"
                }`}
              >
                {c}{" "}
                <span
                  className={`ml-1 rounded-full px-1.5 text-xs ${
                    category === c ? "bg-white/20" : "bg-black/10"
                  }`}
                >
                  {categoryCounts[c] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Name search + sort */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${pois.length} POIs by name…`}
              className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "default" | "name" | "free")
              }
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="default">Default order</option>
              <option value="name">Name (A–Z)</option>
              <option value="free">Cheapest first</option>
            </select>
            {search.trim().length > 0 && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {/* POIs grid */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">
              Points of interest
              {category !== "all" && (
                <span className="ml-2 text-sm font-normal text-zinc-500">
                  ({category})
                </span>
              )}
            </h2>
            {poisFiltered.length === 0 ? (
              <p className="text-zinc-500">
                No POIs match{" "}
                {category !== "all" || search.trim().length > 0
                  ? "this filter."
                  : "this category."}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {poisView.map((p) => (
                  <a
                    key={p.id}
                    href={`/pois/${p.id}`}
                    className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {p.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.photo_url}
                        alt={p.name ?? p.category}
                        className="h-32 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center bg-zinc-100 text-2xl">
                        {p.category.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-zinc-900">
                          {p.name || `Unnamed ${p.category}`}
                        </h3>
                        <span className="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600">
                          {p.category}
                        </span>
                      </div>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                          {p.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-medium text-emerald-700">
                        {p.entry_fee_dzd
                          ? `${p.entry_fee_dzd} DZD`
                          : "Free"}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
            {poisFiltered.length > POI_LIMIT && (
              <p className="mt-3 text-sm text-zinc-500">
                Showing {POI_LIMIT} of {poisFiltered.length} — use the{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5">
                  GET /pois
                </code>{" "}
                API for pagination.
              </p>
            )}
          </section>

          {/* Stays */}
          {detail.stays.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Where to stay
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detail.stays.slice(0, 9).map((s) => (
                  <article
                    key={s.id}
                    className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                  >
                    {s.photos && s.photos.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.photos[0]}
                        alt={s.name ?? "stay"}
                        className="h-32 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-4xl">
                        🛏
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-zinc-900">{s.name}</h3>
                      <p className="text-sm capitalize text-zinc-500">
                        {s.property_type}
                      </p>
                      <p className="mt-2 font-semibold text-emerald-700">
                        {s.price_per_night_dzd?.toLocaleString("en-US")} DZD
                        <span className="text-xs font-normal text-zinc-500">
                          {" "}
                          /night
                        </span>
                      </p>
                      {s.max_guests && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {s.max_guests} guests max
                        </p>
                      )}
                      {s.provider_name && (
                        <p className="mt-1 truncate text-xs text-zinc-400">
                          via {s.provider_name}
                        </p>
                      )}
                      {s.amenities && s.amenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {s.amenities.slice(0, 4).map((a) => (
                            <span
                              key={a}
                              className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600"
                            >
                              {a}
                            </span>
                          ))}
                          {s.amenities.length > 4 && (
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-400">
                              +{s.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Experiences */}
          {detail.experiences.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Experiences & tours
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detail.experiences.slice(0, 9).map((e) => (
                  <article
                    key={e.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <h3 className="font-medium text-zinc-900">{e.title}</h3>
                    <p className="text-sm capitalize text-zinc-500">
                      {e.category}
                      {e.duration_hours ? ` · ${e.duration_hours}h` : ""}
                    </p>
                    {e.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                        {e.description}
                      </p>
                    )}
                    <p className="mt-2 font-semibold text-amber-700">
                      {e.price_dzd
                        ? `${e.price_dzd.toLocaleString("en-US")} DZD`
                        : "Free"}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}