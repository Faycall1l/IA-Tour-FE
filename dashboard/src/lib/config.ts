/**
 * Runtime configuration.
 *
 * NEXT_PUBLIC_* vars are inlined at build time.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/**
 * Serve GETs from the local mock dataset instead of the real backend.
 * The real API is live and fully seeded, so this defaults to OFF — every
 * GET hits the real backend. Set `NEXT_PUBLIC_USE_MOCK_API=true` to fall
 * back to mock sample data (e.g. offline demo without a backend).
 */
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export const APP_NAME = "ATHAR";

export const isDev = process.env.NODE_ENV === "development";
