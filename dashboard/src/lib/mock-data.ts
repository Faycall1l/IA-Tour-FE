/**
 * Offline mock dataset + URL resolver.
 *
 * When the backend cannot be reached, the API client (src/lib/client.ts)
 * replays GET requests against this module so the app still demos fully.
 * The dataset is derived from the existing sample data in sample-data.ts and
 * mirrors the OpenAPI-generated shapes from api-types.ts.
 */
import {
  SAMPLE_ARTISANS,
  SAMPLE_WILAYAS,
  SAMPLE_WILAYA_SITES,
  WILAYA_COORDS,
  WILAYA_NAMES,
} from "./sample-data";
import type {
  ArtisanFeed,
  ArtisanRead,
  EventFeed,
  EventRead,
  ExperienceDetail,
  ExperienceFeed,
  ExperienceRead,
  PoiFeed,
  PoiRead,
  ProviderProfileRead,
  ProviderUserRead,
  StayFeed,
  StayRead,
  WilayaDetail,
  WilayaSummary,
} from "./types";
import type {
  RouteResponse,
  TransportContact,
  TransportOption,
} from "@/components/itinerary/types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function wilayaName(id: number): string {
  return WILAYA_NAMES[id] ?? `Wilaya ${id}`;
}

function coords(id: number): { latitude: number; longitude: number } {
  return WILAYA_COORDS[id] ?? { latitude: 36.75, longitude: 3.06 };
}

