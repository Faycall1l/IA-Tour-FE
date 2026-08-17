"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";

type Slide = {
  title: string;
  subtitle: string;
  place?: string;
  image?: string;
  gradient: string;
};

const ROTATION_MS = 6000;

function MapIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v14M15 6v14" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="9" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m15.5 8.5-2 5-5 2 2-5 5-2Z"
      />
    </svg>
  );
}

const DEFAULT_SLIDE: Slide = {
  title: "ATHAR",
  subtitle: "The agentic travel guide for Algeria",
  gradient: "from-pine via-[#2e8b6a] to-sea-foam",
};

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/plan");
  };

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        const wilayas: WilayaSummary[] = unwrap(res);
        const real = wilayas
          .filter((w) => w.highlight_poi_photo || w.highlight_poi)
          .slice(0, 6)
          .map<Slide>((w) => ({
            title: w.name,
            subtitle: w.highlight_poi ?? `${w.total_pois} points of interest`,
            place: w.highlight_poi ?? undefined,
            image: w.highlight_poi_photo ?? undefined,
            gradient: "from-zinc-800 via-zinc-700 to-zinc-900",
          }));
        if (real.length > 0) setSlides(real);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATION_MS,
    );
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index] ?? DEFAULT_SLIDE;

  return (
    <section className="relative h-[84vh] min-h-[560px] overflow-hidden">
      {slides.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-pine via-[#2e8b6a] to-sea-foam" />
      )}
      {slides.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.image}
              alt={s.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${s.gradient}`}
            />
          )}
          {s.image && (
            <div className="absolute inset-0 bg-[#5a8a3c]/30 mix-blend-color" />
          )}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0">
        <div className="flex h-full flex-col px-6 py-16 sm:px-10">
          <div className="my-auto flex w-full flex-col items-center gap-10">
            <div className="pointer-events-auto flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/plan"
                className="group flex items-center gap-3 rounded-full bg-sea-foam px-5 py-2.5 shadow-lg transition hover:bg-champagne"
              >
                <span className="flex flex-col text-left">
                  <h3 className="text-base font-bold tracking-tight text-pine drop-shadow-[0_1px_2px_rgba(13,59,46,0.35)]">
                    Plan a trip
                  </h3>
                  <p className="text-xs text-pine/80 drop-shadow-[0_1px_1px_rgba(13,59,46,0.25)]">
                    Have places in mind?
                  </p>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-foam text-pine transition group-hover:text-pine">
                  <MapIcon />
                </span>
              </Link>

              <Link
                href="/explore"
                className="group flex items-center gap-3 rounded-full bg-sea-foam px-5 py-2.5 shadow-lg transition hover:bg-champagne"
              >
                <span className="flex flex-col text-left">
                  <h3 className="text-base font-bold tracking-tight text-pine drop-shadow-[0_1px_2px_rgba(13,59,46,0.35)]">
                    Get inspired
                  </h3>
                  <p className="text-xs text-pine/80 drop-shadow-[0_1px_1px_rgba(13,59,46,0.25)]">
                    Not sure where to go?
                  </p>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-foam text-pine transition group-hover:text-pine">
                  <CompassIcon />
                </span>
              </Link>
            </div>

            <form
              onSubmit={handleSearch}
              className="pointer-events-auto relative w-full max-w-xl"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 2 days in Djanet"
                className="w-full rounded-full bg-champagne/70 px-6 py-4 pr-14 text-base font-medium text-pine shadow-xl placeholder:text-moss/60 backdrop-blur-md focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-sea-foam text-pine transition hover:bg-champagne"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="m20 20-3.5-3.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

        {slides.length > 0 && slide.place && (
          <p className="absolute bottom-6 right-6 text-sm font-light italic tracking-wide text-white/80">
            {slide.place} - {slide.title}
          </p>
        )}

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.title}`}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-6 bg-sea-foam"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
