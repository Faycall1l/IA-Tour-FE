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
    message: "We'd like to list our desert tours on GOAA.",
    createdAt: "2026-08-03T15:40:00Z",
  },
  {
    id: "contact-3",
    email: "salma@example.com",
    message: "The itinerary builder kept the ferry in Annaba — how do I drop a day?",
    createdAt: "2026-08-05T09:12:00Z",
  },
];

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
