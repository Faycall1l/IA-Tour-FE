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
export type ArtisanRead = components["schemas"]["ArtisanRead"];
export type ArtisanFeed = components["schemas"]["ArtisanFeed"];
export type ArtisanTransitAccessRead =
  components["schemas"]["ArtisanTransitAccessRead"];
export type ExperienceRead = components["schemas"]["ExperienceRead"];
export type ExperienceDetail = components["schemas"]["ExperienceDetail"];
export type ExperienceFeed = components["schemas"]["ExperienceFeed"];
export type StayRead = components["schemas"]["StayRead"];
export type StayFeed = components["schemas"]["StayFeed"];
export type EventRead = components["schemas"]["EventRead"];
export type EventFeed = components["schemas"]["EventFeed"];
export type ProviderUserRead = components["schemas"]["ProviderUserRead"];
export type ProviderProfileRead = components["schemas"]["ProviderProfileRead"];
export type TripBrief = components["schemas"]["TripBrief"];
export type ProviderDashboard = components["schemas"]["ProviderDashboard"];
export type UserRead = components["schemas"]["UserRead"];

export interface ApiErrorDetail {
  detail?: string | unknown;
}