function feed<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const sliced = items.slice(start, start + pageSize);
  return {
    items: sliced,
    total: items.length,
    page,
    page_size: pageSize,
    total_pages: Math.max(1, Math.ceil(items.length / pageSize)),
    has_prev: page > 1,
    has_next: start + pageSize < items.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POIs (derived from SAMPLE_WILAYA_SITES)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_POIS: PoiRead[] = Object.entries(SAMPLE_WILAYA_SITES).flatMap(
  ([wilayaId, sites]) =>
    sites.map((site) => ({
      id: `poi-${wilayaId}-${slugify(site.name)}`,
      name: site.name,
      category: site.category,
      wilaya_id: Number(wilayaId),
      description: site.description,
      photo_url: site.photo,
      photo_urls: [site.photo],
      latitude: coords(Number(wilayaId)).latitude,
      longitude: coords(Number(wilayaId)).longitude,
      is_featured: true,
      created_at: "2025-01-01T00:00:00Z",
      is_favorited: false,
    })),
);

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// ─────────────────────────────────────────────────────────────────────────────
// Stays
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_STAYS: StayRead[] = [
  stay("stay-alger-aurassi", "Hôtel El Aurassi", "hotel", 16, 14500, ["WiFi", "Pool", "Restaurant", "Sea view"], "Iconic tower hotel above the Bay of Algiers, a short walk from the Casbah."),
  stay("stay-alger-dar-diaf", "Dar Diaf Boutique Hôtel", "guesthouse", 16, 9800, ["WiFi", "Breakfast", "Roof terrace", "Restaurant"], "Ottoman palace turned boutique hotel in the heart of the Casbah."),
  stay("stay-oran-marhaba", "Hôtel Marhaba", "hotel", 31, 8900, ["WiFi", "Restaurant", "Breakfast", "Parking"], "Comfortable city hotel near the Front de Mer esplanade."),
  stay("stay-oran-el-bahia", "El Bahia Palace", "resort", 31, 16200, ["WiFi", "Pool", "Spa", "Restaurant", "Private beach"], "Seafront resort on the Oran corniche with direct beach access."),
  stay("stay-constantine-cirta", "Hôtel Cirta", "hotel", 25, 7600, ["WiFi", "Breakfast", "Restaurant"], "Perched over the Rhumel gorge, minutes from the Sidi M'Cid bridge."),
  stay("stay-constantine-dar-el-ihsan", "Dar El Ihsan", "riad", 25, 5400, ["WiFi", "Breakfast", "Courtyard"], "Restored riad with an interior courtyard near the Palace of Ahmed Bey."),
  stay("stay-tlemcen-mechouar", "Riad El Mechouar", "riad", 13, 6100, ["WiFi", "Breakfast", "Patio", "Hammam"], "Andalusian riad beside the Mechouar citadel."),
  stay("stay-bejaia-gouraya", "Hôtel Les Hammadites", "hotel", 6, 9200, ["WiFi", "Restaurant", "Beach access", "Parking"], "On the Corniche of Béjaïa with views over Gouraya."),
  stay("stay-bejaia-aokas", "Aokas Guesthouse", "guesthouse", 6, 4200, ["WiFi", "Breakfast", "Kitchen"], "Seaside guesthouse in the fishing village of Aokas."),
  stay("stay-tam-hoggar", "Hoggar Base Camp", "camp_site", 11, 3500, ["Meals", "Campfire", "Guided treks"], "Tuareg-run desert camp at the foot of the Hoggar."),
  stay("stay-annaba-regina", "Hôtel Régina", "hotel", 23, 8400, ["WiFi", "Restaurant", "Breakfast"], "Elegant colonial-era hotel near the Basilica of Saint Augustine."),
  stay("stay-ghardaia-mzab", "Mzab Desert Lodge", "apartment", 47, 5100, ["WiFi", "Kitchen", "Terrace"], "Modern apartments in the valley looking over the pentapolis."),
  stay("stay-setif-timgad", "Timgad View Hostel", "hostel", 19, 2200, ["WiFi", "Shared kitchen", "Lockers"], "Budget base camp for visiting the Roman ruins of Timgad."),
  stay("stay-djanet-tassili", "Tassili Tented Camp", "camp_site", 56, 4800, ["Meals", "Campfire", "4x4 transfers"], "Permanent tents beneath the Tadrart dunes."),
];

function stay(
  id: string,
  name: string,
  property_type: string,
  wilaya_id: number,
  price_per_night_dzd: number,
  amenities: string[],
  description: string,
): StayRead {
  const c = coords(wilaya_id);
  return {
    id,
    provider_id: `prov-${wilaya_id}`,
    name,
    property_type,
    description,
    wilaya_id,
    address: `${wilayaName(wilaya_id)}, Algeria`,
    latitude: c.latitude,
    longitude: c.longitude,
    price_per_night_dzd,
    amenities,
    photos: [],
    check_in_time: "14:00",
    check_out_time: "12:00",
    max_guests: 2,
    total_rooms: 12,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: null,
    is_favorited: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Providers (guides + agencies)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_PROVIDERS: ProviderUserRead[] = [
  guide(
    "guide-karim-benali",
    "Karim Benali",
    ["Algiers", "Blida"],
    ["Arabic", "French", "English"],
    "City specialist: Casbah walks, Ottoman palaces and the museums of Algiers.",
    "karim",
  ),
  guide(
    "guide-yasmine-haddad",
    "Yasmine Haddad",
    ["Béjaïa", "Tizi Ouzou"],
    ["Arabic", "Kabyle", "French"],
    "Kabylie mountains and Mediterranean coves, from Gouraya to the Djurdjura.",
    "yasmine",
  ),
  guide(
    "guide-amine-touati",
    "Amine Touati",
    ["Oran"],
    ["Arabic", "French", "Spanish"],
    "Oran's history, rai music and the Santa Cruz fort at sunset.",
    "amine",
  ),
  guide(
    "guide-lina-cherif",
    "Lina Cherif",
    ["Constantine", "Annaba", "Guelma"],
    ["Arabic", "French", "English"],
    "Roman sites of the high plateaus: Timgad, Djemila and the bridges of Constantine.",
    "lina",
  ),
  guide(
    "guide-slimane-zerrouki",
    "Slimane Zerrouki",
    ["Tamanrasset", "Djanet"],
    ["Arabic", "French", "English", "Tamasheq"],
    "Desert guide for the Hoggar and the Tassili — rock art, dunes and Tuareg culture.",
    "slimane",
  ),
  agency(
    "agency-sahara-trails",
    "Sahara Trails",
    ["Tamanrasset", "Djanet", "Adrar"],
    "Deep-desert specialists running guided Hoggar and Tassili expeditions.",
    "sahara",
  ),
  agency(
    "agency-atlas-nomade",
    "Atlas Nomade",
    ["Algiers", "Oran", "Constantine"],
    "Coast-to-Sahara packages linking the white city to the deep south.",
    "atlas",
  ),
];

function guide(
  id: string,
  displayName: string,
  serviceAreas: string[],
  languages: string[],
  bio: string,
  avatarSeed: string,
): ProviderUserRead {
  return provider(id, displayName, "guide", languages, serviceAreas, bio, `https://i.pravatar.cc/150?img=${avatarSeed}`);
}

function agency(
  id: string,
  companyName: string,
  serviceAreas: string[],
  bio: string,
  avatarSeed: string,
): ProviderUserRead {
  return provider(id, companyName, "agency", null, serviceAreas, bio, `https://i.pravatar.cc/150?img=${avatarSeed}`);
}

function provider(
  id: string,
  display_name: string,
  role: string,
  languages: string[] | null,
  serviceAreas: string[],
  bio: string,
  avatar: string | null,
): ProviderUserRead {
  const profile: ProviderProfileRead = {
    id: `profile-${id}`,
    user_id: `user-${id}`,
    provider_type: role,
    is_verified: true,
    experience_years: role === "guide" ? 8 : 12,
    specializations: role === "guide" ? ["Cultural tours", "Nature", "History"] : ["Full itineraries", "Transport", "Hotels"],
    max_group_size: role === "guide" ? 10 : 40,
    certifications: role === "guide" ? ["Licensed guide"] : ["Tourism agency licence"],
    company_name: role === "agency" ? display_name : null,
    registration_number: role === "agency" ? `REG-${id}` : null,
    service_areas: serviceAreas,
    website: role === "agency" ? `https://example.com` : null,
    team_size: role === "agency" ? 15 : null,
    property_name: null,
    property_type: null,
    amenities: null,
    price_range_min: null,
    price_range_max: null,
    check_in_time: null,
    check_out_time: null,
    star_rating: null,
  };
  return {
    id,
    display_name,
    avatar_url: avatar,
    languages,
    bio,
    role,
    is_verified: true,
    profile,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Experiences & events
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EXPERIENCES: ExperienceRead[] = [
  exp("exp-casbah-walk", "Casbah of Algiers walking tour", "Cultural", 16, 2500, 3, "A 3-hour guided stroll through the UNESCO-listed Casbah — palaces, mosques and sea views.", "Atlas Nomade"),
  exp("exp-timgad-day", "Timgad — Rome in Africa", "Heritage", 19, 4500, 6, "Full-day excursion to the best-preserved Roman colony in North Africa, with guide and transport.", "Sahara Trails"),
  exp("exp-santa-cruz-sunset", "Santa Cruz at sunset", "Heritage", 31, 1800, 2, "Climb the fort as the sun drops over the Bay of Oran, with a local storyteller.", "Atlas Nomade"),
  exp("exp-hoggar-trek", "Hoggar 4x4 expedition", "Adventure", 11, 32000, 48, "Three nights under the stars: Assekrem sunrise, volcanic peaks and Tuareg camps.", "Sahara Trails"),
  exp("exp-gouraya-day", "Gouraya mountain day", "Nature", 6, 2200, 6, "Hike the Gouraya National Park and the Pic des Singes with a Kabyle guide.", "Sahara Trails"),
  exp("exp-mzab-overview", "M'zab valley overview", "Heritage", 47, 3900, 8, "A day across the pentapolis — Beni Isguen, the grand mosque and the palm grove.", "Atlas Nomade"),
];

function exp(
  id: string,
  title: string,
  category: string,
  wilaya_id: number,
  price_dzd: number,
  duration_hours: number,
  description: string,
  provider_name: string,
): ExperienceRead {
  const c = coords(wilaya_id);
  return {
    id,
    provider_id: provider_name.includes("Sahara") ? "agency-sahara-trails" : "agency-atlas-nomade",
    title,
    category,
    description,
    wilaya_id,
    meeting_point: `${wilayaName(wilaya_id)} city centre`,
    meeting_point_lat: c.latitude,
    meeting_point_lng: c.longitude,
    price_dzd,
    duration_hours,
    max_participants: 8,
    language: "French",
    included: ["Local guide", "Transport", "Water"],
    what_to_bring: ["Comfortable shoes", "Sun protection"],
    photos: [],
    status: "active",
    season: "All year",
    start_date: null,
    end_date: null,
    source: "mock",
    source_url: null,
    is_verified: true,
    completion_count: 120,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: null,
  };
}

export const MOCK_EVENTS: EventRead[] = [
  {
    id: "event-rai-ocean",
    title: "Raï — Océan Festival",
    wilaya_id: 31,
    category: "music",
    description: "Three nights of raï on the Front de Mer with local legends and rising stars.",
    month: 8,
    duration_days: 3,
    is_recurring: true,
    photo_url: "https://picsum.photos/seed/rai/800/500",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: null,
  },
  {
    id: "event-timgad-festival",
    title: "International Festival of Timgad",
    wilaya_id: 19,
    category: "culture",
    description: "Music and theatre staged in the ancient Roman theatre of Timgad.",
    month: 7,
    duration_days: 7,
    is_recurring: true,
    photo_url: "https://picsum.photos/seed/timgad-fest/800/500",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: null,
  },
  {
    id: "event-sahara-trek",
    title: "Sahara Trek Week",
    wilaya_id: 11,
    category: "sport",
    description: "A guided trekking week across the Hoggar massif with Tuareg guides.",
    month: 11,
    duration_days: 7,
    is_recurring: true,
    photo_url: "https://picsum.photos/seed/sahara-trek/800/500",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Artisans
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ARTISANS: ArtisanRead[] = SAMPLE_ARTISANS.map((a) => ({
  id: `artisan-${slugify(a.name)}`,
  name: a.name,
  craft_type: a.craft_type,
  description: a.description,
  wilaya_id: 6,
  photos: [],
  is_verified: true,
  created_at: "2025-01-01T00:00:00Z",
}));

// ─────────────────────────────────────────────────────────────────────────────
// Transport routes (deterministic per pair)
// ─────────────────────────────────────────────────────────────────────────────

export function mockRoute(origin: number, dest: number): RouteResponse {
  const dist = Math.round(haversine(origin, dest));

  // Same wilaya — a local hop: walk or a short cab ride, no scheduled line.
  if (origin === dest || dist <= 12) {
    return {
      origin_wilaya_id: origin,
      dest_wilaya_id: dest,
      driving_distance_km: dist,
      driving_time_minutes: Math.max(10, Math.round((dist / 30) * 60)),
      options: [
        {
          mode: "walking",
          line_name: "On foot",
          operator: null,
          cost_dzd: 0,
          duration_min: Math.max(5, Math.round((dist / 5) * 60)),
          transfers: 0,
          schedule: { type: "on_demand", notes: "A short stroll between the two stops" },
          pricing: null,
          contacts: [],
        },
        {
          mode: "taxi",
          line_name: "Local cab",
          operator: "Private hire",
          cost_dzd: Math.max(300, dist * 40),
          duration_min: Math.max(8, Math.round((dist / 35) * 60)),
          transfers: 0,
          schedule: { type: "on_demand", notes: "Hail on the street or book ahead" },
          pricing: { per_trip: Math.max(300, dist * 40) },
          contacts: [],
        },
      ],
    };
  }

  const driveMin = Math.round((dist / 80) * 60) + 20;
  const trainH = Math.round(dist / 100);
  const busH = trainH + 1;
  const flight = dist > 400;

  const options: TransportOption[] = [
    {
      mode: "train",
      line_name: "Inter-wilaya express",
      operator: "SNTF",
      cost_dzd: Math.round(dist * 1.2),
      duration_min: trainH * 60,
      transfers: 0,
      schedule: { type: "scheduled", departures: "2 daily", notes: "Check SNTF timetable" },
      pricing: { second_class: Math.round(dist * 1.2), first_class: Math.round(dist * 1.8) },
      contacts: [trainContact()],
    },
    {
      mode: "bus",
      line_name: "Inter-wilaya coach",
      operator: "ETUSA Intercity",
      cost_dzd: Math.round(dist * 0.9),
      duration_min: busH * 60,
      transfers: 0,
      schedule: { type: "scheduled", departures: "hourly", notes: "Departures from the central station" },
      pricing: { per_person: Math.round(dist * 0.9) },
      contacts: [busContact()],
    },
    {
      mode: "taxi",
      line_name: "Shared intercity taxi",
      operator: "Private hire",
      cost_dzd: Math.round(dist * 2.5),
      duration_min: Math.round(driveMin * 0.9),
      transfers: 0,
      schedule: { type: "on_demand", notes: "Depart when full — agree the fare first" },
      pricing: { per_seat: Math.round(dist * 2.5) },
      contacts: [],
    },
    {
      mode: "driving",
      line_name: null,
      operator: "Self drive",
      cost_dzd: Math.round(dist * 1.05),
      duration_min: driveMin,
      transfers: 0,
      schedule: { type: "road", notes: "Via the national road network" },
      pricing: { fuel: Math.round(dist * 1.05), tolls: Math.round(dist * 0.15) },
      contacts: [],
    },
  ];

  if (flight) {
    options.unshift({
      mode: "flight",
      line_name: "Domestic connection",
      operator: "Air Algérie",
      cost_dzd: Math.round(9000 + dist * 2),
      duration_min: 60 + Math.round(dist / 700) * 30,
      transfers: 0,
      schedule: { type: "scheduled", departures: "daily", notes: "Book in advance for the best fare" },
      pricing: { economy: Math.round(9000 + dist * 2) },
      contacts: [flightContact()],
    });
  }

  return {
    origin_wilaya_id: origin,
    dest_wilaya_id: dest,
    driving_distance_km: dist,
    driving_time_minutes: driveMin,
    options,
  };
}

function haversine(aId: number, bId: number): number {
  const a = coords(aId);
  const b = coords(bId);
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function trainContact(): TransportContact {
  return {
    name: "SNTF",
    mode: "train",
    phone: "+213 21 71 16 00",
    website: "https://www.sntf.dz",
  };
}

function busContact(): TransportContact {
  return {
    name: "ETUSA Intercity",
    mode: "bus",
    phone: "+213 21 66 00 00",
    website: "https://www.etusa.dz",
  };
}

function flightContact(): TransportContact {
  return {
    name: "Air Algérie",
    mode: "flight",
    phone: "+213 21 98 34 34",
    website: "https://www.airalgerie.dz",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// URL resolver
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve a GET request (path + query) to a mock JSON body, or undefined when
 * the path is unknown. The client only replays GETs; mutations still fail so
 * the caller can surface the real network error.
 */
export function resolveMockPath(path: string, params: URLSearchParams): unknown {
  // /api/v1/discover/wilayas
  if (path === "/api/v1/discover/wilayas") {
    return SAMPLE_WILAYAS as WilayaSummary[];
  }

  // /api/v1/discover/wilayas/{wilaya_id}
  const discoverMatch = path.match(/^\/api\/v1\/discover\/wilayas\/(\d+)$/);
  if (discoverMatch) {
    const id = Number(discoverMatch[1]);
    return mockDiscoverResponse(id);
  }

  // /api/v1/pois (query: wilaya_id, page, page_size)
  if (path === "/api/v1/pois") {
    const wilayaId = params.get("wilaya_id");
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("page_size") ?? 20);
    const items = wilayaId
      ? MOCK_POIS.filter((p) => p.wilaya_id === Number(wilayaId))
      : MOCK_POIS;
    return feed<PoiRead>(items, page, pageSize) as PoiFeed;
  }

  // /api/v1/pois/search (query: q, limit)
  if (path === "/api/v1/pois/search") {
    const q = (params.get("q") ?? "").toLowerCase().trim();
    const limit = Number(params.get("limit") ?? 24);
    const items = q
      ? MOCK_POIS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description ?? "").toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        )
      : MOCK_POIS;
    return feed<PoiRead>(items, 1, limit) as PoiFeed;
  }

  // /api/v1/pois/{poi_id}
  const poiMatch = path.match(/^\/api\/v1\/pois\/([^/]+)$/);
  if (poiMatch) {
    return MOCK_POIS.find((p) => p.id === poiMatch[1]) ?? MOCK_POIS[0];
  }

  // /api/v1/stays (query: wilaya_id, property_type, max_price, page, page_size)
  if (path === "/api/v1/stays") {
    const wilayaId = params.get("wilaya_id");
    const propertyType = params.get("property_type");
    const maxPrice = params.get("max_price");
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("page_size") ?? 12);
    let items = MOCK_STAYS;
    if (wilayaId) items = items.filter((s) => s.wilaya_id === Number(wilayaId));
    if (propertyType) items = items.filter((s) => s.property_type === propertyType);
    if (maxPrice) items = items.filter((s) => s.price_per_night_dzd <= Number(maxPrice));
    return feed<StayRead>(items, page, pageSize) as StayFeed;
  }

  // /api/v1/artisans
  if (path === "/api/v1/artisans") {
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("page_size") ?? 12);
    return feed<ArtisanRead>(MOCK_ARTISANS, page, pageSize) as ArtisanFeed;
  }

  // /api/v1/experiences
  if (path === "/api/v1/experiences") {
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("page_size") ?? 8);
    return feed<ExperienceRead>(MOCK_EXPERIENCES, page, pageSize) as ExperienceFeed;
  }

  // /api/v1/experiences/{experience_id}
  const expMatch = path.match(/^\/api\/v1\/experiences\/([^/]+)$/);
  if (expMatch) {
    const experience =
      MOCK_EXPERIENCES.find((e) => e.id === expMatch[1]) ?? MOCK_EXPERIENCES[0];
    const detail: ExperienceDetail = {
      experience,
      provider_name: experience.provider_id.includes("Sahara") ? "Sahara Trails" : "Atlas Nomade",
      provider_avatar: `https://i.pravatar.cc/150?img=3`,
      provider_role: "agency",
      is_favorited: false,
    };
    return detail;
  }

  // /api/v1/events
  if (path === "/api/v1/events") {
    const page = Number(params.get("page") ?? 1);
    const pageSize = Number(params.get("page_size") ?? 8);
    return feed<EventRead>(MOCK_EVENTS, page, pageSize) as EventFeed;
  }

  // /api/v1/users/providers (query: role, page_size)
  if (path === "/api/v1/users/providers") {
    const role = params.get("role");
    return role ? MOCK_PROVIDERS.filter((p) => p.role === role) : MOCK_PROVIDERS;
  }

  // /api/v1/transport/routes/{origin_wilaya_id}/{dest_wilaya_id}
  const routeMatch = path.match(
    /^\/api\/v1\/transport\/routes\/(\d+)\/(\d+)$/,
  );
  if (routeMatch) {
    return mockRoute(Number(routeMatch[1]), Number(routeMatch[2]));
  }

  return undefined;
}

function mockDiscoverResponse(wilayaId: number): WilayaDetail {
  const pois = MOCK_POIS.filter((p) => p.wilaya_id === wilayaId);
  const experiences = MOCK_EXPERIENCES.filter((e) => e.wilaya_id === wilayaId);
  const stays = MOCK_STAYS.filter((s) => s.wilaya_id === wilayaId);
  const artisans = MOCK_ARTISANS.filter((a) => a.wilaya_id === wilayaId);

  return {
    wilaya_id: wilayaId,
    wilaya_name: wilayaName(wilayaId),
    pois: pois.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description ?? null,
      latitude: p.latitude ?? null,
      longitude: p.longitude ?? null,
      photo_url: p.photo_url ?? null,
      entry_fee_dzd: null,
    })),
    experiences: experiences.map((e) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      description: e.description,
      price_dzd: e.price_dzd,
      duration_hours: e.duration_hours,
      provider_name: e.provider_id.includes("Sahara") ? "Sahara Trails" : "Atlas Nomade",
      provider_avatar: `https://i.pravatar.cc/150?img=3`,
      meeting_point: e.meeting_point,
      photos: e.photos,
    })),
    stays: stays.map((s) => ({
      id: s.id,
      name: s.name,
      property_type: s.property_type,
      description: s.description,
      price_per_night_dzd: s.price_per_night_dzd,
      amenities: s.amenities,
      photos: s.photos,
      latitude: s.latitude,
      longitude: s.longitude,
      max_guests: s.max_guests,
      provider_name: s.name,
      provider_avatar: null,
    })),
    artisans: artisans.map((a) => ({
      id: a.id,
      name: a.name,
      craft_type: a.craft_type,
      description: a.description ?? null,
      latitude: a.latitude ?? null,
      longitude: a.longitude ?? null,
      address: null,
      commune: null,
      photos: a.photos ?? null,
      years_experience: null,
      specializations: null,
      accepts_visitors: null,
      is_verified: null,
      user_name: null,
    })),
  };
}
