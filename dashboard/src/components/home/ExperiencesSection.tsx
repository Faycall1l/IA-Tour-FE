"use client";

import { useState } from "react";
import { useEffect as useClientEffect } from "react";
import { client, unwrap } from "@/lib/client";
import type { ExperienceRead } from "@/lib/types";

const PER_PAGE = 3;
const MAX_VISIBLE = 3;

function generateActivities(exp: ExperienceRead): string[] {
  if (exp.included && exp.included.length > 0) return exp.included;
  const steps: string[] = [];
  if (exp.meeting_point) steps.push(`Meet at ${exp.meeting_point}`);
  const title = exp.title;
  const category = (exp.category || "").toLowerCase();
  const desc = exp.description || "";

  if (category === "food" || category === "culinary") {
    steps.push("Introduction to local cuisine");
    steps.push("Tasting session with local specialties");
    steps.push("Hands-on cooking experience");
    steps.push("Share the meal together");
  } else if (category === "heritage" || category === "cultural") {
    steps.push(`Guided tour of ${title.split("—")[0].split("–")[0].trim()}`);
    steps.push("Walk through historical streets and monuments");
    steps.push("Learn about the history and architecture");
    steps.push("Free time to explore on your own");
  } else if (category === "adventure" || category === "trek") {
    steps.push("Depart by 4x4 from the meeting point");
    steps.push("Drive through scenic landscapes");
    steps.push("Guided trek through the terrain");
    steps.push("Rest and refreshment break");
    steps.push("Return to starting point");
  } else if (category === "nature" || category === "hiking") {
    steps.push("Briefing and safety check");
    steps.push("Hike through the natural site");
    steps.push("Photo stop at the viewpoint");
    steps.push("Picnic lunch in nature");
    steps.push("Descend and wrap up");
  } else if (category === "music" || category === "festival") {
    steps.push("Arrival and welcome");
    steps.push("Opening performances");
    steps.push("Headline act");
    steps.push("Free time to enjoy the atmosphere");
  } else if (category === "wellness" || category === "spa") {
    steps.push("Arrival and welcome treatment");
    steps.push("Traditional hammam session");
    steps.push("Massage and relaxation");
    steps.push("Herbal tea and rest");
  } else {
    steps.push(`Explore ${title}`);
    steps.push("Guided walk through the site");
    steps.push("Learn about local culture and history");
    steps.push("Photo opportunities and free time");
  }

  if (exp.duration_hours && exp.duration_hours >= 6) {
    steps.splice(Math.floor(steps.length / 2), 0, "Lunch break at a local restaurant");
  }
  return steps;
}

export default function ExperiencesSection() {
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [page, setPage] = useState(0);

  useClientEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/experiences", {
        params: { query: { page: 1, page_size: 50 } },
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

  const totalPages = Math.ceil(experiences.length / PER_PAGE);
  const slice = experiences.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section id="experiences" className="py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
              Experiences &amp; tours
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-pine">
              Programs offered by local agencies &amp; guides
            </h2>
          </div>
        </div>

        {status === "loading" && experiences.length === 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-champagne" />
            ))}
          </div>
        )}

        {status === "error" && experiences.length === 0 && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Could not load experiences.
          </p>
        )}

        {slice.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {slice.map((exp) => (
              <ProgramCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-[11px] text-moss">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-full bg-champagne px-3 py-1 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProgramCard({ experience: exp }: { experience: ExperienceRead }) {
  const photo = exp.photos?.[0];
  const activities = generateActivities(exp);
  const [open, setOpen] = useState(false);
  const visible = activities.slice(0, MAX_VISIBLE);
  const hidden = activities.length - MAX_VISIBLE;

  useClientEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="flex overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
        <div className="relative w-2/5 shrink-0">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={exp.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-sm font-bold text-pine/40">
              No image
            </div>
          )}
          {exp.price_dzd ? (
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              {exp.price_dzd.toLocaleString("en-US")} DZD
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <h3 className="text-sm font-bold leading-tight text-pine">
            {exp.title}
          </h3>
          <p className="mt-0.5 text-[10px] text-moss">
            {exp.category}
            {exp.duration_hours ? ` · ${exp.duration_hours}h` : ""}
          </p>

          <ul className="mt-2 flex-1 space-y-1">
            {visible.map((act, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[10px] leading-snug text-moss"
              >
                <span className="mt-px shrink-0 font-bold text-rustic-gold">›</span>
                <span className="line-clamp-1">{act}</span>
              </li>
            ))}
          </ul>

          {hidden > 0 && (
            <button
              onClick={() => setOpen(true)}
              className="mt-1.5 self-start text-[10px] font-semibold text-rustic-gold hover:underline"
            >
              + {hidden} more activit{hidden === 1 ? "y" : "ies"} →
            </button>
          )}

          <a
            href={`/guides/${exp.provider_id}`}
            className="mt-auto pt-1.5 text-[10px] font-semibold text-moss underline-offset-2 hover:text-rustic-gold hover:underline"
          >
            View on agency profile →
          </a>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-champagne bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-champagne px-5 py-3">
              <div>
                <p className="text-sm font-bold text-pine">{exp.title}</p>
                <p className="text-[10px] text-moss">
                  {exp.category}
                  {exp.duration_hours ? ` · ${exp.duration_hours}h` : ""}
                  {exp.price_dzd ? ` · ${exp.price_dzd.toLocaleString("en-US")} DZD` : ""}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-champagne text-xs font-bold text-pine transition hover:bg-rustic-gold hover:text-white"
              >
                X
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt={exp.title}
                  className="mb-4 h-40 w-full rounded-xl object-cover"
                />
              )}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rustic-gold">
                Full program ({activities.length} activities)
              </p>
              <ol className="space-y-2">
                {activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rustic-gold text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-snug text-moss">{act}</span>
                  </li>
                ))}
              </ol>

              {exp.photos && exp.photos.length > 1 && (
                <>
                  <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-rustic-gold">
                    Photos
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {exp.photos.slice(1).map((p, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={p}
                        alt={`${exp.title} photo ${i + 2}`}
                        className="h-20 w-full rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="border-t border-champagne px-5 py-3">
              <button
                onClick={() => setOpen(false)}
                className="w-full rounded-full bg-champagne py-1.5 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
