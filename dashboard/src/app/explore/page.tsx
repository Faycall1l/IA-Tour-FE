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
    <main className="min-h-screen bg-zinc-50 px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Home
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">
            Don&apos;t know where to go?
          </h1>
          <p className="mt-1 text-zinc-600">
            Explore possible vacations and trips until something calls your
            name.
          </p>
        </header>

        <Placeholder
          label="Inspiration feeds — by mood, season, budget, surprise me…"
          className="mb-8 min-h-56"
        />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900">
            Start exploring
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {modes.map((mode) => (
              <Link
                key={mode.href}
                href={mode.href}
                className="rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-700"
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
