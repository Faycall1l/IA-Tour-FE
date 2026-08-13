import type { PoiRead } from "@/lib/types";

/**
 * POI detail actions: "Visit website" and "Open in Maps" buttons. Only
 * renders what is available for the POI.
 */
export default function PoiActions({ poi }: { poi: PoiRead }) {
  const hasAny =
    Boolean(poi.website) || (poi.latitude != null && poi.longitude != null);
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {poi.website && (
        <a
          href={poi.website}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white transition hover:bg-moss"
        >
          Visit website
        </a>
      )}
      {poi.latitude != null && poi.longitude != null && (
        <a
          href={`https://www.google.com/maps?q=${poi.latitude},${poi.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-champagne bg-white px-4 py-2 text-sm font-medium text-pine transition hover:bg-champagne/30"
        >
          Open in Maps
        </a>
      )}
    </div>
  );
}
