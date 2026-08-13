import type { ProviderUserRead } from "@/lib/types";
import type { PickedSite } from "@/lib/itinerary";

export type Destination = {
  wilaya_id: number;
  wilaya_name: string;
  sites: PickedSite[];
};

export type TransportContact = {
  name?: string | null;
  mode?: string | null;
  phone?: string | null;
  website?: string | null;
  email?: string | null;
};

export type TransportOption = {
  mode: string;
  line_name?: string | null;
  operator?: string | null;
  cost_dzd?: number | null;
  duration_min?: number | null;
  schedule?: Record<string, unknown> | null;
  pricing?: Record<string, unknown> | null;
  transfers?: number | null;
  contacts?: TransportContact[] | null;
};

export type RouteResponse = {
  origin_wilaya_id?: number;
  dest_wilaya_id?: number;
  driving_distance_km?: number | null;
  driving_time_minutes?: number | null;
  options?: TransportOption[] | null;
};

export type RouteStatus = {
  status: "loading" | "error" | "ready";
  route?: RouteResponse;
};

export type EdgeDef = {
  key: string;
  from_wilaya_id: number;
  to_wilaya_id: number;
  from_name: string;
  to_name: string;
};

export type GuideMatch = {
  destination: Destination;
  guides: ProviderUserRead[];
};
