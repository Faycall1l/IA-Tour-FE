"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { client, unwrap } from "@/lib/client";
import { WILAYA_COORDS } from "@/lib/sample-data";
import type { WilayaDetail, WilayaSummary } from "@/lib/types";
import Breadcrumb from "@/components/ui/Breadcrumb";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: WilayaDetail };

function haversine(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function WilayaDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"default" | "name" | "free">("default");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (!cancelled) setWilayas(unwrap(res) ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    client
      .GET("/api/v1/discover/wilayas/{wilaya_id}", {
        params: { path: { wilaya_id: id } },
      })
      .then((res) => {
        if (!cancelled) setState({ status: "ready", detail: unwrap(res) });
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
  const summary = wilayas.find((w) => w.id === id);

  const nearby = useMemo(() => {
    const coords = WILAYA_COORDS[id];
    if (!coords) return [];
    return wilayas
      .filter((w) => w.id !== id)
      .map((w) => ({
        wilaya: w,
        dist: haversine(coords, WILAYA_COORDS[w.id] ?? { latitude: 0, longitude: 0 }),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6)
      .map((e) => e.wilaya);
  }, [id, wilayas]);

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
  const categoryCounts = detail
    ? detail.pois.reduce<Record<string, number>>((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          segments={[
            { label: "home", href: "/" },
            ...(detail ? [{ label: detail.wilaya_name }] : []),
          ]}
        />

        {state.status === "loading" && (
          <p className="text-moss">Loading wilaya…</p>
        )}

        {state.status === "error" && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-medium">Could not load wilaya {id}</p>
            <p className="mt-1">{state.message}</p>
            <button
              onClick={() => setRetry((n) => n + 1)}
              className="mt-3 rounded-full bg-rustic-gold px-4 py-1.5 text-sm font-semibold text-white hover:bg-pine"
            >
              Retry
            </button>
          </div>
        )}

        {detail && (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-pine">
                {detail.wilaya_name}
              </h1>
              <p className="mt-1 text-sm text-moss">
                {detail.pois.length} places · {detail.stays.length} stays ·{" "}
                {detail.experiences.length} experiences
              </p>
            </header>

            {/* Description */}
            {summary?.description && (
              <section className="mb-8 rounded-2xl border border-champagne bg-champagne/20 p-5">
                <p className="text-sm leading-relaxed text-moss">
                  {summary.description}
                </p>
              </section>
            )}

            {/* Nearby wilayas */}
            {nearby.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-rustic-gold">
                  Nearby wilayas
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {nearby.map((w) => (
                    <Link
                      key={w.id}
                      href={`/wilayas/${w.id}`}
                      className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm transition hover:shadow-md"
                    >
                      {w.highlight_poi_photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={w.highlight_poi_photo}
                          alt={w.name}
                          className="h-24 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-24 w-full bg-gradient-to-br from-champagne to-sea-foam/60" />
                      )}
                      <div className="p-2.5">
                        <p className="text-xs font-bold text-pine group-hover:text-rustic-gold">
                          {w.name}
                        </p>
                        {w.highlight_poi && (
                          <p className="mt-0.5 line-clamp-1 text-[10px] text-moss">
                            {w.highlight_poi}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Category filter */}
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("all")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  category === "all"
                    ? "bg-pine text-sea-foam"
                    : "border border-champagne bg-white text-moss hover:bg-champagne/50"
                }`}
              >
                All{" "}
                <span className="ml-1 rounded-full bg-black/10 px-1.5 text-[10px]">
                  {detail.pois.length}
                </span>
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    category === c
                      ? "bg-pine text-sea-foam"
                      : "border border-champagne bg-white text-moss hover:bg-champagne/50"
                  }`}
                >
                  {c}{" "}
                  <span
                    className={`ml-1 rounded-full px-1.5 text-[10px] ${
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
                placeholder={`Search ${pois.length} places by name…`}
                className="w-full max-w-md rounded-full border border-champagne bg-white px-4 py-2 text-sm text-pine placeholder-moss/50 outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
              />
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "default" | "name" | "free")
                }
                className="rounded-full border border-champagne bg-white px-3 py-2 text-sm text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
              >
                <option value="default">Default order</option>
                <option value="name">Name (A–Z)</option>
                <option value="free">Cheapest first</option>
              </select>
              {search.trim().length > 0 && (
                <button
                  onClick={() => setSearch("")}
                  className="text-sm font-semibold text-rustic-gold hover:text-pine hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Places to visit */}
            <section className="mb-10">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-rustic-gold">
                Places to visit
                {category !== "all" && (
                  <span className="ml-2 text-xs font-normal normal-case tracking-normal text-moss">
                    ({category})
                  </span>
                )}
              </h2>
              {poisFiltered.length === 0 ? (
                <p className="text-sm text-moss">
                  No places match this filter.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {poisSorted.map((p) => (
                    <Link
                      key={p.id}
                      href={`/pois/${p.id}`}
                      className="group overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {p.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.photo_url}
                          alt={p.name ?? p.category}
                          className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-2xl">
                          {p.category.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-pine">
                            {p.name || `Unnamed ${p.category}`}
                          </h3>
                          <span className="shrink-0 rounded-full bg-champagne px-2 py-0.5 text-[10px] font-semibold capitalize text-moss">
                            {p.category}
                          </span>
                        </div>
                        {p.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-moss">
                            {p.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs font-semibold text-rustic-gold">
                          {p.entry_fee_dzd
                            ? `${p.entry_fee_dzd} DZD`
                            : "Free"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Experiences */}
            {detail.experiences.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-rustic-gold">
                  Experiences &amp; tours
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {detail.experiences.map((e) => (
                    <Link
                      key={e.id}
                      href={`/offers/${e.id}`}
                      className="group rounded-2xl border border-champagne bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <h3 className="font-medium text-pine">{e.title}</h3>
                      <p className="text-xs capitalize text-moss">
                        {e.category}
                        {e.duration_hours ? ` · ${e.duration_hours}h` : ""}
                      </p>
                      {e.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-moss">
                          {e.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-semibold text-rustic-gold">
                        {e.price_dzd
                          ? `${e.price_dzd.toLocaleString("en-US")} DZD`
                          : "Free"}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Stays */}
            {detail.stays.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-rustic-gold">
                  Where to stay
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {detail.stays.map((s) => (
                    <Link
                      key={s.id}
                      href={`/stays/${s.id}`}
                      className="group overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {s.photos && s.photos.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.photos[0]}
                          alt={s.name ?? "stay"}
                          className="h-32 w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-sm font-bold text-pine/40">
                          No image
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-pine">{s.name}</h3>
                        <p className="text-xs capitalize text-moss">
                          {s.property_type}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-rustic-gold">
                          {s.price_per_night_dzd?.toLocaleString("en-US")} DZD
                          <span className="font-normal text-moss"> /night</span>
                        </p>
                        {s.amenities && s.amenities.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {s.amenities.slice(0, 3).map((a) => (
                              <span
                                key={a}
                                className="rounded-full bg-champagne/70 px-2 py-0.5 text-[10px] text-moss"
                              >
                                {a}
                              </span>
                            ))}
                            {s.amenities.length > 3 && (
                              <span className="rounded-full bg-champagne/70 px-2 py-0.5 text-[10px] text-moss/50">
                                +{s.amenities.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
