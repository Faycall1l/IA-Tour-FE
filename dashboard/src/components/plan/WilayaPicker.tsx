"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";
import PlanSections from "./PlanSections";
import type { PickedWilaya } from "./AlgeriaWilayaMap";

const AlgeriaWilayaMap = dynamic(() => import("./AlgeriaWilayaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-champagne bg-champagne/30 text-sm text-moss">
      Loading map…
    </div>
  ),
});

const DEFAULT_PICKS: PickedWilaya[] = [
  { key: "Alger", name: "Alger", id: 16 },
  { key: "Béjaïa", name: "Béjaïa", id: 6 },
  { key: "Tamanrasset", name: "Tamanrasset", id: 11 },
];

export default function WilayaPicker() {
  const [picked, setPicked] = useState<PickedWilaya[]>(DEFAULT_PICKS);
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        const list = unwrap(res);
        setWilayas(Array.isArray(list) ? list : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(wilaya: PickedWilaya) {
    setPicked((prev) =>
      prev.some((p) => p.key === wilaya.key)
        ? prev.filter((p) => p.key !== wilaya.key)
        : [...prev, wilaya],
    );
  }

  const wilayaById = new Map(wilayas.map((w) => [w.id, w]));

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-champagne bg-white p-3 shadow-sm lg:col-span-2">
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <p className="text-xs font-normal text-moss">
            Click a wilaya on the map to add it to your trip
          </p>
          <span className="shrink-0 rounded-full bg-champagne px-2.5 py-0.5 text-[10px] font-normal text-pine">
            {picked.length} picked
          </span>
        </div>
        <AlgeriaWilayaMap
          selectedKeys={picked.map((p) => p.key)}
          onToggle={toggle}
        />
      </div>

      <div className="flex flex-col rounded-2xl border border-champagne bg-white p-3 shadow-sm">
        <h3 className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
          Your picks
        </h3>
        {picked.length === 0 ? (
          <div className="mt-3 flex flex-1 items-center justify-center rounded-xl border border-dashed border-champagne bg-champagne/20 p-4 text-center text-xs text-moss">
            No wilaya selected yet — click on the map to add one.
          </div>
        ) : (
          <div className="no-scrollbar mt-3 flex flex-1 gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto">
            {picked.map((p) => {
              const w = p.id ? wilayaById.get(p.id) : undefined;
              const photo = w?.highlight_poi_photo ?? undefined;
              return (
                <div
                  key={p.key}
                  className="relative w-36 shrink-0 rounded-xl border border-champagne bg-white p-2.5 shadow-sm lg:w-full"
                >
                  <button
                    onClick={() => toggle(p)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-champagne text-[10px] text-pine transition hover:bg-sea-foam"
                  >
                    ×
                  </button>
                  {photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photo}
                      alt={w?.name ?? p.name}
                      className="mb-1.5 h-16 w-full rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  <p className="pr-4 text-xs font-normal text-pine">{p.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] text-moss">
                    {status === "error"
                      ? `Wilaya n°${p.id ?? "?"}`
                      : (w?.highlight_poi ??
                        w?.description ??
                        `Wilaya n°${p.id ?? "?"}`)}
                  </p>
                  {p.id && (
                    <Link
                      href={`/wilayas/${p.id}`}
                      className="mt-2 inline-block text-[10px] font-normal text-rustic-gold transition hover:text-pine hover:underline"
                    >
                      View {w?.name ?? p.name} →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>

    <PlanSections picked={picked} />
    </>
  );
}
