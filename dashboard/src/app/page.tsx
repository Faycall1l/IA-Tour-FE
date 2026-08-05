"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";
import AgentChat from "@/components/AgentChat";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; wilayas: WilayaSummary[] };

export default function Home() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (!cancelled) setState({ status: "ready", wilayas: unwrap(res) });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error && "status" in err
              ? `Backend returned ${(err as { status: number }).status}`
              : err instanceof Error
                ? err.message
                : "Unknown error";
          setState({ status: "error", message });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [retry]);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <header className="mx-auto mb-8 max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">ATHAR</h1>
            <p className="mt-1 text-zinc-600">
              Agentic travel guide for Algeria — explore all 58 wilayas (and the
              new southern ones).
            </p>
          </div>
          <a
            href="/search"
            className="group flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-500 shadow-sm transition hover:border-emerald-500 hover:text-emerald-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
            <span>Search all of Algeria</span>
          </a>
        </div>
      </header>

      {state.status === "loading" && (
        <p className="mx-auto max-w-6xl text-zinc-500">Loading wilayas…</p>
      )}

      {state.status === "error" && (
        <div className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Could not reach the ATHAR API</p>
          <p className="mt-1 text-sm">{state.message}</p>
          <p className="mt-1 text-sm">
            Start the backend with{" "}
            <code className="rounded bg-red-100 px-1 py-0.5">
              ./.venv/bin/python -m uvicorn app.main:app --port 8001
            </code>{" "}
            in the <code className="rounded bg-red-100 px-1 py-0.5">Athar</code>{" "}
            repo.
          </p>
          <button
            onClick={() => setRetry((n) => n + 1)}
            className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === "ready" && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
            {state.wilayas.map((w) => (
            <a
              key={w.id}
              href={`/wilayas/${w.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {w.highlight_poi_photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={w.highlight_poi_photo}
                  alt={w.name}
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-zinc-100 text-4xl">
                  {w.name.slice(0, 1)}
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-zinc-900">
                  {w.name}
                  <span className="ml-2 text-sm font-normal text-zinc-400">
                    wilaya {w.id}
                  </span>
                </h2>
                {w.highlight_poi && (
                  <p className="mt-1 text-sm text-zinc-600">
                    <span className="font-medium text-zinc-700">Highlight:</span>{" "}
                    {w.highlight_poi}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                    {w.total_pois} POIs
                  </span>
                  <span className="rounded bg-sky-50 px-2 py-1 font-medium text-sky-700">
                    {w.total_stays} stays
                  </span>
                  <span className="rounded bg-amber-50 px-2 py-1 font-medium text-amber-700">
                    {w.total_experiences} experiences
                  </span>
                  <span className="rounded bg-violet-50 px-2 py-1 font-medium text-violet-700">
                    {w.total_artisans} artisans
                  </span>
                </div>
              </div>
            </a>
            ))}
          </div>
          <div className="lg:col-span-1">
            <AgentChat />
          </div>
        </div>
      )}
    </main>
  );
}
