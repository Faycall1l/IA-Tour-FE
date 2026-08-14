"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { ProviderDashboard, StayRead } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";

const PROPERTY_TYPES = [
  "hotel",
  "riad",
  "guesthouse",
  "hostel",
  "eco_lodge",
] as const;

const inputClass =
  "w-full rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine placeholder-zinc-400 focus:border-rustic-gold focus:outline-none focus:ring-2 focus:ring-champagne";
const labelClass = "text-xs font-medium uppercase tracking-wide text-moss";

function StayEditor({ stayId, onDone }: { stayId: string; onDone: () => void }) {
  const [name, setName] = useState("");
  const [propertyType, setPropertyType] = useState("hotel");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/stays/{stay_id}", {
        params: { path: { stay_id: stayId } },
      })
      .then((res) => {
        if (cancelled) return;
        const s = unwrap(res);
        setName(s.name ?? "");
        setPropertyType(s.property_type ?? "hotel");
        setDescription(s.description ?? "");
        setAddress(s.address ?? "");
        setPrice(
          s.price_per_night_dzd != null ? String(s.price_per_night_dzd) : "",
        );
        setIsActive(s.is_active);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [stayId]);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await unwrap(
        await client.PUT("/api/v1/stays/{stay_id}", {
          params: { path: { stay_id: stayId } },
          body: {
            name: name || null,
            property_type: propertyType || null,
            description: description || null,
            address: address || null,
            price_per_night_dzd: price ? Number(price) : null,
            is_active: isActive,
          },
        }),
      );
      setSaved(true);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save stay");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-champagne bg-white p-5 shadow-sm">
      <h3 className="font-bold text-pine">Edit stay</h3>
      <form
        className="mt-3 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div>
          <label className={labelClass} htmlFor={`name-${stayId}`}>
            Name
          </label>
          <input
            id={`name-${stayId}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`type-${stayId}`}>
            Property type
          </label>
          <select
            id={`type-${stayId}`}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={inputClass}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor={`desc-${stayId}`}>
            Description
          </label>
          <textarea
            id={`desc-${stayId}`}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`addr-${stayId}`}>
            Address
          </label>
          <input
            id={`addr-${stayId}`}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`price-${stayId}`}>
            Price per night (DZD)
          </label>
          <input
            id={`price-${stayId}`}
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-pine">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-sea-foam"
          />
          Accepting guests (active)
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-moss">Saved.</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-sea-foam px-4 py-2 text-sm font-semibold text-pine transition hover:bg-champagne disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save stay"}
        </button>
      </form>
    </div>
  );
}

/**
 * Stay manager for providers: lists the provider's stays (from the dashboard
 * top_stays) and edits each via PUT /stays/{id}. Provider-only.
 */
export default function StayManager() {
  const auth = useAuth();
  const [dash, setDash] = useState<ProviderDashboard | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    const role = auth.user.role;
    if (!["agency", "guide", "hotel", "admin"].includes(role)) return;
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
      <div className="max-w-md rounded-2xl border border-champagne bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pine">Manage stays</h2>
        <p className="mb-4 mt-1 text-sm text-moss">
          Sign in as a hotel or agency to manage your stays.
        </p>
        {auth.status === "loading" ? (
          <p className="text-sm text-moss">Loading…</p>
        ) : (
          <AuthGate onAuthed={auth.signIn} submitLabel="Sign in to manage stays" />
        )}
      </div>
    );
  }

  if (!["agency", "guide", "hotel", "admin"].includes(auth.user.role)) {
    return (
      <p className="text-sm text-moss">
        Stays can only be managed by hotels and agencies.
      </p>
    );
  }

  if (status === "loading") return <LoadingPanel />;
  if (status === "error")
    return (
      <ErrorPanel
        message="Could not load your stays — is the API running?"
        onRetry={() => setRetry((n) => n + 1)}
      />
    );

  const stays = dash?.top_stays ?? [];

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-pine">Manage stays</h2>
        <span className="rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-moss">
          {dash?.total_stays ?? 0} total
        </span>
      </div>

      {stays.length === 0 ? (
        <p className="mt-4 text-sm text-moss">
          No stays listed yet. Your active stays will appear here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-champagne/60">
          {stays.map((s) => (
            <li key={s.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
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
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() =>
                      setExpanded(expanded === s.id ? null : s.id)
                    }
                    className="rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                  >
                    {expanded === s.id ? "Close" : "Edit"}
                  </button>
                  <Link
                    href={`/stays/${s.id}`}
                    className="rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                  >
                    View
                  </Link>
                </div>
              </div>
              {expanded === s.id && (
                <div className="mt-3">
                  <StayEditor stayId={s.id} onDone={() => setRetry((n) => n + 1)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}