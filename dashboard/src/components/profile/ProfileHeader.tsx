import type { UserRead } from "@/lib/types";

/**
 * Profile header: avatar (or initials), display name, role/member badge,
 * phone, languages and bio. Used at the top of the profile page.
 */
export default function ProfileHeader({ user }: { user: UserRead }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-champagne bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4">
        {user.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt={user.display_name ?? "User"}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sea-foam text-2xl text-pine">
            {(user.display_name ?? user.phone.slice(-2)).slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-pine">
            {user.display_name ?? "Traveler"}
          </h1>
          <p className="mt-1 text-sm text-moss">
            {user.role}
            {user.is_verified && (
              <span className="ml-2 rounded-full bg-sea-foam/60 px-2 py-0.5 text-xs font-semibold text-pine">
                ✓ Verified
              </span>
            )}
          </p>
          <p className="mt-1 text-xs text-moss">{user.phone}</p>
        </div>
      </div>

      {user.bio && (
        <p className="mt-4 text-sm leading-relaxed text-moss">{user.bio}</p>
      )}

      {user.languages && user.languages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {user.languages.map((l) => (
            <span
              key={l}
              className="rounded-full bg-champagne/40 px-3 py-1 text-xs capitalize text-moss"
            >
              {l}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}