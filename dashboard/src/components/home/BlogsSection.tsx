"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ExperienceRead } from "@/lib/types";

const PAGE_SIZE = 2;
const FLIP_MS = 12000;

const CATEGORY_EMOJIS: Record<string, string> = {
  tour: "🧭",
  tours: "🧭",
  cultural: "🎭",
  adventure: "🧗",
  hiking: "🥾",
  trekking: "🥾",
  wellness: "🧘",
  food: "🍲",
  nature: "🌿",
  desert: "🏜️",
};

function categoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? "🏜️";
}

export default function BlogsSection() {
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/experiences", {
        params: { query: { page: 1, page_size: 10 } },
      })
      .then((res) => {
        if (cancelled) return;
        setExperiences(unwrap(res).items);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(experiences.length / PAGE_SIZE));

  useEffect(() => {
    if (experiences.length <= PAGE_SIZE) return;
    const t = setInterval(
      () => setPage((p) => (p + 1) % totalPages),
      FLIP_MS,
    );
    return () => clearInterval(t);
  }, [experiences.length, totalPages]);

  const visible = experiences.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <section id="blog" className="bg-white py-10">
      <div className="mx-auto mb-5 max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
          Experiences & tours
        </p>
        <h2 className="mt-1 text-2xl font-bold text-pine">
          Real tours from local agencies and guides
        </h2>
      </div>

      {status === "loading" && experiences.length === 0 && (
        <div className="mx-auto grid max-w-7xl gap-5 px-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl bg-champagne"
            />
          ))}
        </div>
      )}

      {status === "error" && experiences.length === 0 && (
        <p className="mx-auto max-w-7xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 px-6">
          Could not load experiences from the API.
        </p>
      )}

      {visible.length > 0 && (
        <>
          <div
            key={page}
            className="mx-auto max-w-7xl animate-fade-in-up px-6"
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {visible.map((exp) => {
                const emoji = categoryEmoji(exp.category);
                const photo = exp.photos?.[0];
                return (
                  <article
                    key={exp.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-champagne bg-white shadow-sm"
                  >
                    <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-5xl">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={exp.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        emoji
                      )}
                      <span className="absolute right-3 top-3 rounded-full bg-champagne px-2 py-0.5 text-[11px] font-semibold capitalize text-rustic-gold">
                        {exp.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne text-base">
                          {emoji}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-pine">
                            {exp.meeting_point ?? "Local agency"}
                          </p>
                          <p className="text-xs text-moss">
                            {exp.duration_hours
                              ? `${exp.duration_hours}h · ${exp.language ?? "FR/EN"}`
                              : exp.language ?? "FR/EN"}
                          </p>
                        </div>
                      </div>
                      <h3 className="mt-3 text-base font-bold text-pine">
                        {exp.title}
                      </h3>
                      <p className="mt-1 flex-1 text-sm leading-relaxed text-moss">
                        {exp.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <Link
                          href={`/offers/${exp.id}`}
                          className="text-sm font-medium text-rustic-gold hover:underline"
                        >
                          Details →
                        </Link>
                        <span className="text-sm font-semibold text-emerald-700">
                          {exp.price_dzd
                            ? `${exp.price_dzd.toLocaleString("en-US")} DZD`
                            : "Free"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {experiences.length > PAGE_SIZE && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Experiences page ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === page
                      ? "w-6 bg-rustic-gold"
                      : "w-2 bg-champagne hover:bg-rustic-gold"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
