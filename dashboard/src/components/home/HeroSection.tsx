"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";

type Slide = {
  title: string;
  subtitle: string;
  image?: string;
  gradient: string;
};

const ROTATION_MS = 6000;

function ArrowLeft() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
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

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        const wilayas: WilayaSummary[] = unwrap(res);
        const real = wilayas
          .filter((w) => w.highlight_poi_photo)
          .slice(0, 6)
          .map<Slide>((w) => ({
            title: w.name,
            subtitle: w.highlight_poi ?? `${w.total_pois} points of interest`,
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
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0">
        <div className="flex h-full flex-col px-6 py-16 sm:px-10">
          <div className="mx-auto mt-6 w-full max-w-6xl text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-champagne">
              {slide.subtitle}
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight drop-shadow sm:text-5xl">
              {slide.title}
            </h2>
          </div>

          <div className="pointer-events-auto my-auto flex w-full flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
            <Link href="/plan" className="group flex items-center gap-4 text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-foam text-pine shadow-lg transition group-hover:bg-champagne">
                <ArrowLeft />
              </span>
              <span className="flex flex-col">
                <h3 className="text-lg font-bold tracking-tight text-white">
                  Have places to visit in mind?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-champagne/90 sm:max-w-xs">
                  Tell us your destinations and let us manage and optimize your
                  trip,{" "}
                  <span className="font-bold text-sea-foam">
                    maxing fun
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-sea-foam">
                     exploration
                  </span>{" "}
                  and{" "}
                  <span className="font-bold text-sea-foam">
                    minimizing costs
                  </span>
                  .
                </p>
              </span>
            </Link>

            <Link href="/explore" className="group flex items-center gap-4 text-left">
              <span className="flex flex-col">
                <h3 className="text-lg font-bold tracking-tight text-white">
                  You want to travel but don&apos;t know where?
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-champagne/90 sm:max-w-xs">
                  Explore options we have, see trendings and{" "}
                  <span className="font-bold text-sea-foam">
                    explore until you get inspired
                  </span>
                  .
                </p>
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-foam text-pine shadow-lg transition group-hover:bg-champagne">
                <ArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </div>

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
