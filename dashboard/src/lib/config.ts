/**
 * Runtime configuration.
 *
 * NEXT_PUBLIC_* vars are inlined at build time.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

/**
 * Serve GETs from the local mock dataset instead of the real backend.
 * The backend is still being wired up, so this defaults to ON — every
 * resolvable GET is answered instantly with mock data, no network wait.
 * Flip to `NEXT_PUBLIC_USE_MOCK_API=false` once the API is ready.
 */
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const APP_NAME = "ATHAR";

export const isDev = process.env.NODE_ENV === "development";
