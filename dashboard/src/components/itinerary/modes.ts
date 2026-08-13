import type { TransportContact, TransportOption } from "./types";

const MODE_META: Record<string, { label: string; icon: string }> = {
  bus: { label: "Bus", icon: "🚌" },
  train: { label: "Train", icon: "🚆" },
  tram: { label: "Tram", icon: "🚊" },
  metro: { label: "Metro", icon: "🚇" },
  taxi: { label: "Cab", icon: "🚕" },
  driving: { label: "Driver", icon: "🚗" },
  flight: { label: "Flight", icon: "✈️" },
  ferry: { label: "Ferry", icon: "⛴️" },
  cablecar: { label: "Cable car", icon: "🚡" },
  walking: { label: "Walk", icon: "🚶" },
};

/** Scheduled public lines whose operator publishes a calendar/timetable. */
const CALENDAR_MODES = new Set([
  "bus",
  "train",
  "tram",
  "metro",
  "flight",
  "ferry",
  "cablecar",
]);

const UNKNOWN_MODE = { label: "Travel", icon: "➜" };

function segments(mode: string): string[] {
  return mode.split("+").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function modeParts(mode: string): { label: string; icon: string }[] {
  const segs = segments(mode);
  if (segs.length === 0) return [UNKNOWN_MODE];
  return segs.map((s) => MODE_META[s] ?? UNKNOWN_MODE);
}

export function modeLabel(mode: string): string {
  const segs = segments(mode);
  if (segs.length === 0) return UNKNOWN_MODE.label;
  return segs
    .map((s) => MODE_META[s]?.label ?? s.charAt(0).toUpperCase() + s.slice(1))
    .join(" + ");
}

export function modeIcon(mode: string): string {
  return modeParts(mode)[0]?.icon ?? UNKNOWN_MODE.icon;
}

export function formatDuration(min?: number | null): string {
  if (min == null || Number.isNaN(min)) return "";
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, "0")}`;
}

export function formatCost(cost?: number | null): string {
  if (cost == null || Number.isNaN(cost)) return "";
  return `${Math.round(cost).toLocaleString("en-US")} DZD`;
}

export function formatKm(km?: number | null): string {
  if (km == null || Number.isNaN(km)) return "";
  return `${Math.round(km).toLocaleString("en-US")} km`;
}

/** Unique, normalized websites from a list of operator contacts. */
export function uniqueWebsites(
  contacts?: TransportContact[] | null,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of contacts ?? []) {
    const raw = c?.website?.trim();
    if (!raw) continue;
    const url = raw.startsWith("http") ? raw : `https://${raw}`;
    const normalized = url.replace(/^https:\/\//i, "");
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(url);
  }
  return out;
}

export function websiteLabel(url: string): string {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

/**
 * Whether a mode runs on a published schedule (so a calendar/timetable link
 * makes sense). Taxis and private drivers don't have one.
 */
export function hasScheduleCalendar(mode: string): boolean {
  return segments(mode).some((s) => CALENDAR_MODES.has(s));
}

/** First usable operator website for a transport option, if any. */
export function calendarUrl(option: TransportOption): string | null {
  return uniqueWebsites(option.contacts)[0] ?? null;
}

/** Small readable summary of a schedule object (known keys only). */
export function formatSchedule(schedule?: Record<string, unknown> | null): string {
  if (!schedule) return "";
  const lines: string[] = [];
  const type = schedule["type"];
  if (typeof type === "string" && type !== "road" && type !== "1_hop" && type !== "2_hop") {
    lines.push(type.charAt(0).toUpperCase() + type.slice(1));
  }
  if (schedule["frequency"]) lines.push(`Every ${schedule["frequency"]}`);
  if (schedule["departures"]) lines.push(`Departures: ${schedule["departures"]}`);
  if (schedule["first_departure"]) lines.push(`First: ${schedule["first_departure"]}`);
  if (schedule["last_departure"]) lines.push(`Last: ${schedule["last_departure"]}`);
  if (schedule["road_class"]) lines.push(`Road: ${schedule["road_class"]}`);
  return lines.join(" · ");
}

/** Human-readable price hint from a pricing object (known keys only). */
export function formatPricing(pricing?: Record<string, unknown> | null): string {
  if (!pricing) return "";
  const keys = [
    ["economy", "Economy"],
    ["2nd_class", "2nd class"],
    ["per_person", "Per person"],
    ["bus", "Bus"],
    ["shared_taxi_per_person", "Shared cab /person"],
    ["private_taxi", "Private cab"],
    ["total", "Total"],
  ];
  for (const [k, label] of keys) {
    const v = pricing[k];
    if (typeof v === "number" && !Number.isNaN(v)) {
      return `${label}: ${Math.round(v).toLocaleString("en-US")} DZD`;
    }
  }
  return "";
}
