"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { client, unwrap } from "@/lib/client";
import type { PoiFeed } from "@/lib/types";

const LIMIT = 24;

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [debounced, setDebounced] = useState(initialQ);
  const [category, setCategory] = useState<string>("all");
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; feed: PoiFeed }
  >({ status: "idle" });

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const q = debounced.trim();
    if (q.length === 0) {
      setState({ status: "idle" });
      return;
    }
    if (q !== searchParams.get("q")) {
      router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search", {
        scroll: false,
      });
    }
    let cancelled = false;
    setState({ status: "loading" });
    client
      .GET("/api/v1/pois/search", {
        params: { query: { q, limit: LIMIT } },
      })
      .then((res) => {
        if (!cancelled) setState({ status: "ready", feed: unwrap(res) });
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
  }, [debounced, router, searchParams]);

  const items = state.status === "ready" ? state.feed.items : [];
  const categories = [...new Set(items.map((p) => p.category))].sort();
  const filtered =
    category === "all" ? items : items.filter((p) => p.category === category);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8">
      <a
        href="/"
        className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
      >
        ← Home
      </a>

      <header className="mx-auto mb-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-zinc-900">
          Search all of Algeria
        </h1>
        <p className="mt-1 text-zinc-600">
          Semantic search over 52,000+ POIs — try "roman ruins", "beaches in
          Oran", "museums".
        </p>
      </header>

      <div className="mx-auto mb-6 max-w-6xl">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search POIs across every wilaya…"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      {state.status === "loading" && (
        <p className="mx-auto max-w-6xl text-zinc-500">Searching…</p>
      )}

      {state.status === "error" && (
        <div className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Search failed</p>
          <p className="mt-1 text-sm">{state.message}</p>
        </div>
      )}

      {state.status === "idle" && (
        <p className="mx-auto max-w-6xl text-zinc-500">
          Type a query above to search POIs, monuments, beaches and more.
        </p>
      )}

      {state.status === "ready" && (
        <div className="mx-auto max-w-6xl">
          {state.feed.total === 0 ? (
            <p className="text-zinc-500">
              No results for "{debounced}". Try a different query.
            </p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    category === "all"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  All
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
                    {c}
                  </button>
                ))}
              </div>

              <p className="mb-4 text-sm text-zinc-500">
                {filtered.length} result{filtered.length === 1 ? "" : "s"} for "
                {debounced}"
                {category !== "all" ? ` (${category})` : ""}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
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
                        <h2 className="font-medium text-zinc-900">
                          {p.name || `Unnamed ${p.category}`}
                        </h2>
                        <span className="shrink-0 rounded bg-zinc-100 px-2 py-0.5 text-xs capitalize text-zinc-600">
                          {p.category}
                        </span>
                      </div>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                          {p.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-emerald-700">
                          {p.entry_fee_dzd
                            ? `${p.entry_fee_dzd} DZD`
                            : "Free"}
                        </span>
                        {p.wilaya_id && (
                          <a
                            href={`/wilayas/${p.wilaya_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-500 hover:bg-zinc-200"
                          >
                            wilaya {p.wilaya_id}
                          </a>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="px-6 py-8 text-zinc-500">Loading…</p>}>
      <SearchPageInner />
    </Suspense>
  );
}
