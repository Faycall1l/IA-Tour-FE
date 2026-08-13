/**
 * Sample itinerary path for previewing the design before the backend is wired
 * to real picks. It mirrors the shape of what /plan + /stays persist, so the
 * itinerary page renders the full trip: the stay at the top, then for each
 * site a round trip — outbound transport (stay → site), the site node (date +
 * guide avatars), then the transport back to the stay (site → stay).
 */

import type { PickedSite, PickedStay } from "@/lib/itinerary";
import { MOCK_POIS, MOCK_STAYS } from "@/lib/mock-data";
import { WILAYA_NAMES } from "@/lib/sample-data";

function pickPoi(wilayaId: number, name: string): PickedSite {
  const poi = MOCK_POIS.find(
    (p) => p.wilaya_id === wilayaId && p.name === name,
  );
  if (!poi) throw new Error(`mock POI not found: ${wilayaId} ${name}`);
  return {
    id: poi.id,
    name: poi.name,
    category: poi.category,
    wilaya_id: poi.wilaya_id,
    wilaya_name: WILAYA_NAMES[poi.wilaya_id] ?? `Wilaya ${poi.wilaya_id}`,
    photo_url: poi.photo_url ?? null,
  };
}

function pickStay(id: string): PickedStay {
  const stay = MOCK_STAYS.find((s) => s.id === id);
  if (!stay) throw new Error(`mock stay not found: ${id}`);
  return {
    id: stay.id,
    name: stay.name,
    property_type: stay.property_type,
    wilaya_id: stay.wilaya_id,
    address: stay.address,
    latitude: stay.latitude,
    longitude: stay.longitude,
    price_per_night_dzd: stay.price_per_night_dzd,
    photos: stay.photos,
  };
}

/**
 * A plausible 4-day path: sleep in Algiers, drive/train to Béjaïa, fly south
 * to the Hoggar. Nodes appear in this order, so the edges are 16→6 then 6→11.
 */
export const MOCK_PICKED_SITES: PickedSite[] = [
  pickPoi(6, "Gouraya National Park"),
  pickPoi(6, "Cap Carbon"),
  pickPoi(11, "Assekrem"),
  pickPoi(11, "Hoggar Mountains"),
];

export const MOCK_PICKED_STAY: PickedStay = pickStay("stay-alger-aurassi");

/** Sample "arrive on" datetimes keyed by site id (local ISO, no zone). */
export const MOCK_ITINERARY_DATES: Record<string, string> = {
  "poi-6-gouraya-national-park": "2026-09-14T09:00",
  "poi-6-cap-carbon": "2026-09-15T09:00",
  "poi-11-assekrem": "2026-09-17T07:30",
  "poi-11-hoggar-mountains": "2026-09-18T07:00",
};

/**
 * Sample chosen transport per edge key. You sleep at a stay each night, so
 * each site is a round trip from its base stay (`{stayId}->{siteId}` out,
 * `{siteId}->{stayId}` back). When a site is too far (a flight), the stay
 * switches instead: a long-haul transfer edge `{prevStayId}->{nextStayId}`
 * flies you to the new region.
 */
export const MOCK_CHOSEN_TRANSPORTS: Record<string, string> = {
  "stay-alger-aurassi->poi-6-gouraya-national-park": "bus",
  "stay-alger-aurassi->stay-tam-hoggar": "flight",
};
