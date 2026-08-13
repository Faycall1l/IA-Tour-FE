import type { StayRead } from "@/lib/types";

/**
 * Stay detail amenities: wraps the full amenity list in the same pill style
 * used by cards. Rendered only when the stay carries amenities.
 */
export default function StayAmenities({ stay }: { stay: StayRead }) {
  const amenities = stay.amenities ?? [];
  if (amenities.length === 0) return null;

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Amenities</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {amenities.map((a) => (
          <span
            key={a}
            className="rounded-full bg-champagne/40 px-3 py-1 text-xs text-moss"
          >
            {a}
          </span>
        ))}
      </div>
    </section>
  );
}
