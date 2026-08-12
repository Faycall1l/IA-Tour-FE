export interface ArtisanProduct {
  label: string;
  emoji: string;
  src?: string;
}

export interface ArtisanCard {
  id: string;
  name: string;
  craft_type: string;
  description: string;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  products: ArtisanProduct[];
  nearest_station?: { name: string; walking_time_min: number };
}

export interface BlogPost {
  id: string;
  author: string;
  authorRole: string;
  title: string;
  text: string;
  emoji: string;
  isVideo: boolean;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
}

export const SAMPLE_ARTISANS: ArtisanCard[] = [
  {
    id: "sample-kerzaz",
    name: "Atelier Kerzaz",
    craft_type: "Pottery",
    description:
      "Hand-thrown Kabyle pottery from the Soummam valley — glazed bowls, jars and tagines fired the traditional way.",
    latitude: 36.75,
    longitude: 5.08,
    products: [
      { label: "Glazed tagine", emoji: "🏺" },
      { label: "Soummam bowl", emoji: "🥣" },
      { label: "Koucha jar", emoji: "🫙" },
      { label: "Amphora", emoji: "⚱️" },
    ],
  },
  {
    id: "sample-dar-el-henna",
    name: "Dar El Henna",
    craft_type: "Leather crafts",
    description:
      "Hand-stitched leather slippers and bags from the old medina of Constantine, finished with braided henna-dyed seams.",
    latitude: 36.36,
    longitude: 6.61,
    products: [
      { label: "Balgha slippers", emoji: "🥿" },
      { label: "Saddle bag", emoji: "👜" },
      { label: "Tooled belt", emoji: "🪢" },
      { label: "Coin purse", emoji: "👛" },
    ],
  },
  {
    id: "sample-nous-nous",
    name: "Nous Nous Carpets",
    craft_type: "Carpets & textiles",
    description:
      "M'zab hand-knotted carpets and woven wool textiles, each one telling the pattern language of the five ksour.",
    latitude: 32.49,
    longitude: 3.67,
    products: [
      { label: "M'zab rug", emoji: "🧶" },
      { label: "Wool shawl", emoji: "🧣" },
      { label: "Cushion set", emoji: "🛋️" },
      { label: "Wall hanging", emoji: "🪢" },
    ],
  },
  {
    id: "sample-tassili-silver",
    name: "Tassili Silverworks",
    craft_type: "Silver jewellery",
    description:
      "Tuareg-inspired silver jewellery — the tanaghilt cross of the Ahaggar, hammered and engraved in Tamanrasset.",
    latitude: 22.79,
    longitude: 5.52,
    products: [
      { label: "Tanaghilt cross", emoji: "📿" },
      { label: "Silver bracelet", emoji: "💍" },
      { label: "Berber fibula", emoji: "🔱" },
      { label: "Earrings", emoji: "✨" },
    ],
  },
  {
    id: "sample-el-qilada",
    name: "El Qilada",
    craft_type: "Coral & jewellery",
    description:
      "Coral jewellery and filigree from the Annaba coast, following the techniques of the old coral-workers' guild.",
    latitude: 36.9,
    longitude: 7.77,
    products: [
      { label: "Coral necklace", emoji: "📿" },
      { label: "Filigree ring", emoji: "💍" },
      { label: "Pendant", emoji: "🔮" },
      { label: "Brooch", emoji: "🪙" },
    ],
  },
  {
    id: "sample-fahs",
    name: "Fahs El M'chaa",
    craft_type: "Woodcraft",
    description:
      "Carved cedarwood chests and mashrabiya screens from Tlemcen, inlaid with mother-of-pearl and brass.",
    latitude: 34.88,
    longitude: -1.31,
    products: [
      { label: "Cedar chest", emoji: "🧰" },
      { label: "Mashrabiya screen", emoji: "🪟" },
      { label: "Inlaid mirror", emoji: "🪞" },
      { label: "Spice box", emoji: "📦" },
    ],
  },
];

