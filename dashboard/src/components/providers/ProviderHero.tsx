import type { ProviderUserRead } from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  guide: "Guide",
  agency: "Travel agency",
  hotel: "Hotel",
  admin: "Admin",
};

/**
 * Provider detail hero: avatar (or initials), display name, role, verified
 * badge and bio.
 */
export default function ProviderHero({ provider }: { provider: ProviderUserRead }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-champagne bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        {provider.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={provider.avatar_url}
            alt={provider.display_name ?? "Provider"}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sea-foam text-3xl text-pine">
            {(provider.display_name ?? "P").slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-pine">
            {provider.display_name ?? "Provider"}
          </h1>
          <p className="mt-1 text-sm text-moss">
            {ROLE_LABELS[provider.role] ?? provider.role}
            {provider.is_verified && (
              <span className="ml-2 rounded-full bg-sea-foam/60 px-2 py-0.5 text-xs font-semibold text-pine">
                ✓ Verified
              </span>
            )}
          </p>
        </div>
      </div>
      {provider.bio && (
        <p className="mt-4 text-sm leading-relaxed text-moss">{provider.bio}</p>
      )}
    </div>
  );
}
