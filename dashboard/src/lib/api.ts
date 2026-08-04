import { API_BASE_URL } from "./config";
import type { ApiErrorDetail } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Thin typed client for the ATHAR REST API.
 *
 * Authentication is passed via the `Authorization` header (JWT from the auth
 * endpoints). No token is injected here by default so calls stay explicit.
 */
export async function apiFetch<T>(
  path: string,
  options: { method?: string; token?: string; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", token, body } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let detail: unknown;
    try {
      const payload = (await res.json()) as ApiErrorDetail;
      detail = payload.detail;
    } catch {
      detail = await res.text();
    }
    throw new ApiError(
      `API ${method} ${path} failed: ${res.status}`,
      res.status,
      detail,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, token?: string) => apiFetch<T>(path, { token }),
  post: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body: unknown, token?: string) =>
    apiFetch<T>(path, { method: "PUT", body, token }),
  delete: <T>(path: string, token?: string) =>
    apiFetch<T>(path, { method: "DELETE", token }),
};