export const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "post-djanet",
    author: "Djanet Trek Agency",
    authorRole: "Agency",
    title: "Sunrise over the Tadrart dunes",
    text: "Three nights under the Tassili stars — we watched the sun rise over the red dunes of the Tadrart. Next departure is fully open.",
    emoji: "🏜️",
    isVideo: false,
  },
  {
    id: "post-casbah",
    author: "Casbah Walks",
    authorRole: "Guide",
    title: "A slow morning in the Casbah",
    text: "A slow morning through the Casbah of Algiers: 17th-century palaces, the smell of msemen, and cats on every rooftop.",
    emoji: "🕌",
    isVideo: true,
  },
  {
    id: "post-ghardaia",
    author: "M'zab Oasis Guides",
    authorRole: "Guide",
    title: "The five ksour from above",
    text: "The five ksour of Ghardaïa photographed from above — you can finally see why they call it the pearl of the M'zab.",
    emoji: "🌴",
    isVideo: false,
  },
  {
    id: "post-timgad",
    author: "Aurès Heritage Trips",
    authorRole: "Agency",
    title: "Golden hour in Timgad",
    text: "Our group walked the decumanus of Timgad at golden hour. The Roman theatre echoes every footstep. Bookings for next spring are open.",
    emoji: "🏛️",
    isVideo: false,
  },
  {
    id: "post-constantine",
    author: "Constantine Food Tours",
    authorRole: "Agency",
    title: "A full afternoon of taste",
    text: "Couscous in the medina, baklawa by the Rhumel gorge — a full afternoon of taste. New video up on our page!",
    emoji: "🍲",
    isVideo: true,
  },
  {
    id: "post-gouraya",
    author: "Béjaïa Adventures",
    authorRole: "Guide",
    title: "Kayaking the Gouraya coast",
    text: "Kayak trip along the Gouraya coast filmed this morning — caves, turquoise water, and one very brave gull.",
    emoji: "🌊",
    isVideo: true,
  },
];

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: "review-yacine",
    username: "Yacine B.",
    rating: 5,
    comment:
      "The itinerary picked places I never would have found on my own — perfectly sequenced days, zero wasted driving.",
  },
  {
    id: "review-lina",
    username: "Lina M.",
    rating: 5,
    comment:
      "Booked a stay in Ghardaïa through ATHAR and it was flawless. Photos matched reality, check-in was smooth.",
  },
  {
    id: "review-mehdi",
    username: "Mehdi T.",
    rating: 4,
    comment:
      "Great day trip to the Roman ruins of Timgad. Would have liked more restaurant suggestions in the itinerary.",
  },
  {
    id: "review-amel",
    username: "Amel K.",
    rating: 5,
    comment:
      "Our guide in Constantine was fantastic — patient, funny, and knew every story behind every bridge.",
  },
  {
    id: "review-karim",
    username: "Karim S.",
    rating: 4,
    comment:
      "Love browsing the artisans on the site. Bought a beautiful hand-knotted rug straight from the workshop.",
  },
  {
    id: "review-sarah",
    username: "Sarah D.",
    rating: 5,
    comment:
      "The plan-a-trip feature saved us hours of research. We just typed the destination and it did the rest.",
  },
  {
    id: "review-omar",
    username: "Omar R.",
    rating: 3,
    comment:
      "Solid app, but a couple of POIs had outdated opening hours. Hope they keep the data fresh.",
  },
  {
    id: "review-ines",
    username: "Ines F.",
    rating: 5,
    comment:
      "The agency blogs are a goldmine — real local insight you don't get from any guidebook.",
  },
];

export interface HeroSlide {
  title: string;
  subtitle: string;
  image?: string;
  gradient: string;
}

