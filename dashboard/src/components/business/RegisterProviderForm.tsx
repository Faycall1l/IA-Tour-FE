"use client";

import { useState } from "react";
import { client, unwrap } from "@/lib/client";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";

const PROVIDER_TYPES = [
  { value: "guide", label: "Tour guide" },
  { value: "agency", label: "Travel agency" },
  { value: "hotel", label: "Hotel / stay" },
] as const;

const PROPERTY_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "riad", label: "Riad" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "hostel", label: "Hostel" },
  { value: "eco_lodge", label: "Eco lodge" },
] as const;

const inputClass =
  "w-full rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine placeholder-zinc-400 focus:border-rustic-gold focus:outline-none focus:ring-2 focus:ring-champagne";
const labelClass = "text-xs font-medium uppercase tracking-wide text-moss";

export default function RegisterProviderForm() {
  const auth = useAuth();
  const [providerType, setProviderType] = useState<string>("guide");
  const [companyName, setCompanyName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState<string>("hotel");
  const [website, setWebsite] = useState("");
  const [experienceYears, setExperienceYears] = useState("1");
  const [teamSize, setTeamSize] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (auth.status !== "authenticated") {
    return (
      <div className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pine">Become a provider</h2>
        <p className="mb-4 mt-1 text-sm text-moss">
          Register your agency, guiding services or stay so travelers can find
          you on ATHAR.
        </p>
        {auth.status === "loading" ? (
          <p className="text-sm text-moss">Loading…</p>
        ) : (
          <AuthGate
            onAuthed={auth.signIn}
            submitLabel="Sign in to register"
          />
        )}
      </div>
    );
  }

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await unwrap(
        await client.POST("/api/v1/auth/register-provider", {
          body: {
            phone: auth.user.phone,
            provider_type: providerType,
            company_name:
              providerType === "agency" ? companyName || null : null,
            property_name:
              providerType === "hotel" ? propertyName || null : null,
            property_type:
              providerType === "hotel" ? propertyType || null : null,
            website: website || null,
            experience_years:
              providerType !== "hotel" && experienceYears
                ? Number(experienceYears)
                : null,
            team_size:
              providerType === "agency" && teamSize
                ? Number(teamSize)
                : null,
          },
        }),
      );
      setDone(true);
      auth.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not register — try again shortly",
      );
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pine">You&apos;re registered</h2>
        <p className="mt-1 text-sm text-moss">
          Your {providerType} profile is live. Refresh the dashboard to see it.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Become a provider</h2>
      <p className="mb-4 mt-1 text-sm text-moss">
        Tell us how you want to appear to travelers.
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <label className={labelClass} htmlFor="providerType">
            Provider type
          </label>
          <select
            id="providerType"
            value={providerType}
            onChange={(e) => setProviderType(e.target.value)}
            className={inputClass}
          >
            {PROVIDER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {providerType === "agency" && (
          <div>
            <label className={labelClass} htmlFor="companyName">
              Company name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Sahara Trek Tours"
              className={inputClass}
            />
          </div>
        )}

        {providerType === "hotel" && (
          <>
            <div>
              <label className={labelClass} htmlFor="propertyName">
                Property name
              </label>
              <input
                id="propertyName"
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Riad el Djanan"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="propertyType">
                Property type
              </label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={inputClass}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className={labelClass} htmlFor="website">
            Website (optional)
          </label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://…"
            className={inputClass}
          />
        </div>

        {providerType !== "hotel" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="experienceYears">
                Years of experience
              </label>
              <input
                id="experienceYears"
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className={inputClass}
              />
            </div>
            {providerType === "agency" && (
              <div>
                <label className={labelClass} htmlFor="teamSize">
                  Team size
                </label>
                <input
                  id="teamSize"
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-sea-foam px-4 py-2 text-sm font-semibold text-pine transition hover:bg-champagne disabled:opacity-50"
        >
          {busy ? "Registering…" : "Register as provider"}
        </button>
      </form>
    </div>
  );
}