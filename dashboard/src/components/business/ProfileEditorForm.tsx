"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ProviderUserRead } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";

const inputClass =
  "w-full rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine placeholder-zinc-400 focus:border-rustic-gold focus:outline-none focus:ring-2 focus:ring-champagne";
const labelClass = "text-xs font-medium uppercase tracking-wide text-moss";

function joinList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Profile editor for providers: edits public user fields (display name, bio,
 * languages, avatar) plus provider-profile fields (company/property, website,
 * pricing, amenities). Persists via PUT /users/me + PUT /users/me/profile.
 */
export default function ProfileEditorForm() {
  const auth = useAuth();
  const [data, setData] = useState<ProviderUserRead | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [website, setWebsite] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [amenities, setAmenities] = useState("");
  const [starRating, setStarRating] = useState("");
  const [priceRangeMin, setPriceRangeMin] = useState("");
  const [priceRangeMax, setPriceRangeMax] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/users/providers/{user_id}", {
        params: { path: { user_id: auth.user.id } },
      })
      .then((res) => {
        if (cancelled) return;
        const item = unwrap(res);
        setData(item);
        setDisplayName(item.display_name ?? "");
        setBio(item.bio ?? "");
        setLanguages((item.languages ?? []).join(", "));
        setAvatarUrl(item.avatar_url ?? "");
        const p = item.profile;
        setCompanyName(p?.company_name ?? "");
        setPropertyName(p?.property_name ?? "");
        setWebsite(p?.website ?? "");
        setTeamSize(p?.team_size != null ? String(p.team_size) : "");
        setExperienceYears(
          p?.experience_years != null ? String(p.experience_years) : "",
        );
        setServiceAreas((p?.service_areas ?? []).join(", "));
        setSpecializations((p?.specializations ?? []).join(", "));
        setAmenities((p?.amenities ?? []).join(", "));
        setStarRating(p?.star_rating != null ? String(p.star_rating) : "");
        setPriceRangeMin(
          p?.price_range_min != null ? String(p.price_range_min) : "",
        );
        setPriceRangeMax(
          p?.price_range_max != null ? String(p.price_range_max) : "",
        );
        setCheckInTime(p?.check_in_time ?? "");
        setCheckOutTime(p?.check_out_time ?? "");
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [auth, retry]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      await unwrap(
        await client.PUT("/api/v1/users/me", {
          body: {
            display_name: displayName || null,
            bio: bio || null,
            languages: languages ? joinList(languages) : null,
            avatar_url: avatarUrl || null,
          },
        }),
      );
      await unwrap(
        await client.PUT("/api/v1/users/me/profile", {
          body: {
            company_name: companyName || null,
            property_name: propertyName || null,
            website: website || null,
            team_size: teamSize ? Number(teamSize) : null,
            experience_years: experienceYears ? Number(experienceYears) : null,
            service_areas: serviceAreas ? joinList(serviceAreas) : null,
            specializations: specializations ? joinList(specializations) : null,
            amenities: amenities ? joinList(amenities) : null,
            star_rating: starRating ? Number(starRating) : null,
            price_range_min: priceRangeMin ? Number(priceRangeMin) : null,
            price_range_max: priceRangeMax ? Number(priceRangeMax) : null,
            check_in_time: checkInTime || null,
            check_out_time: checkOutTime || null,
          },
        }),
      );
      setSaved("Profile saved.");
      auth.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save — try again",
      );
    } finally {
      setBusy(false);
    }
  };

  if (auth.status !== "authenticated") {
    return (
      <div className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-pine">Edit profile</h2>
        <p className="mb-4 mt-1 text-sm text-moss">
          Sign in to manage how you appear to travelers.
        </p>
        {auth.status === "loading" ? (
          <p className="text-sm text-moss">Loading…</p>
        ) : (
          <AuthGate onAuthed={auth.signIn} submitLabel="Sign in to edit profile" />
        )}
      </div>
    );
  }

  if (status === "loading") return <LoadingPanel />;
  if (status === "error")
    return (
      <ErrorPanel
        message="Could not load your profile — is the API running?"
        onRetry={() => setRetry((n) => n + 1)}
      />
    );
  if (!data) return null;

  const isHotel = data.role === "hotel";

  return (
    <div className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Edit profile</h2>
      <p className="mb-4 mt-1 text-sm text-moss">
        How you appear to travelers on ATHAR.
      </p>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <label className={labelClass} htmlFor="displayName">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="languages">
              Languages (comma-separated)
            </label>
            <input
              id="languages"
              type="text"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="fr, ar, en"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="avatarUrl">
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {!isHotel ? (
            <div>
              <label className={labelClass} htmlFor="companyName">
                Company name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label className={labelClass} htmlFor="propertyName">
                Property name
              </label>
              <input
                id="propertyName"
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
          <div>
            <label className={labelClass} htmlFor="website">
              Website
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
        </div>

        {isHotel ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="starRating">
                  Star rating (1-5)
                </label>
                <input
                  id="starRating"
                  type="number"
                  min={1}
                  max={5}
                  value={starRating}
                  onChange={(e) => setStarRating(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="priceRange">
                  Price range (DZD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    value={priceRangeMin}
                    onChange={(e) => setPriceRangeMin(e.target.value)}
                    placeholder="Min"
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min={0}
                    value={priceRangeMax}
                    onChange={(e) => setPriceRangeMax(e.target.value)}
                    placeholder="Max"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="checkInTime">
                  Check-in time
                </label>
                <input
                  id="checkInTime"
                  type="text"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  placeholder="14:00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="checkOutTime">
                  Check-out time
                </label>
                <input
                  id="checkOutTime"
                  type="text"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  placeholder="12:00"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="amenities">
                Amenities (comma-separated)
              </label>
              <input
                id="amenities"
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="wifi, parking, breakfast"
                className={inputClass}
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
            <div>
              <label className={labelClass} htmlFor="serviceAreas">
                Service areas (comma-separated)
              </label>
              <input
                id="serviceAreas"
                type="text"
                value={serviceAreas}
                onChange={(e) => setServiceAreas(e.target.value)}
                placeholder="Algiers, Tipaza, Blida"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="specializations">
                Specializations (comma-separated)
              </label>
              <input
                id="specializations"
                type="text"
                value={specializations}
                onChange={(e) => setSpecializations(e.target.value)}
                placeholder="Sahara treks, cultural tours"
                className={inputClass}
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-moss">{saved}</p>}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-sea-foam px-4 py-2 text-sm font-semibold text-pine transition hover:bg-champagne disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}