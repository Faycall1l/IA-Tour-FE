import Link from "next/link";
import type { StayRead } from "@/lib/types";

export default function StayCard({
  stay,
  wilayaName,
}: {
  stay: StayRead;
  wilayaName?: string;
}) {
  const s = stay;
  return (
    <Link
      href={`/stays/${s.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm transition hover:shadow-md"
    >
      {s.photos && s.photos.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={s.photos[0]}
          alt={s.name}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-4xl">
          🛏
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold text-pine">{s.name}</h2>
          <span className="shrink-0 rounded-full bg-champagne px-2 py-0.5 text-[10px] font-normal capitalize text-rustic-gold">
            {s.property_type}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-moss">
          Wilaya {s.wilaya_id}
          {wilayaName ? ` — ${wilayaName}` : ""}
        </p>
        {s.description && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-moss">
            {s.description}
          </p>
        )}
        <p className="mt-3 font-semibold text-emerald-700">
          {s.price_per_night_dzd.toLocaleString("en-US")} DZD
          <span className="text-xs font-normal text-moss"> /night</span>
        </p>
        {s.amenities && s.amenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {s.amenities.slice(0, 4).map((a) => (
              <span
                key={a}
                className="rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] text-moss"
              >
                {a}
              </span>
            ))}
            {s.amenities.length > 4 && (
              <span className="rounded-full bg-champagne/40 px-2 py-0.5 text-[10px] text-moss">
                +{s.amenities.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