export const FALLBACK_HERO_SLIDES: HeroSlide[] = [
  {
    title: "The Tassili n'Ajjer",
    subtitle: "Prehistoric rock art in a sea of sandstone",
    gradient: "from-[#12402e] via-[#2e8b6a] to-[#93e9be]",
  },
  {
    title: "The Casbah of Algiers",
    subtitle: "A living labyrinth above the bay",
    gradient: "from-[#6b5b3f] via-[#c9a86a] to-[#f7e7ce]",
  },
  {
    title: "Timgad",
    subtitle: "The Pompeii of North Africa",
    gradient: "from-[#8a6d2e] via-[#b08d2e] to-[#e6cf8b]",
  },
  {
    title: "The M'zab Valley",
    subtitle: "Five white ksour in the desert",
    gradient: "from-[#3d3524] via-[#a8872e] to-[#f7e7ce]",
  },
  {
    title: "Gouraya Coast",
    subtitle: "Mountains meeting the Mediterranean",
    gradient: "from-[#1e5c46] via-[#93e9be] to-[#f5f2e8]",
  },
];

import type { WilayaSummary } from "@/lib/types";

export interface ContactSubmission {
  id: string;
  email: string;
  message: string;
  createdAt: string;
}

export const SAMPLE_WILAYAS: WilayaSummary[] = [
  {
    id: 16,
    name: "Algiers",
    description: "White city on the bay, from the Casbah to the Corniche.",
    total_pois: 42,
    total_featured: 8,
    total_experiences: 15,
    total_stays: 24,
    total_artisans: 9,
    top_categories: ["heritage", "culture", "seafood"],
    highlight_poi: "The Casbah of Algiers",
    highlight_category: "heritage",
    latitude: 36.75,
    longitude: 3.06,
  },
  {
    id: 31,
    name: "Oran",
    description: "Bey's city on the west coast, home of rai.",
    total_pois: 33,
    total_featured: 6,
    total_experiences: 12,
    total_stays: 19,
    total_artisans: 6,
    top_categories: ["culture", "coast"],
    highlight_poi: "Fort Santa Cruz",
    highlight_category: "heritage",
    latitude: 35.7,
    longitude: -0.63,
  },
  {
    id: 25,
    name: "Constantine",
    description: "City of bridges suspended over a gorge.",
    total_pois: 38,
    total_featured: 9,
    total_experiences: 11,
    total_stays: 16,
    total_artisans: 12,
    top_categories: ["heritage", "crafts"],
    highlight_poi: "Sidi M'Cid Bridge",
    highlight_category: "heritage",
    latitude: 36.36,
    longitude: 6.61,
  },
  {
    id: 13,
    name: "Tlemcen",
    description: "Jewel of the Maghreb, famous for its great mosque.",
    total_pois: 36,
    total_featured: 7,
    total_experiences: 9,
    total_stays: 14,
    total_artisans: 8,
    top_categories: ["heritage", "culture"],
    highlight_poi: "El Mechouar Palace",
    highlight_category: "heritage",
    latitude: 34.88,
    longitude: -1.31,
  },
  {
    id: 6,
    name: "Béjaïa",
    description: "Mountains and Mediterranean coves on the Soummam valley.",
    total_pois: 29,
    total_featured: 5,
    total_experiences: 14,
    total_stays: 21,
    total_artisans: 10,
    top_categories: ["nature", "beach", "crafts"],
    highlight_poi: "Gouraya National Park",
    highlight_category: "nature",
    latitude: 36.75,
    longitude: 5.08,
  },
  {
    id: 47,
    name: "Ghardaïa",
    description: "Pentapolis of the M'zab valley, a UNESCO oasis.",
    total_pois: 25,
    total_featured: 6,
    total_experiences: 8,
    total_stays: 13,
    total_artisans: 7,
    top_categories: ["heritage", "desert"],
    highlight_poi: "The M'zab Valley",
    highlight_category: "heritage",
    latitude: 32.49,
    longitude: 3.67,
  },
  {
    id: 11,
    name: "Tamanrasset",
    description: "Gateway to the Hoggar mountains and the deep Sahara.",
    total_pois: 21,
    total_featured: 7,
    total_experiences: 10,
    total_stays: 11,
    total_artisans: 5,
    top_categories: ["desert", "trekking"],
    highlight_poi: "Assekrem",
    highlight_category: "desert",
    latitude: 22.79,
    longitude: 5.52,
  },
  {
    id: 56,
    name: "Djanet",
    description: "Tassili n'Ajjer rock art and the Tadrart sand dunes.",
    total_pois: 19,
    total_featured: 6,
    total_experiences: 9,
    total_stays: 8,
    total_artisans: 4,
    top_categories: ["desert", "trekking", "heritage"],
    highlight_poi: "Tassili n'Ajjer",
    highlight_category: "heritage",
    latitude: 24.55,
    longitude: 9.48,
  },
  {
    id: 19,
    name: "Sétif",
    description: "Roman Timgad and green high-plateau villages.",
    total_pois: 27,
    total_featured: 5,
    total_experiences: 9,
    total_stays: 15,
    total_artisans: 6,
    top_categories: ["heritage", "nature"],
    highlight_poi: "Timgad",
    highlight_category: "heritage",
    latitude: 36.19,
    longitude: 5.41,
  },
  {
    id: 23,
    name: "Annaba",
    description: "Coastal city with the basilica of St Augustine.",
    total_pois: 24,
    total_featured: 4,
    total_experiences: 10,
    total_stays: 17,
    total_artisans: 5,
    top_categories: ["coast", "heritage"],
    highlight_poi: "Basilica of Saint Augustine",
    highlight_category: "heritage",
    latitude: 36.9,
    longitude: 7.77,
  },
  {
    id: 49,
    name: "Timimoun",
    description: "The red oasis of the Gourara, clay ksour and palm groves.",
    total_pois: 18,
    total_featured: 5,
    total_experiences: 7,
    total_stays: 9,
    total_artisans: 5,
    top_categories: ["desert", "culture"],
    highlight_poi: "The Red Ksour of Timimoun",
    highlight_category: "desert",
    latitude: 29.26,
    longitude: 0.23,
  },
  {
    id: 1,
    name: "Adrar",
    description: "Saharan ksour and the dunes of Erg Admer.",
    total_pois: 17,
    total_featured: 4,
    total_experiences: 6,
    total_stays: 8,
    total_artisans: 6,
    top_categories: ["desert", "heritage"],
    highlight_poi: "Ksar of Ouled Said",
    highlight_category: "desert",
    latitude: 27.87,
    longitude: -0.29,
  },
];

