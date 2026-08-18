"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_POIS, resolveMockPath } from "@/lib/mock-data";
import type { PoiRead, WilayaSummary } from "@/lib/types";
import { WILAYA_COORDS } from "@/lib/sample-data";

const AlgeriaWilayaMap = dynamic(() => import("./AlgeriaWilayaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-champagne bg-champagne/30 text-sm text-moss">
      Loading map...
    </div>
  ),
});

type PickedWilaya = { key: string; name: string; id?: number };

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function PlanPageClient() {
  const router = useRouter();
  const [picked, setPicked] = useState<PickedWilaya[]>([]);
  const [pickedSites, setPickedSites] = useState<PoiRead[]>([]);
  const [query, setQuery] = useState("");
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = resolveMockPath(
      "/api/v1/discover/wilayas",
      new URLSearchParams(),
    ) as WilayaSummary[];
    setWilayas(w);
  }, []);

  const wilayaById = new Map(wilayas.map((w) => [w.id, w]));

  const siteResults =
    query.trim().length > 0
      ? MOCK_POIS.filter(
          (p) =>
            (p.name ?? "").toLowerCase().includes(query.toLowerCase()) ||
            (p.description ?? "").toLowerCase().includes(query.toLowerCase()),
        ).slice(0, 8)
      : [];

  const wilayaResults =
    query.trim().length > 0
      ? wilayas.filter((w) =>
          w.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const allResults = [
    ...wilayaResults.map((w) => ({ kind: "wilaya" as const, wilaya: w })),
    ...siteResults.map((p) => ({ kind: "poi" as const, poi: p })),
  ];

  function toggleWilaya(w: PickedWilaya) {
    setPicked((prev) =>
      prev.some((p) => p.key === w.key)
        ? prev.filter((p) => p.key !== w.key)
        : [...prev, w],
    );
  }

  function addSite(poi: PoiRead) {
    if (pickedSites.some((s) => s.id === poi.id)) return;
    setPickedSites((prev) => [...prev, poi]);
    const wName = wilayaById.get(poi.wilaya_id)?.name ?? "";
    const wId = poi.wilaya_id;
    const pw: PickedWilaya = { key: wName, name: wName, id: wId };
    setPicked((prev) =>
      prev.some((p) => p.key === pw.key) ? prev : [...prev, pw],
    );
    setQuery("");
    setOpen(false);
  }

  function selectResult(
    r:
      | { kind: "wilaya"; wilaya: WilayaSummary }
      | { kind: "poi"; poi: PoiRead },
  ) {
    if (r.kind === "wilaya") {
      const pw: PickedWilaya = {
        key: r.wilaya.name,
        name: r.wilaya.name,
        id: r.wilaya.id,
      };
      if (!picked.some((p) => p.key === pw.key))
        setPicked((prev) => [...prev, pw]);
    } else {
      addSite(r.poi);
      return;
    }
    setQuery("");
    setOpen(false);
  }

  function confirmChoices() {
    const wilayaIds = picked.map((p) => p.id).filter(Boolean).join(",");
    const siteIds = pickedSites.map((s) => s.id).join(",");
    const params = new URLSearchParams();
    if (wilayaIds) params.set("wilayas", wilayaIds);
    if (siteIds) params.set("sites", siteIds);
    router.push(`/plan/picks?${params.toString()}`);
  }

  const onDragStart = useCallback((idx: number) => setDragIdx(idx), []);
  const onDragOver = useCallback(
    (e: React.DragEvent) => e.preventDefault(),
    [],
  );
  const onDrop = useCallback(
    (targetIdx: number) => {
      if (dragIdx === null || dragIdx === targetIdx) return;
      setPicked((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragIdx, 1);
        next.splice(targetIdx, 0, moved);
        return next;
      });
      setDragIdx(null);
    },
    [dragIdx],
  );
  const onDragEnd = useCallback(() => setDragIdx(null), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
      >
        &larr; Home
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pine">
          Choose your destinations
        </h1>
        <p className="mt-1 text-sm text-moss">
          Select wilayas on the map or search for a specific site. Drag to
          reorder your route.
        </p>
      </header>

      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center gap-3 rounded-full border border-champagne bg-white px-4 py-2 shadow-sm">
        <div className="flex w-1/6 shrink-0 items-center gap-2">
          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-champagne bg-white px-2 py-1 text-xs text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
          />
        </div>
        <span className="text-xs text-rustic-gold">&rarr;</span>
        <div className="flex w-1/6 shrink-0 items-center gap-2">
          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-lg border border-champagne bg-white px-2 py-1 text-xs text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
          />
        </div>
        <div className="mx-2 h-5 w-px shrink-0 bg-champagne" />

        <div ref={wrapRef} className="relative flex flex-1 items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => query.trim().length > 0 && setOpen(true)}
            placeholder="Search a wilaya or site..."
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

          {open && allResults.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-champagne bg-white shadow-lg">
              {allResults.slice(0, 10).map((m, i) => {
                const isAdded =
                  m.kind === "wilaya"
                    ? picked.some((p) => p.key === m.wilaya.name)
                    : pickedSites.some((s) => s.id === m.poi.id);
                return (
                  <button
                    key={i}
                    onClick={() => selectResult(m)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-pine transition hover:bg-champagne/50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-champagne text-[10px] text-moss">
                      {m.kind === "wilaya" ? "W" : "POI"}
                    </div>
                    <div className="min-w-0 flex-1">
                      {m.kind === "wilaya" ? (
                        <p className="font-medium">{m.wilaya.name}</p>
                      ) : (
                        <>
                          <p className="truncate font-medium">
                            {m.poi.name ?? m.poi.category}
                          </p>
                          <p className="truncate text-[11px] text-moss">
                            in {wilayaById.get(m.poi.wilaya_id)?.name ?? ""}
                          </p>
                        </>
                      )}
                    </div>
                    {isAdded && (
                      <span className="ml-auto shrink-0 text-xs font-semibold text-sea-foam">
                        added
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {pickedSites.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {pickedSites.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-sea-foam/40 bg-sea-foam/10 px-3 py-1 text-xs font-medium text-pine"
            >
              {s.name}
              <button
                onClick={() =>
                  setPickedSites((prev) => prev.filter((x) => x.id !== s.id))
                }
                className="flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] text-pine transition hover:bg-sea-foam"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-champagne bg-white p-3 shadow-sm lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <p className="text-xs font-normal text-moss">
              Click a wilaya on the map to add it
            </p>
            <span className="shrink-0 rounded-full bg-champagne px-2.5 py-0.5 text-[10px] font-normal text-pine">
              {picked.length} picked
            </span>
          </div>
          <AlgeriaWilayaMap
            selectedKeys={picked.map((p) => p.key)}
            onToggle={toggleWilaya}
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-champagne bg-white p-3 shadow-sm">
          <h3 className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
            Your wilayas
          </h3>
          {picked.length === 0 ? (
            <div className="mt-3 flex flex-1 items-center justify-center rounded-xl border border-dashed border-champagne bg-champagne/20 p-4 text-center text-xs text-moss">
              No wilaya selected yet — click on the map or
              search above.
            </div>
          ) : (
            <div className="no-scrollbar mt-3 flex flex-1 flex-col gap-0 overflow-y-auto">
              {picked.map((p, idx) => {
                let kmText = "";
                if (idx > 0 && p.id) {
                  const prev = picked[idx - 1];
                  if (prev.id) {
                    const c1 = WILAYA_COORDS[p.id];
                    const c2 = WILAYA_COORDS[prev.id];
                    if (c1 && c2) {
                      const km = Math.round(
                        haversineKm(
                          c1.latitude,
                          c1.longitude,
                          c2.latitude,
                          c2.longitude,
                        ),
                      );
                      kmText = `~${km} km`;
                    }
                  }
                }
                return (
                  <div key={p.key}>
                    {kmText && (
                      <div className="flex items-center gap-2 py-1 pl-7">
                        <div className="flex-1 border-t border-dashed border-rustic-gold/30" />
                        <span className="text-[10px] font-medium text-rustic-gold">
                          {kmText}
                        </span>
                        <div className="flex-1 border-t border-dashed border-rustic-gold/30" />
                      </div>
                    )}
                    <div
                      draggable
                      onDragStart={() => onDragStart(idx)}
                      onDragOver={onDragOver}
                      onDrop={() => onDrop(idx)}
                      onDragEnd={onDragEnd}
                      className={`flex items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm cursor-grab active:cursor-grabbing ${
                        dragIdx === idx
                          ? "border-rustic-gold opacity-60"
                          : "border-champagne"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne text-[10px] font-bold text-pine">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-pine">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {p.id && (
                          <Link
                            href={`/wilayas/${p.id}`}
                            className="text-[10px] font-semibold text-rustic-gold hover:underline"
                          >
                            View
                          </Link>
                        )}
                        <button
                          onClick={() => toggleWilaya(p)}
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-champagne text-[11px] text-pine transition hover:bg-sea-foam"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {picked.length > 0 && (
            <button
              onClick={confirmChoices}
              className="mt-3 w-full rounded-full bg-pine px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rustic-gold"
            >
              Confirm choices
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
