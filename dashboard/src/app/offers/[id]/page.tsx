"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ExperienceDetail } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: ExperienceDetail };

export default function OfferDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    client
      .GET("/api/v1/experiences/{experience_id}", {
        params: { path: { experience_id: id } },
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
  const exp = detail?.experience ?? null;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Home
        </Link>

        {state.status === "loading" && (
          <div className="mx-auto max-w-6xl">
            <div className="h-10 w-2/3 animate-pulse rounded bg-zinc-200" />
            <div className="mt-6 h-80 animate-pulse rounded-2xl bg-zinc-200" />
          </div>
        )}

        {state.status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Could not load this offer</p>
            <p className="mt-1 text-sm">{state.message}</p>
            <button
              onClick={() => setRetry((n) => n + 1)}
              className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {exp && (
          <>
            <header className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold capitalize text-emerald-800">
                  {exp.category}
                </span>
                {exp.wilaya_id && (
                  <Link
                    href={`/wilayas/${exp.wilaya_id}`}
                    className="rounded-full bg-zinc-200 px-3 py-0.5 text-xs font-medium text-zinc-700 hover:bg-emerald-100"
                  >
                    Wilaya {exp.wilaya_id}
                  </Link>
                )}
                {exp.is_verified && (
                  <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Verified
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-3xl font-bold text-zinc-900">
                {exp.title}
              </h1>
              <p className="mt-1 text-zinc-600">
                {exp.duration_hours ? `${exp.duration_hours} hours` : "Flexible"}
                {exp.language ? ` · ${exp.language}` : ""}
                {exp.season ? ` · ${exp.season}` : ""}
              </p>
            </header>

            {exp.photos && exp.photos.length > 0 && (
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {exp.photos.slice(0, 4).map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={p}
                    alt={`${exp.title} ${i + 1}`}
                    className={`h-64 w-full rounded-2xl object-cover ${
                      i > 0 ? "hidden sm:block" : ""
                    }`}
                    loading="lazy"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                {exp.description && (
                  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                      About this experience
                    </h2>
                    <p className="whitespace-pre-line leading-relaxed text-zinc-700">
                      {exp.description}
                    </p>
                  </section>
                )}

                {exp.meeting_point && (
                  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-2 text-lg font-semibold text-zinc-900">
                      Meeting point
                    </h2>
                    <p className="text-zinc-700">{exp.meeting_point}</p>
                  </section>
                )}

                {exp.included && exp.included.length > 0 && (
                  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold text-zinc-900">
                      What&apos;s included
                    </h2>
                    <ul className="space-y-1.5">
                      {exp.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                          <span className="mt-0.5 text-emerald-600">-</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {exp.what_to_bring && exp.what_to_bring.length > 0 && (
                  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold text-zinc-900">
                      What to bring
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {exp.what_to_bring.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                <p className="text-sm text-zinc-500">From</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {exp.price_dzd
                    ? `${exp.price_dzd.toLocaleString("en-US")} DZD`
                    : "Free"}
                </p>
                {exp.max_participants && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Up to {exp.max_participants} participants
                  </p>
                )}
                <dl className="mt-4 space-y-2 border-t border-zinc-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Organizer</dt>
                    <dd className="max-w-[60%] truncate font-medium text-zinc-800">
                      {detail?.provider_name ?? "Local agency"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-zinc-500">Duration</dt>
                    <dd className="font-medium text-zinc-800">
                      {exp.duration_hours ? `${exp.duration_hours}h` : "Flexible"}
                    </dd>
                  </div>
                  {exp.start_date && (
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Starts</dt>
                      <dd className="font-medium text-zinc-800">
                        {new Date(exp.start_date).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {exp.completion_count > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Completed</dt>
                      <dd className="font-medium text-zinc-800">
                        {exp.completion_count}×
                      </dd>
                    </div>
                  )}
                </dl>
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                  Contact the agency directly to book. ATHAR is a travel guide —
                  it does not process bookings.
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
