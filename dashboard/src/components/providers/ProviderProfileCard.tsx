import type { ProviderUserRead } from "@/lib/types";

/**
 * Provider detail facts: company/registration, experience, team size,
 * languages, service areas, website, certifications, specializations and
 * price range. Only renders rows that exist.
 */
export default function ProviderProfileCard({
  provider,
}: {
  provider: ProviderUserRead;
}) {
  const p = provider.profile;
  if (!p) return null;

  const rows: { label: string; value: string }[] = [];
  if (p.company_name) rows.push({ label: "Company", value: p.company_name });
  if (p.registration_number)
    rows.push({ label: "Registration", value: p.registration_number });
  if (p.experience_years != null)
    rows.push({ label: "Experience", value: `${p.experience_years} years` });
  if (p.team_size != null)
    rows.push({ label: "Team size", value: String(p.team_size) });
  if (p.max_group_size != null)
    rows.push({ label: "Max group", value: `${p.max_group_size} people` });
  if (provider.languages && provider.languages.length > 0)
    rows.push({ label: "Languages", value: provider.languages.join(", ") });
  if (p.service_areas && p.service_areas.length > 0)
    rows.push({ label: "Service areas", value: p.service_areas.join(", ") });
  if (p.price_range_min != null)
    rows.push({
      label: "Price range",
      value: `${p.price_range_min} – ${p.price_range_max ?? "—"} DZD`,
    });
  if (p.star_rating != null)
    rows.push({ label: "Star rating", value: `${p.star_rating}/5` });

  const tags = [
    ...(p.specializations ?? []),
    ...(p.certifications ?? []),
  ];

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">About the provider</h2>
      {rows.length > 0 && (
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="rounded-xl bg-champagne/20 p-3">
              <dt className="text-xs text-moss">{r.label}</dt>
              <dd className="mt-0.5 font-medium capitalize text-pine">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {p.website && (
        <a
          href={p.website}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block rounded-full bg-pine px-4 py-2 text-xs font-semibold text-white transition hover:bg-moss"
        >
          Visit website
        </a>
      )}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-champagne/40 px-3 py-1 text-xs capitalize text-moss"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
