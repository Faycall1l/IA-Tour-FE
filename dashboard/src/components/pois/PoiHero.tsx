import type { PoiRead } from "@/lib/types";

const CATEGORY_EMOJIS: Record<string, string> = {
  historical: "🏛",
  cultural: "🎭",
  museum: "🖼",
  religious: "🕌",
  natural: "🌿",
  beach: "🏖",
  mountain: "⛰",
  park: "🌳",
  market: "🛍",
  restaurant: "🍽",
  cafe: "☕",
  other: "📍",
};

/**
 * POI detail hero: photo (or a category-emoji placeholder), category/subtype/
 * featured pills, name (FR + AR + EN), description and fun fact.
 */
export default function PoiHero({ poi }: { poi: PoiRead }) {
  const images = [
    ...(poi.photo_url ? [poi.photo_url] : []),
    ...(poi.photo_urls ?? []),
  ].filter((u, i, a) => a.indexOf(u) === i);

  return (
    <div className="overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
      {images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={images[0]}
          alt={poi.name ?? poi.category}
          className="h-72 w-full object-cover sm:h-96"
        />
      ) : (
        <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-6xl sm:h-96">
          {CATEGORY_EMOJIS[poi.category] ?? "📍"}
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-champagne px-2.5 py-1 text-xs font-semibold capitalize text-rustic-gold">
            {poi.category}
          </span>
          {poi.subtype && (
            <span className="rounded-full bg-champagne/40 px-2.5 py-1 text-xs capitalize text-moss">
              {poi.subtype.replaceAll("_", " ")}
            </span>
          )}
          {poi.is_featured && (
            <span className="rounded-full bg-rustic-gold px-2.5 py-1 text-xs font-semibold text-white">
              ★ Featured
            </span>
          )}
          {poi.ranking_position != null && poi.ranking_total != null && (
            <span className="rounded-full bg-champagne/40 px-2.5 py-1 text-xs text-moss">
              #{poi.ranking_position} of {poi.ranking_total} in category
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-pine">
          {poi.name ?? `Unnamed ${poi.category}`}
          {poi.name_en && poi.name_en !== poi.name && (
            <span className="ml-2 align-middle text-lg font-normal text-moss">
              {poi.name_en}
            </span>
          )}
        </h1>
        {poi.name_ar && (
          <p dir="rtl" className="mt-1 text-xl text-moss">
            {poi.name_ar}
          </p>
        )}

        {poi.description && (
          <p className="mt-4 leading-relaxed text-moss">{poi.description}</p>
        )}

        {poi.fun_fact && (
          <div className="mt-5 rounded-xl border border-champagne bg-champagne/30 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-rustic-gold">
              Did you know?
            </p>
            <p className="mt-1 text-pine">{poi.fun_fact}</p>
          </div>
        )}
      </div>
    </div>
  );
}
