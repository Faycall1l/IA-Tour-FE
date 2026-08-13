import type { StayRead } from "@/lib/types";

/**
 * Stay detail facts: check-in/check-out, max guests, total rooms and
 * coordinates when present. Rendered as a labelled two-column grid.
 */
export default function StayFacts({ stay }: { stay: StayRead }) {
  const facts: { label: string; value: string }[] = [];
  if (stay.check_in_time)
    facts.push({ label: "Check-in", value: stay.check_in_time });
  if (stay.check_out_time)
    facts.push({ label: "Check-out", value: stay.check_out_time });
  if (stay.max_guests != null)
    facts.push({ label: "Max guests", value: String(stay.max_guests) });
  if (stay.total_rooms != null)
    facts.push({ label: "Rooms", value: String(stay.total_rooms) });
  if (stay.latitude != null && stay.longitude != null)
    facts.push({
      label: "Coordinates",
      value: `${stay.latitude.toFixed(4)}, ${stay.longitude.toFixed(4)}`,
    });

  if (facts.length === 0) return null;

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Good to know</h2>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        {facts.map((f) => (
          <div key={f.label} className="rounded-xl bg-champagne/20 p-3">
            <dt className="text-xs text-moss">{f.label}</dt>
            <dd className="mt-0.5 font-medium text-pine">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
