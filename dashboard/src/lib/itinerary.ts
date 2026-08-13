/**
 * Shared types + persistence for the plan → stay → itinerary flow.
 *
 * Selections live in localStorage so the user can walk between /plan,
 * /stays and /itinerary without losing their choices.
 */

export type PickedSite = {
  id: string;
  name: string;
  category: string;
  wilaya_id: number;
  wilaya_name: string;
  photo_url?: string | null;
};

export type PickedStay = {
  id: string;
  name: string;
  property_type: string;
  wilaya_id: number;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  price_per_night_dzd: number;
  photos?: string[] | null;
};

export const SITES_STORAGE_KEY = "athar:selected-sites";
export const STAY_STORAGE_KEY = "athar:selected-stay";
export const DATES_STORAGE_KEY = "athar:itinerary-dates";
export const ALTERNATE_STAYS_STORAGE_KEY = "athar:alternate-stays";

/**
 * Visit dates per node, keyed by site id. Each node on the path can carry its
 * own "arrive on" date + time, edited from the itinerary page.
 */
export type ItineraryDates = Record<string, string>;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadSavedSites(): PickedSite[] {
  if (typeof window === "undefined") return [];
  return safeParse<PickedSite[]>(window.localStorage.getItem(SITES_STORAGE_KEY)) ?? [];
}

export function saveSites(sites: PickedSite[]) {
  try {
    window.localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
  } catch {
    // storage unavailable — selection still works in-memory
  }
}

export function clearSites() {
  try {
    window.localStorage.removeItem(SITES_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function loadChosenStay(): PickedStay | null {
  if (typeof window === "undefined") return null;
  return safeParse<PickedStay>(window.localStorage.getItem(STAY_STORAGE_KEY));
}

export function saveChosenStay(stay: PickedStay | null) {
  try {
    if (stay === null) {
      window.localStorage.removeItem(STAY_STORAGE_KEY);
    } else {
      window.localStorage.setItem(STAY_STORAGE_KEY, JSON.stringify(stay));
    }
  } catch {
    // storage unavailable — selection still works in-memory
  }
}

export function clearChosenStay() {
  try {
    window.localStorage.removeItem(STAY_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

export function loadItineraryDates(): ItineraryDates {
  if (typeof window === "undefined") return {};
  return safeParse<ItineraryDates>(window.localStorage.getItem(DATES_STORAGE_KEY)) ?? {};
}

export function saveItineraryDates(dates: ItineraryDates) {
  try {
    window.localStorage.setItem(DATES_STORAGE_KEY, JSON.stringify(dates));
  } catch {
    // storage unavailable — dates still work in-memory
  }
}

export function setDestinationDate(
  dates: ItineraryDates,
  key: string,
  iso: string | null,
): ItineraryDates {
  const next = { ...dates };
  if (iso === null) {
    delete next[key];
  } else {
    next[key] = iso;
  }
  saveItineraryDates(next);
  return next;
}

/**
 * "Sleep here instead" stays, keyed by wilaya id. When a day-trip is too far
 * for a nightly round trip (a flight is needed), the itinerary suggests
 * switching to a stay near the destination instead of returning to the base
 * hotel — the chosen alternate stay is remembered per wilaya.
 */
export type AlternateStays = Record<string, PickedStay>;

export function loadAlternateStays(): AlternateStays {
  if (typeof window === "undefined") return {};
  return (
    safeParse<AlternateStays>(
      window.localStorage.getItem(ALTERNATE_STAYS_STORAGE_KEY),
    ) ?? {}
  );
}

export function saveAlternateStays(map: AlternateStays) {
  try {
    window.localStorage.setItem(ALTERNATE_STAYS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // storage unavailable — choice still works in-memory
  }
}
