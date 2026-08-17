"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { ProviderDashboard } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";
import RegisterProviderForm from "@/components/business/RegisterProviderForm";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";

/**
 * Business dashboard: aggregated stats for the authenticated provider —
 * experience/stay counts, active counts, and top items. Auth-gated.
 */
export default function BusinessDashboardPage() {
  const auth = useAuth();
  const [dash, setDash] = useState<ProviderDashboard | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    const role = auth.user.role;
    const isProvider =
      role === "agency" || role === "guide" || role === "hotel" || role === "admin";
    if (!isProvider) return;
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/users/me/dashboard")
      .then((res) => {
        if (cancelled) return;
        setDash(unwrap(res));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [auth, retry]);

  if (auth.status !== "authenticated") {
    return (
      <>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-pine">Dashboard</h1>
          <p className="mt-1 text-sm text-moss">
            Sign in to manage your provider listings.
          </p>
        </header>
        {auth.status === "loading" ? (
          <p className="text-sm text-moss">Loading…</p>
        ) : (
          <div className="max-w-md">
            <AuthGate onAuthed={auth.signIn} submitLabel="Sign in to dashboard" />
          </div>
        )}
      </>
    );
  }

  if (auth.user?.role === "traveler") {
    return (
      <>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-pine">Dashboard</h1>
          <p className="mt-1 text-sm text-moss">
            You&apos;re signed in as a traveler — register as a provider to
            start managing listings.
          </p>
        </header>
        <div className="max-w-lg">
          <RegisterProviderForm />
        </div>
      </>
    );
  }

  const stats = dash
    ? [
        { label: "Experiences", value: dash.total_experiences },
        { label: "Active experiences", value: dash.active_experiences },
        { label: "Stays", value: dash.total_stays },
        { label: "Active stays", value: dash.active_stays },
      ]
    : Array.from({ length: 4 }).map(() => ({ label: "—", value: 0 }));

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-pine">Dashboard</h1>
        <p className="mt-1 text-sm text-moss">
          {dash?.company_name ?? "Manage your provider listings in one place."}
          {dash?.is_verified && (
            <span className="ml-2 rounded-full bg-sea-foam/60 px-2 py-0.5 text-xs font-semibold text-pine">
              ✓ Verified
            </span>
          )}
        </p>
      </header>

      {status === "loading" && <LoadingPanel />}

      {status === "error" && (
        <ErrorPanel
          message="Could not load your dashboard — is the API running?"
          onRetry={() => setRetry((n) => n + 1)}
        />
      )}

      {status === "ready" && dash && (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-champagne bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-moss">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-pine">
                  {stat.value.toLocaleString("en-US")}
                </p>
              </div>
            ))}
          </div>

          {dash.top_experiences.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-pine">
                Top experiences
              </h2>
              <ul className="divide-y divide-champagne/60 rounded-2xl border border-champagne bg-white shadow-sm">
                {dash.top_experiences.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-pine">
                        {e.title}
                      </p>
                      <p className="text-xs text-moss">
                        {e.category} · wilaya {e.wilaya_id} · {e.status}
                      </p>
                    </div>
                    <Link
                      href={`/offers`}
                      className="shrink-0 rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                    >
                      View →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {dash.top_stays.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-pine">Top stays</h2>
              <ul className="divide-y divide-champagne/60 rounded-2xl border border-champagne bg-white shadow-sm">
                {dash.top_stays.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-pine">
                        {s.name}
                      </p>
                      <p className="text-xs text-moss">
                        {s.property_type} · wilaya {s.wilaya_id} ·{" "}
                        {s.is_active ? "active" : "inactive"} ·{" "}
                        {s.price_per_night_dzd
                          ? `${s.price_per_night_dzd.toLocaleString("en-US")} DZD`
                          : "—"}
                      </p>
                    </div>
                    <Link
                      href={`/stays/${s.id}`}
                      className="shrink-0 rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                    >
                      View →
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  );
}