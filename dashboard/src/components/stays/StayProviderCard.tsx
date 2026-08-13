import Link from "next/link";
import type { StayRead } from "@/lib/types";

/**
 * Stay detail provider card: the listing's owner (name + avatar) with a
 * "Contact provider" link. Rendered only when the stay carries a provider.
 */
export default function StayProviderCard({ stay }: { stay: StayRead }) {
  if (!stay.provider_name) return null;

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Provider</h2>
      <div className="mt-4 flex items-center gap-3">
        {stay.provider_avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stay.provider_avatar}
            alt={stay.provider_name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sea-foam text-xl text-pine">
            {stay.provider_name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-pine">
            {stay.provider_name}
          </p>
          <p className="text-xs text-moss">Hosted on ATHAR</p>
        </div>
      </div>
      <Link
        href="/business/place"
        className="mt-4 inline-block rounded-full bg-pine px-4 py-2 text-xs font-semibold text-white transition hover:bg-moss"
      >
        View provider profile
      </Link>
    </section>
  );
}
