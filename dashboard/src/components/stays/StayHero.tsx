import type { StayRead } from "@/lib/types";

/**
 * Stay detail hero: primary photo (or a champagne placeholder), name,
 * property-type pill, wilaya name, price per night and address.
 */
export default function StayHero({
  stay,
  wilayaName,
}: {
  stay: StayRead;
  wilayaName?: string;
}) {
  const photos = stay.photos ?? [];
  return (
    <div className="overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
      {photos.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photos[0]}
          alt={stay.name}
          className="h-72 w-full object-cover sm:h-96"
        />
      ) : (
        <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-6xl sm:h-96">
          🛏
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-champagne px-2.5 py-1 text-xs font-semibold capitalize text-rustic-gold">
            {stay.property_type.replaceAll("_", " ")}
          </span>
          <span className="rounded-full bg-champagne/40 px-2.5 py-1 text-xs font-normal text-moss">
            Wilaya {stay.wilaya_id}
            {wilayaName ? ` — ${wilayaName}` : ""}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-pine">
          {stay.name}
        </h1>

        {stay.address && (
          <p className="mt-2 text-sm text-moss">📍 {stay.address}</p>
        )}

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-emerald-700">
            {stay.price_per_night_dzd.toLocaleString("en-US")} DZD
          </span>
          <span className="text-sm text-moss">/night</span>
        </div>
      </div>
    </div>
  );
}