export interface SampleSite {
  name: string;
  category: string;
  description: string;
  photo: string;
}

export const SAMPLE_WILAYA_SITES: Record<number, SampleSite[]> = {
  16: [
    { name: "The Casbah of Algiers", category: "heritage", description: "A UNESCO medina of whitewashed lanes, Ottoman palaces and sea views from the top of the old city.", photo: "https://picsum.photos/seed/casbah/800/500" },
    { name: "Notre-Dame d'Afrique", category: "heritage", description: "The basilica perched above the bay, blending Moorish and Byzantine styles.", photo: "https://picsum.photos/seed/nd-afrique/800/500" },
    { name: "Jardin d'Essai", category: "nature", description: "A century-old botanical garden with giant araucarias and a monkey enclosure.", photo: "https://picsum.photos/seed/jardin-essai/800/500" },
  ],
  31: [
    { name: "Fort Santa Cruz", category: "heritage", description: "Spanish fort on Mount Murdjadjo with sweeping views of Oran and the bay.", photo: "https://picsum.photos/seed/santa-cruz/800/500" },
    { name: "Pasha's Mosque", category: "heritage", description: "Ottoman-era mosque with a restored minaret at the heart of Sidi El Houari.", photo: "https://picsum.photos/seed/pasha-mosque/800/500" },
    { name: "Front de Mer", category: "culture", description: "The seafront esplanade where rai fills the air and the corniche wakes up at dusk.", photo: "https://picsum.photos/seed/front-de-mer/800/500" },
  ],
  25: [
    { name: "Sidi M'Cid Bridge", category: "heritage", description: "The 175-metre suspension bridge spanning the Rhumel gorge.", photo: "https://picsum.photos/seed/sidi-mcid/800/500" },
    { name: "Palace of Ahmed Bey", category: "heritage", description: "A 19th-century Ottoman palace with courtyards and tilework from around the country.", photo: "https://picsum.photos/seed/ahmed-bey/800/500" },
    { name: "Cirta Museum", category: "culture", description: "Roman mosaics and Punic artifacts from the ancient capital of Numidia.", photo: "https://picsum.photos/seed/cirta/800/500" },
  ],
  13: [
    { name: "El Mechouar Palace", category: "heritage", description: "The Zayyanid royal palace, now a museum inside the old citadel of Tlemcen.", photo: "https://picsum.photos/seed/el-mechouar/800/500" },
    { name: "Grand Mosque of Tlemcen", category: "heritage", description: "A 12th-century Almoravid mosque with a horseshoe-arch prayer hall.", photo: "https://picsum.photos/seed/tlemcen-mosque/800/500" },
    { name: "Mansourah Ruins", category: "heritage", description: "The unfinished 14th-century minaret and ramparts of the Merinid settlement.", photo: "https://picsum.photos/seed/mansourah/800/500" },
  ],
  6: [
    { name: "Gouraya National Park", category: "nature", description: "Lush slopes, cliffs and the Gouraya peak overlooking the Mediterranean.", photo: "https://picsum.photos/seed/gouraya/800/500" },
    { name: "Pic des Singes", category: "nature", description: "A lookout where you may spot Barbary macaques above the bay of Béjaïa.", photo: "https://picsum.photos/seed/pic-singes/800/500" },
    { name: "Cap Carbon", category: "nature", description: "The dramatic peninsula and lighthouse at the mouth of the bay.", photo: "https://picsum.photos/seed/cap-carbon/800/500" },
  ],
  47: [
    { name: "The M'zab Valley", category: "heritage", description: "Five fortified pentapole cities, a UNESCO oasis of white mosques and ksour.", photo: "https://picsum.photos/seed/mzab/800/500" },
    { name: "Beni Isguen", category: "culture", description: "The best-preserved of the M'zab cities, with a weekly souk and strict traditions.", photo: "https://picsum.photos/seed/beni-isguen/800/500" },
    { name: "Grand Mosque of Ghardaïa", category: "heritage", description: "The pyramidal 11th-century mosque crowned by its pointed minaret.", photo: "https://picsum.photos/seed/ghardaia-mosque/800/500" },
  ],
  11: [
    { name: "Assekrem", category: "trekking", description: "The hermitage plateau at 2,700m with sunrise over the Hoggar's moonlike peaks.", photo: "https://picsum.photos/seed/assekrem/800/500" },
    { name: "Hoggar Mountains", category: "trekking", description: "Volcanic massifs, gorges and the highest point of Algeria.", photo: "https://picsum.photos/seed/hoggar/800/500" },
    { name: "Guelta of Silet", category: "nature", description: "A desert waterhole where rare life gathers between the dunes.", photo: "https://picsum.photos/seed/guelta-silet/800/500" },
  ],
  56: [
    { name: "Tassili n'Ajjer", category: "heritage", description: "Neolithic rock art and stone forests on a vast UNESCO plateau.", photo: "https://picsum.photos/seed/tassili/800/500" },
    { name: "Tadrart Dunes", category: "trekking", description: "Giant orange sand dunes and canyons that change colour at sunset.", photo: "https://picsum.photos/seed/tadrart/800/500" },
    { name: "La Vache Qui Pleure", category: "trekking", description: "The landmark overhanging rock near the centre of the park.", photo: "https://picsum.photos/seed/vache-qui-pleure/800/500" },
  ],
  19: [
    { name: "Timgad", category: "heritage", description: "The 'Pompeii of Africa', a grid-planned Roman colony in the Aurès foothills.", photo: "https://picsum.photos/seed/timgad/800/500" },
    { name: "Djémila", category: "heritage", description: "Mountain-top Roman ruins — temples, forum and mosaics — on the slopes of Sétif.", photo: "https://picsum.photos/seed/djemila/800/500" },
    { name: "Bougaa Rock", category: "nature", description: "The sandstone needle rising from the high-plateau villages.", photo: "https://picsum.photos/seed/bougaa/800/500" },
  ],
  23: [
    { name: "Basilica of Saint Augustine", category: "heritage", description: "The imposing basilica overlooking the ruins of Hippone.", photo: "https://picsum.photos/seed/st-augustine/800/500" },
    { name: "Hippone Ruins", category: "heritage", description: "Roman and early-Christian remains where Saint Augustine once preached.", photo: "https://picsum.photos/seed/hippone/800/500" },
    { name: "Cap de Garde", category: "nature", description: "The headland and lighthouse between Annaba and the coast of Seraïdi.", photo: "https://picsum.photos/seed/cap-garde/800/500" },
  ],
  49: [
    { name: "The Red Ksour of Timimoun", category: "heritage", description: "Coral-red clay towns rising from the Gourara oasis.", photo: "https://picsum.photos/seed/timimoun-ksour/800/500" },
    { name: "Palm Grove of Timimoun", category: "nature", description: "A vast foggara-irrigated palm forest by the salt flats.", photo: "https://picsum.photos/seed/timimoun-palms/800/500" },
    { name: "Tamentit", category: "culture", description: "Ancient caravan ksar once on the Trans-Saharan route.", photo: "https://picsum.photos/seed/tamentit/800/500" },
  ],
  1: [
    { name: "Ksar of Ouled Said", category: "heritage", description: "A dense maze of clay houses and granaries in the Gourara.", photo: "https://picsum.photos/seed/ouled-said/800/500" },
    { name: "Grand Mosque of Adrar", category: "heritage", description: "A distinctive Saharan mosque at the heart of the ksar.", photo: "https://picsum.photos/seed/adrar-mosque/800/500" },
    { name: "Erg Admer", category: "trekking", description: "High golden dunes on the road south of Adrar.", photo: "https://picsum.photos/seed/erg-admer/800/500" },
  ],
};

