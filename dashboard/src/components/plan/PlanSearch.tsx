"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ExperienceRead, PoiRead, WilayaSummary } from "@/lib/types";
import type { PickedWilaya } from "./AlgeriaWilayaMap";

type SearchResult =
  | { kind: "wilaya"; wilaya: WilayaSummary }
  | { kind: "poi"; poi: PoiRead; wilayaName: string }
  | { kind: "experience"; exp: ExperienceRead; wilayaName: string };

export default function PlanSearch({
  picked,
  onToggle,
  onSelect,
}: {
  picked: PickedWilaya[];
  onToggle: (w: PickedWilaya) => void;
  onSelect: (w: PickedWilaya) => void;
}) {
  const [query, setQuery] = useState("");
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [pois, setPois] = useState<PoiRead[]>([]);
  const [experiences, setExperiences] = useState<ExperienceRead[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      client.GET("/api/v1/discover/wilayas"),
      client.GET("/api/v1/pois", { params: { query: { page_size: 200 } } }),
      client.GET("/api/v1/experiences", { params: { query: { page_size: 200 } } }),
    ]).then(([wRes, pRes, eRes]) => {
      if (cancelled) return;
      setWilayas(unwrap(wRes) ?? []);
      setPois(unwrap(pRes)?.items ?? []);
      setExperiences(unwrap(eRes)?.items ?? []);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const wilayaById = new Map(wilayas.map((w) => [w.id, w]));

  const matches = query.trim().length > 0 ? searchAll(query.trim(), wilayas, pois, experiences, wilayaById) : [];

  const pick = useCallback(
    (wilayaName: string, wilayaId?: number) => {
      const pw: PickedWilaya = { key: wilayaName, name: wilayaName, id: wilayaId };
      if (!picked.some((p) => p.key === pw.key)) {
        onSelect(pw);
      }
      setQuery("");
      setOpen(false);
    },
    [picked, onSelect],
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapRef} className="relative flex flex-1 items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.trim().length > 0 && setOpen(true)}
        placeholder="Search a place, site, or experience…"
        className="w-full bg-transparent px-1 py-1 text-sm text-pine placeholder-moss/50 outline-none"
      />
      <svg
        className="h-4 w-4 shrink-0 text-moss"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {open && matches.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-champagne bg-white shadow-lg">
          {matches.slice(0, 10).map((m, i) => {
            const wName =
              m.kind === "wilaya"
                ? m.wilaya.name
                : m.kind === "poi"
                  ? wilayaById.get(m.poi.wilaya_id)?.name ?? `Wilaya ${m.poi.wilaya_id}`
                  : wilayaById.get(m.exp.wilaya_id)?.name ?? `Wilaya ${m.exp.wilaya_id}`;
            const wId =
              m.kind === "wilaya"
                ? m.wilaya.id
                : m.kind === "poi"
                  ? m.poi.wilaya_id
                  : m.exp.wilaya_id;
            const already = picked.some((p) => p.key === wName);
            return (
              <button
                key={i}
                onClick={() => pick(wName, wId)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-pine transition hover:bg-champagne/50"
              >
                {m.kind === "wilaya" && m.wilaya.highlight_poi_photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.wilaya.highlight_poi_photo}
                    alt={m.wilaya.name}
                    className="h-8 w-8 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-champagne text-[10px] text-moss">
                    {m.kind === "wilaya" ? "W" : m.kind === "poi" ? "POI" : "EXP"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {m.kind === "wilaya" ? (
                    <p className="font-medium">{m.wilaya.name}</p>
                  ) : (
                    <>
                      <p className="font-medium truncate">
                        {m.kind === "poi" ? (m.poi.name ?? m.poi.category) : m.exp.title}
                      </p>
                      <p className="text-[11px] text-moss truncate">
                        in {wName}
                      </p>
                    </>
                  )}
                </div>
                {already && (
                   <span className="ml-auto shrink-0 text-xs font-semibold text-sea-foam">added</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function searchAll(
  q: string,
  wilayas: WilayaSummary[],
  pois: PoiRead[],
  experiences: ExperienceRead[],
  wilayaById: Map<number, WilayaSummary>,
): SearchResult[] {
  const lower = q.toLowerCase();
  const results: SearchResult[] = [];

  for (const w of wilayas) {
    if (w.name.toLowerCase().includes(lower)) {
      results.push({ kind: "wilaya", wilaya: w });
    }
  }

  for (const p of pois) {
    if ((p.name ?? "").toLowerCase().includes(lower) || (p.description ?? "").toLowerCase().includes(lower)) {
      results.push({ kind: "poi", poi: p, wilayaName: wilayaById.get(p.wilaya_id)?.name ?? "" });
    }
  }

  for (const e of experiences) {
    if (e.title.toLowerCase().includes(lower) || (e.description ?? "").toLowerCase().includes(lower)) {
      results.push({ kind: "experience", exp: e, wilayaName: wilayaById.get(e.wilaya_id)?.name ?? "" });
    }
  }

  return results;
}
