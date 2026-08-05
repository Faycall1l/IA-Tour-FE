/**
 * Shared API response types.
 *
 * These are re-exported from the OpenAPI-generated contract (src/lib/api-types.ts),
 * which is derived from the backend's docs/specs/openapi.json via
 * `npm run generate:api`. Do NOT hand-write API shapes here — regenerate instead.
 */
import type { components } from "./api-types";

export type WilayaSummary = components["schemas"]["WilayaSummary"];
export type PoiSummary = components["schemas"]["DiscoverPOI"];
export type StaySummary = components["schemas"]["DiscoverStay"];
export type ExperienceSummary = components["schemas"]["DiscoverExperience"];
export type WilayaDetail = components["schemas"]["DiscoverResponse"];
export type PoiRead = components["schemas"]["POIRead"];
export type PoiFeed = components["schemas"]["POIFeed"];
export type AgentChatResponse = components["schemas"]["AgentChatResponse"];

export interface ApiErrorDetail {
  detail?: string | unknown;
}
