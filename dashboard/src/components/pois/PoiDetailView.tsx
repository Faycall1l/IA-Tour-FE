import type { PoiRead } from "@/lib/types";
import PoiHero from "@/components/pois/PoiHero";
import PoiFacts from "@/components/pois/PoiFacts";
import PoiActions from "@/components/pois/PoiActions";

/**
 * Shared POI detail layout: hero + description, facts grid and action
 * buttons. Used by /pois/[id] and /places/[id] (POI branch).
 */
export default function PoiDetailView({
  poi,
  wilayaName,
}: {
  poi: PoiRead;
  wilayaName?: string;
}) {
  return (
    <>
      <PoiHero poi={poi} />

      {poi.commune && (
        <p className="mt-4 text-sm text-moss">
          📍 {poi.commune}
          {wilayaName ? ` — wilaya ${poi.wilaya_id} ${wilayaName}` : ` — wilaya ${poi.wilaya_id}`}
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PoiFacts poi={poi} />
        </div>
        <aside className="space-y-6">
          <PoiActions poi={poi} />
        </aside>
      </div>
    </>
  );
}
