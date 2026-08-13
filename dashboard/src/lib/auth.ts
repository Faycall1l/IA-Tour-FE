"use client";

import { useCallback, useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { UserRead } from "@/lib/types";

export const TOKEN_KEY = "athar_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export type AuthState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: UserRead };

/**
 * Shared auth hook. Reads the access token from localStorage (the same key the
 * API client middleware reads) and resolves the current user via GET /users/me.
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" });
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const refresh = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setState({ status: "anonymous" });
      return;
    }
    try {
      const user = unwrap(await client.GET("/api/v1/users/me"));
      setState({ status: "authenticated", user });
    } catch {
      clearToken();
      setState({ status: "anonymous" });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signIn = useCallback((newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
    refresh();
  }, [refresh]);

  const signOut = useCallback(() => {
    clearToken();
    setTokenState(null);
    setState({ status: "anonymous" });
  }, []);

  return { ...state, token, signIn, signOut, refresh };
}