export interface SampleAgencyItinerary {
  title: string;
  days: number;
  budget: string;
  wilayas: string[];
  highlights: string[];
}

export interface SampleAgency {
  id: number;
  name: string;
  city: string;
  rating: number;
  description: string;
  itineraries: SampleAgencyItinerary[];
}

export const SAMPLE_AGENCIES: SampleAgency[] = [
  {
    id: 1,
    name: "Sahara Trails",
    city: "Tamanrasset",
    rating: 4.9,
    description: "Deep-desert specialists running guided Hoggar and Tassili expeditions.",
    itineraries: [
      { title: "Hoggar Sunrise Trek", days: 5, budget: "mid-range", wilayas: ["Tamanrasset"], highlights: ["Assekrem sunrise", "Mouydir gorges", "Tuareg camp nights"] },
      { title: "Tassili Rock Art Loop", days: 7, budget: "mid-range", wilayas: ["Djanet"], highlights: ["La Vache Qui Pleure", "Tadrart dunes", "Neolithic galleries"] },
    ],
  },
  {
    id: 2,
    name: "Atlas Nomade",
    city: "Algiers",
    rating: 4.7,
    description: "Coast-to-Sahara packages linking the white city to the deep south.",
    itineraries: [
      { title: "Casbah & Corniche", days: 2, budget: "budget", wilayas: ["Algiers"], highlights: ["Casbah walking tour", "Notre-Dame d'Afrique", "Jardin d'Essai"] },
      { title: "North–South Classic", days: 10, budget: "mid-range", wilayas: ["Algiers", "Ghardaïa", "Tamanrasset"], highlights: ["M'zab pentapolis", "Assekrem", "Hoggar trek"] },
    ],
  },
  {
    id: 3,
    name: "Kabylia Aventures",
    city: "Béjaïa",
    rating: 4.8,
    description: "Mountain and Mediterranean escapes from the Soummam valley.",
    itineraries: [
      { title: "Gouraya & the Soummam", days: 3, budget: "budget", wilayas: ["Béjaïa"], highlights: ["Gouraya Park", "Pic des Singes", "Coves of Aokas"] },
      { title: "Bridges & Ruins of the East", days: 6, budget: "mid-range", wilayas: ["Constantine", "Sétif"], highlights: ["Sidi M'Cid Bridge", "Djémila", "Timgad"] },
    ],
  },
  {
    id: 4,
    name: "M'zab & Oasis Tours",
    city: "Ghardaïa",
    rating: 4.6,
    description: "Local guides through the pentapolis and the palm groves of the desert.",
    itineraries: [
      { title: "The Pentapolis in a Day", days: 1, budget: "budget", wilayas: ["Ghardaïa"], highlights: ["Beni Isguen", "Grand Mosque", "M'zab skyline"] },
      { title: "Gourara Red Road", days: 8, budget: "mid-range", wilayas: ["Adrar", "Timimoun"], highlights: ["Red ksour", "Timimoun palm grove", "Erg Admer"] },
    ],
  },
];

