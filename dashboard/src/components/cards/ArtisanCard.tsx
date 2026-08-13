import Link from "next/link";
import type { ArtisanRead } from "@/lib/types";

const CRAFT_EMOJIS: Record<string, string> = {
  pottery: "🏺",
  "leather crafts": "👜",
  "carpets & textiles": "🧶",
  "silver jewellery": "💍",
  "coral & jewellery": "📿",
  woodcraft: "🪵",
  weaving: "🧵",
  embroidery: "🪡",
  calligraphy: "🖋️",
  "metal work": "⚒️",
  "glass work": "🫙",
};

export function craftEmoji(craft: string): string {
  const key = craft.toLowerCase();
  return CRAFT_EMOJIS[key] ?? CRAFT_EMOJIS[key.split(" ")[0]] ?? "🛠️";
}

export default function ArtisanCard({ artisan }: { artisan: ArtisanRead }) {
  const a = artisan;
  const nearest = a.nearest_transit?.[0];
  return (
    <Link
      href={`/artisans/${a.id}`}
      className="group rounded-xl border border-champagne bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sea-foam to-champagne text-2xl">
          {craftEmoji(a.craft_type)}
        </div>
        <span className="rounded-full bg-champagne px-2.5 py-1 text-xs capitalize text-rustic-gold">
          {a.craft_type}
        </span>
      </div>
      <h2 className="mt-3 font-semibold text-pine">{a.name}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-moss">
        {a.description ?? "A local artisan workshop."}
      </p>
      {nearest ? (
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-sea-foam/40 px-2.5 py-1 text-xs font-medium text-pine">
          🚶 {nearest.walking_time_min} min · {nearest.station_name}
        </p>
      ) : (
        <p className="mt-3 text-xs text-moss">No nearby transit stop</p>
      )}
      <p className="mt-3 text-xs font-semibold text-rustic-gold">
        Visit workshop →
      </p>
    </Link>
  );
}
