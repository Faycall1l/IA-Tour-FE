"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { PoiRead } from "@/lib/types";

const PER_PAGE = 8;

function GalleryModal({
  poi,
  onClose,
}: {
  poi: PoiRead;
  onClose: () => void;
}) {
  const images = (poi.photo_urls ?? []).filter(Boolean) as string[];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === " ")
        setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[70vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white text-sm transition hover:bg-black/60"
        >
          &times;
        </button>

        {images.length > 0 && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current]}
              alt={poi.name}
              className="h-44 w-full object-cover sm:h-52"
            />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrent((c) => (c - 1 + images.length) % images.length)
                  }
                  className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white text-xs transition hover:bg-black/60"
                >
                  &larr;
                </button>
                <button
                  onClick={() =>
                    setCurrent((c) => (c + 1) % images.length)
                  }
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white text-xs transition hover:bg-black/60"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>
        )}

        <div className="p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-champagne px-2 py-0.5 text-[9px] font-semibold text-pine">
              {poi.category}
            </span>
            {poi.suggested_duration_min && (
              <span className="text-[10px] text-moss">
                {poi.suggested_duration_min} min visit
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-pine">{poi.name}</h2>
          {(poi.commune || poi.neighborhood) && (
            <p className="mt-0.5 text-[11px] text-moss">
              {poi.neighborhood && `${poi.neighborhood}, `}
              {poi.commune}
            </p>
          )}
          {poi.description && (
            <p className="mt-2 text-xs leading-relaxed text-moss">
              {poi.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {poi.opening_hours && (
              <div className="rounded-lg border border-champagne bg-champagne/20 px-2.5 py-1.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-rustic-gold">
                  Hours
                </p>
                <p className="text-[11px] text-pine">{poi.opening_hours}</p>
              </div>
            )}
            {poi.commune && (
              <div className="rounded-lg border border-champagne bg-champagne/20 px-2.5 py-1.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-rustic-gold">
                  Location
                </p>
                <p className="text-[11px] text-pine">{poi.commune}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PicksClient({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const [wilayaIds, setWilayaIds] = useState<number[]>([]);
  const [siteIds, setSiteIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<PoiRead[]>([]);
  const [page, setPage] = useState(0);
  const [modalPoi, setModalPoi] = useState<PoiRead | null>(null);

  useEffect(() => {
    searchParams.then((sp) => {
      const w = typeof sp.wilayas === "string" ? sp.wilayas : "";
      const s = typeof sp.sites === "string" ? sp.sites : "";
      setWilayaIds(w ? w.split(",").map(Number).filter(Boolean) : []);
      setSiteIds(s ? s.split(",").filter(Boolean) : []);
    });
  }, [searchParams]);

  useEffect(() => {
    if (siteIds.length === 0) {
      setSelected([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      siteIds.map((id) =>
        client
          .GET("/api/v1/pois/{poi_id}", { params: { path: { poi_id: id } } })
          .then((res) => unwrap(res))
          .catch(() => null),
      ),
    ).then((results) => {
      if (!cancelled) setSelected(results.filter(Boolean) as PoiRead[]);
    });
    return () => { cancelled = true; };
  }, [siteIds]);

  const [otherPois, setOtherPois] = useState<PoiRead[]>([]);

  useEffect(() => {
    if (wilayaIds.length === 0) {
      setOtherPois([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      wilayaIds.map((id) =>
        client
          .GET("/api/v1/pois", {
            params: { query: { wilaya_id: id, page_size: 50 } },
          })
          .then((res) => unwrap(res).items)
          .catch(() => []),
      ),
    ).then((results) => {
      if (!cancelled) {
        const all = results.flat() as PoiRead[];
        setOtherPois(
          all.filter((p) => !selected.some((s) => s.id === p.id)),
        );
      }
    });
    return () => { cancelled = true; };
  }, [wilayaIds, selected]);

  const totalPages = Math.ceil(otherPois.length / PER_PAGE);
  const slice = otherPois.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  useEffect(() => setPage(0), [wilayaIds.length]);

  function toggleSelect(poi: PoiRead) {
    setSelected((prev) =>
      prev.some((s) => s.id === poi.id)
        ? prev.filter((s) => s.id !== poi.id)
        : [...prev, poi],
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/plan"
        className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
      >
        &larr; Back to destinations
      </Link>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pine">
          Pick your sites
        </h1>
        <p className="mt-1 text-sm text-moss">
          {selected.length > 0
            ? `${selected.length} site${selected.length !== 1 ? "s" : ""} selected`
            : "Choose the sites you want to visit"}
        </p>
      </header>

      {selected.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-sm font-bold text-pine">Your picks</h2>
          <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
            {selected.map((poi) => (
              <div
                key={poi.id}
                className="w-48 shrink-0 overflow-hidden rounded-2xl border border-pine bg-white shadow-sm transition hover:shadow-md"
              >
                {poi.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poi.photo_url}
                    alt={poi.name}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-xs font-bold text-pine/40">
                    No image
                  </div>
                )}
                <div className="flex items-center justify-between p-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-pine">
                      {poi.name}
                    </p>
                    <p className="text-[10px] text-moss">{poi.category}</p>
                  </div>
                  <button
                    onClick={() => toggleSelect(poi)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-champagne text-[11px] text-pine transition hover:bg-sea-foam"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {otherPois.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-bold text-pine">
            Choose more sites from your wilayas
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {slice.map((poi) => {
              const isSel = selected.some((s) => s.id === poi.id);
              return (
                <div
                  key={poi.id}
                  onClick={() => setModalPoi(poi)}
                  className={`group relative overflow-hidden rounded-2xl border text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                    isSel
                      ? "border-sea-foam bg-sea-foam/10"
                      : "border-champagne bg-white"
                  }`}
                >
                  {isSel && (
                    <div className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-pine text-[10px] font-bold text-white shadow">
                      &#10003;
                    </div>
                  )}
                  {poi.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={poi.photo_url}
                      alt={poi.name}
                      className={`h-28 w-full object-cover ${isSel ? "opacity-80" : ""}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-xs font-bold text-pine/40">
                      No image
                    </div>
                  )}
                  <div className="p-2.5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${isSel ? "bg-pine text-white" : "bg-champagne text-pine"}`}>
                        {poi.category}
                      </span>
                      {poi.suggested_duration_min && (
                        <span className="text-[9px] text-moss">
                          {poi.suggested_duration_min}m
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs font-bold text-pine">
                      {poi.name}
                    </p>
                    {poi.description && (
                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-moss">
                        {poi.description}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-2 text-[9px] text-moss">
                      {poi.opening_hours && (
                        <span className="truncate max-w-[100px]">
                          {poi.opening_hours}
                        </span>
                      )}
                      {poi.commune && (
                        <span className="truncate">{poi.commune}</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(poi);
                      }}
                      className={`mt-2 w-full rounded-full py-1 text-[10px] font-bold transition ${
                        isSel
                          ? "bg-champagne text-pine hover:bg-sea-foam"
                          : "bg-pine text-white hover:bg-rustic-gold"
                      }`}
                    >
                      {isSel ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-full bg-champagne px-4 py-1.5 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
              >
                &larr; Prev
              </button>
              <span className="min-w-[48px] text-center text-[11px] text-moss">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="rounded-full bg-champagne px-4 py-1.5 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white disabled:opacity-30"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </section>
      )}

      {otherPois.length === 0 && selected.length === 0 && (
        <div className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-12 text-center">
          <p className="text-sm font-bold text-pine">No sites found</p>
          <p className="mt-1 text-xs text-moss">
            Go back and choose some wilayas or search for specific sites.
          </p>
          <Link
            href="/plan"
            className="mt-4 inline-block rounded-full bg-pine px-5 py-2 text-xs font-bold text-white transition hover:bg-rustic-gold"
          >
            Choose destinations
          </Link>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-10 text-center">
          <Link
            href="/itinerary"
            className="inline-block rounded-full bg-pine px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rustic-gold"
          >
            Customize itinerary
          </Link>
        </div>
      )}

      {modalPoi && (
        <GalleryModal poi={modalPoi} onClose={() => setModalPoi(null)} />
      )}
    </div>
  );
}