export const SAMPLE_CONTACTS: ContactSubmission[] = [
  {
    id: "contact-1",
    email: "traveler@example.com",
    message: "Loved the M'zab guide — do you have a Tassili itinerary?",
    createdAt: "2026-08-01T10:24:00Z",
  },
  {
    id: "contact-2",
    email: "agency@example.dz",
    message: "We'd like to list our desert tours on ATHAR.",
    createdAt: "2026-08-03T15:40:00Z",
  },
  {
    id: "contact-3",
    email: "salma@example.com",
    message: "The itinerary builder kept the ferry in Annaba — how do I drop a day?",
    createdAt: "2026-08-05T09:12:00Z",
  },
];

export const WILAYA_NAMES: Record<number, string> = {
  1: "Adrar",
  2: "Chlef",
  3: "Laghouat",
  4: "Oum El Bouaghi",
  5: "Batna",
  6: "Béjaïa",
  7: "Biskra",
  8: "Béchar",
  9: "Blida",
  10: "Bouira",
  11: "Tamanrasset",
  12: "Tébessa",
  13: "Tlemcen",
  14: "Tiaret",
  15: "Tizi Ouzou",
  16: "Algiers",
  17: "Djelfa",
  18: "Jijel",
  19: "Sétif",
  20: "Saïda",
  21: "Skikda",
  22: "Sidi Bel Abbès",
  23: "Annaba",
  24: "Guelma",
  25: "Constantine",
  26: "Médéa",
  27: "Mostaganem",
  28: "M'Sila",
  29: "Mascara",
  30: "Ouargla",
  31: "Oran",
  32: "El Bayadh",
  33: "Illizi",
  34: "Bordj Bou Arréridj",
  35: "Boumerdès",
  36: "El Tarf",
  37: "Tindouf",
  38: "Tissemsilt",
  39: "El Oued",
  40: "Khenchela",
  41: "Souk Ahras",
  42: "Tipaza",
  43: "Mila",
  44: "Aïn Defla",
  45: "Naâma",
  46: "Aïn Témouchent",
  47: "Ghardaïa",
  48: "Relizane",
  49: "Timimoun",
  50: "Bordj Badji Mokhtar",
  51: "Ouled Djellal",
  52: "Béni Abbès",
  53: "In Salah",
  54: "In Guezzam",
  55: "Touggourt",
  56: "Djanet",
  57: "El M'Ghair",
  58: "El Meniaa",
  59: "Aflou",
  60: "Barika",
  61: "El Kantara",
  62: "Bir El Ater",
  63: "El Aricha",
  64: "Ksar Chellala",
  65: "Aïn Ouessara",
  66: "Messaad",
  67: "Ksar El Boukhari",
  68: "Bou Saâda",
  69: "El Abiodh Sidi Cheikh",
};

