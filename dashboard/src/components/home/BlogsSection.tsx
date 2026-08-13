"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ExperienceRead } from "@/lib/types";
import ExperienceCard from "@/components/cards/ExperienceCard";

const PAGE_SIZE = 2;
const FLIP_MS = 12000;

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
      <div className="mx-auto mb-5 flex max-w-7xl items-end justify-between gap-4 px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
            Experiences & tours
          </p>
          <h2 className="mt-1 text-2xl font-bold text-pine">
            Real tours from local agencies and guides
          </h2>
        </div>
        <Link
          href="/offers"
          className="shrink-0 text-sm font-medium text-rustic-gold hover:underline"
        >
          View all →
        </Link>
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
              {visible.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
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
