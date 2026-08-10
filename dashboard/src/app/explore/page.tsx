import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Get inspired — ATHAR",
  description:
    "Don't know where to go? Explore possible vacations and trips across Algeria.",
};

const modes = [
  { title: "Browse by wilaya", href: "/wilayas" },
  { title: "Search all POIs", href: "/search" },
  { title: "Browse stays", href: "/stays" },
  { title: "Browse offers", href: "/offers/1" },
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
        >
          ← Home
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            Don&apos;t know where to go?
          </h1>
          <p className="mt-1 text-sm text-moss">
            Explore possible vacations and trips until something calls your
            name.
          </p>
        </header>

        <Placeholder
          label="Inspiration feeds — by mood, season, budget, surprise me…"
          className="mb-8 min-h-56"
        />

        <section>
          <h2 className="mb-4 text-xl font-bold text-pine">
            Start exploring
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {modes.map((mode) => (
              <Link
                key={mode.href}
                href={mode.href}
                className="rounded-2xl border border-champagne bg-white px-5 py-4 text-sm font-normal text-moss transition hover:border-sea-foam hover:text-pine"
              >
                {mode.title} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
