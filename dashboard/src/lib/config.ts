/**
 * Runtime configuration.
 *
 * NEXT_PUBLIC_* vars are inlined at build time.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const APP_NAME = "ATHAR";

export const isDev = process.env.NODE_ENV === "development";