const WILAYA_NAME_ALIASES: Record<string, number> = {
  alger: 16,
  tamanghasset: 11,
};

function normalizeWilayaName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s']+/g, " ")
    .trim();
}

export function wilayaIdForName(name: string): number | undefined {
  const key = normalizeWilayaName(name);
  if (WILAYA_NAME_ALIASES[key]) return WILAYA_NAME_ALIASES[key];
  for (const [id, canonical] of Object.entries(WILAYA_NAMES)) {
    if (normalizeWilayaName(canonical) === key) return Number(id);
  }
  return undefined;
}

export const WILAYA_COORDS: Record<number, { latitude: number; longitude: number }> = {
  1: { latitude: 27.87, longitude: -0.29 },
  2: { latitude: 36.17, longitude: 1.33 },
  3: { latitude: 33.8, longitude: 2.87 },
  4: { latitude: 35.88, longitude: 7.11 },
  5: { latitude: 35.56, longitude: 6.17 },
  6: { latitude: 36.75, longitude: 5.08 },
  7: { latitude: 34.85, longitude: 5.73 },
  8: { latitude: 31.62, longitude: -2.22 },
  9: { latitude: 36.47, longitude: 2.83 },
  10: { latitude: 36.38, longitude: 3.9 },
  11: { latitude: 22.79, longitude: 5.52 },
  12: { latitude: 35.4, longitude: 8.12 },
  13: { latitude: 34.88, longitude: -1.31 },
  14: { latitude: 35.37, longitude: 1.32 },
  15: { latitude: 36.71, longitude: 4.05 },
  16: { latitude: 36.75, longitude: 3.06 },
  17: { latitude: 34.67, longitude: 3.25 },
  18: { latitude: 36.82, longitude: 5.77 },
  19: { latitude: 36.19, longitude: 5.41 },
  20: { latitude: 34.83, longitude: 0.15 },
  21: { latitude: 36.87, longitude: 6.91 },
  22: { latitude: 35.19, longitude: -0.63 },
  23: { latitude: 36.9, longitude: 7.77 },
  24: { latitude: 36.46, longitude: 7.43 },
  25: { latitude: 36.36, longitude: 6.61 },
  26: { latitude: 36.26, longitude: 2.75 },
  27: { latitude: 35.93, longitude: 0.09 },
  28: { latitude: 35.7, longitude: 4.54 },
  29: { latitude: 35.4, longitude: 0.14 },
  30: { latitude: 31.95, longitude: 5.32 },
  31: { latitude: 35.7, longitude: -0.63 },
  32: { latitude: 33.68, longitude: 1.02 },
  33: { latitude: 26.48, longitude: 8.47 },
  34: { latitude: 36.07, longitude: 4.76 },
  35: { latitude: 36.76, longitude: 3.47 },
  36: { latitude: 36.77, longitude: 8.31 },
  37: { latitude: 27.67, longitude: -8.15 },
  38: { latitude: 35.61, longitude: 1.81 },
  39: { latitude: 33.37, longitude: 6.86 },
  40: { latitude: 35.44, longitude: 7.14 },
  41: { latitude: 36.29, longitude: 7.95 },
  42: { latitude: 36.59, longitude: 2.45 },
  43: { latitude: 36.45, longitude: 6.26 },
  44: { latitude: 36.26, longitude: 1.97 },
  45: { latitude: 33.27, longitude: -0.31 },
  46: { latitude: 35.3, longitude: -1.14 },
  47: { latitude: 32.49, longitude: 3.67 },
  48: { latitude: 35.74, longitude: 0.56 },
  49: { latitude: 29.26, longitude: 0.23 },
  50: { latitude: 21.33, longitude: 0.95 },
  51: { latitude: 34.43, longitude: 5.06 },
  52: { latitude: 30.13, longitude: -2.17 },
  53: { latitude: 27.19, longitude: 2.46 },
  54: { latitude: 19.57, longitude: 5.77 },
  55: { latitude: 33.1, longitude: 6.06 },
  56: { latitude: 24.55, longitude: 9.48 },
  57: { latitude: 33.95, longitude: 5.92 },
  58: { latitude: 30.58, longitude: 2.88 },
};
