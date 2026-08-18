import type { PoiRead } from "@/lib/types";

/**
 * POI detail facts: entry fee, suggested visit, opening hours, cuisine,
 * phone, location and accessibility flags. Only renders rows that exist.
 */
export default function PoiFacts({ poi }: { poi: PoiRead }) {
  const rows: { label: string; value: string }[] = [];
  rows.push({
    label: "Entry fee",
    value: poi.entry_fee_dzd ? `${poi.entry_fee_dzd} DZD` : "Free",
  });
  rows.push({
    label: "Suggested visit",
    value: poi.suggested_duration_min ? `${poi.suggested_duration_min} min` : "—",
  });
  if (poi.opening_hours) rows.push({ label: "Opening hours", value: poi.opening_hours });
  if (poi.cuisine)
    rows.push({ label: "Cuisine", value: poi.cuisine });
  if (poi.operator) rows.push({ label: "Operator", value: poi.operator });
  if (poi.phone) rows.push({ label: "Phone", value: poi.phone });
  if (poi.latitude != null && poi.longitude != null)
    rows.push({
      label: "Location",
      value: `${poi.latitude.toFixed(5)}, ${poi.longitude.toFixed(5)}`,
    });

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Good to know</h2>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl bg-champagne/20 p-3">
            <dt className="text-xs text-moss">{r.label}</dt>
            <dd className="mt-0.5 font-medium capitalize text-pine">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      {(poi.has_parking || poi.has_accessibility) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {poi.has_parking && (
            <span className="rounded-full bg-champagne/40 px-3 py-1 text-xs text-moss">
              Parking available
            </span>
          )}
          {poi.has_accessibility && (
            <span className="rounded-full bg-champagne/40 px-3 py-1 text-xs text-moss">
              Accessibility
            </span>
          )}
        </div>
      )}
    </section>
  );
}
