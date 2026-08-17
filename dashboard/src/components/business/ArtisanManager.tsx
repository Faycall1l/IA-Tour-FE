"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ArtisanRead } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";

const inputClass =
  "w-full rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine placeholder-zinc-400 focus:border-rustic-gold focus:outline-none focus:ring-2 focus:ring-champagne";
const labelClass = "text-xs font-medium uppercase tracking-wide text-moss";

function ArtisanEditor({
  artisan,
  onDone,
}: {
  artisan: ArtisanRead;
  onDone: () => void;
}) {
  const [name, setName] = useState(artisan.name ?? "");
  const [craftType, setCraftType] = useState(artisan.craft_type ?? "");
  const [description, setDescription] = useState(artisan.description ?? "");
  const [phone, setPhone] = useState(artisan.phone ?? "");
  const [website, setWebsite] = useState(artisan.website ?? "");
  const [address, setAddress] = useState(artisan.address ?? "");
  const [openingHours, setOpeningHours] = useState(artisan.opening_hours ?? "");
  const [acceptsVisitors, setAcceptsVisitors] = useState(
    artisan.accepts_visitors ?? false,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await unwrap(
        await client.PUT("/api/v1/artisans/{artisan_id}", {
          params: { path: { artisan_id: artisan.id } },
          body: {
            name: name || null,
            craft_type: craftType || null,
            description: description || null,
            phone: phone || null,
            website: website || null,
            address: address || null,
            opening_hours: openingHours || null,
            accepts_visitors: acceptsVisitors,
          },
        }),
      );
      setSaved(true);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save artisan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-champagne bg-white p-5 shadow-sm">
      <h3 className="font-bold text-pine">Edit artisan profile</h3>
      <form
        className="mt-3 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor={`aname-${artisan.id}`}>
              Name
            </label>
            <input
              id={`aname-${artisan.id}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`acraft-${artisan.id}`}>
              Craft type
            </label>
            <input
              id={`acraft-${artisan.id}`}
              type="text"
              value={craftType}
              onChange={(e) => setCraftType(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor={`adesc-${artisan.id}`}>
            Description
          </label>
          <textarea
            id={`adesc-${artisan.id}`}
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor={`aphone-${artisan.id}`}>
              Phone
            </label>
            <input
              id={`aphone-${artisan.id}`}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`aweb-${artisan.id}`}>
              Website
            </label>
            <input
              id={`aweb-${artisan.id}`}
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor={`aaddr-${artisan.id}`}>
              Address
            </label>
            <input
              id={`aaddr-${artisan.id}`}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`ahours-${artisan.id}`}>
              Opening hours
            </label>
            <input
              id={`ahours-${artisan.id}`}
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-pine">
          <input
            type="checkbox"
            checked={acceptsVisitors}
            onChange={(e) => setAcceptsVisitors(e.target.checked)}
            className="accent-sea-foam"
          />
          Accepts visitors at the workshop
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-moss">Saved.</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-sea-foam px-4 py-2 text-sm font-semibold text-pine transition hover:bg-champagne disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save artisan"}
        </button>
      </form>
    </div>
  );
}

/**
 * Artisan manager: lists the artisans owned by the signed-in user (filtered
 * client-side by ArtisanRead.user_id) and edits each via PUT /artisans/{id}.
 */
export default function ArtisanManager() {
  const auth = useAuth();
  const [artisans, setArtisans] = useState<ArtisanRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/artisans", { params: { query: { page_size: 50 } } })
      .then((res) => {
        if (cancelled) return;
        const all = unwrap(res).items ?? [];
        const mine = all.filter((a) => a.user_id === auth.user.id);
        setArtisans(mine);
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
        <h2 className="text-lg font-bold text-pine">Manage artisan profiles</h2>
        <p className="mb-4 mt-1 text-sm text-moss">
          Sign in to manage your artisan listings.
        </p>
        {auth.status === "loading" ? (
          <p className="text-sm text-moss">Loading…</p>
        ) : (
          <AuthGate
            onAuthed={auth.signIn}
            submitLabel="Sign in to manage artisans"
          />
        )}
      </div>
    );
  }

  if (status === "loading") return <LoadingPanel />;
  if (status === "error")
    return (
      <ErrorPanel
        message="Could not load your artisans — is the API running?"
        onRetry={() => setRetry((n) => n + 1)}
      />
    );

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Manage artisan profiles</h2>
      <p className="mt-1 text-sm text-moss">
        {artisans.length} artisan{" "}
        {artisans.length === 1 ? "listing" : "listings"} linked to your
        account.
      </p>

      {artisans.length === 0 ? (
        <p className="mt-4 text-sm text-moss">
          No artisan profiles are linked to your account yet. When a profile
          lists you as its owner it will appear here.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-champagne/60">
          {artisans.map((a) => (
            <li key={a.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-pine">
                    {a.name}
                  </p>
                  <p className="text-xs text-moss">
                    {a.craft_type} · wilaya {a.wilaya_id}
                    {a.commune ? ` · ${a.commune}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  className="shrink-0 rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                >
                  {expanded === a.id ? "Close" : "Edit"}
                </button>
              </div>
              {expanded === a.id && (
                <div className="mt-3">
                  <ArtisanEditor artisan={a} onDone={() => setRetry((n) => n + 1)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}