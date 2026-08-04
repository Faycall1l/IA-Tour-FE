/**
 * Shared API response types (mirrors the ATHAR backend OpenAPI schemas).
 */

export interface WilayaSummary {
  id: number;
  name: string;
  description?: string | null;
  total_pois: number;
  total_featured: number;
  total_experiences: number;
  total_stays: number;
  total_artisans: number;
  top_categories?: string[];
  highlight_poi?: string | null;
  highlight_poi_photo?: string | null;
  highlight_category?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Pois {
  id: string;
  name?: string | null;
  category: string;
  subtype?: string | null;
  description?: string | null;
  price_level?: string | null;
  entry_fee_dzd?: number | null;
  suggested_duration_min?: number | null;
  photo_url?: string | null;
  is_featured?: boolean | null;
  wilaya_id: number;
}

export interface HealthStatus {
  status: string;
  services?: Record<string, unknown>;
}

export interface AgentChatResponse {
  reply: string;
  session_id: string | null;
  degraded: boolean;
}

export interface ApiErrorDetail {
  detail?: string | unknown;
}
