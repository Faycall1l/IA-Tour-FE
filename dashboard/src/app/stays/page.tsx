import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Choose your stay — ATHAR",
  description:
    "Compare hotels, guesthouses and more across Algeria to pick the stay that fits your trip.",
};

export default function StaysPage() {
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
            Choosing your stay
          </h1>
          <p className="mt-1 text-zinc-600">
            Compare options across your itinerary and lock in the place that
            fits your trip.
          </p>
        </header>

        <Placeholder label="Filters — wilaya, dates, guests, price range, property type" className="mb-8 min-h-24" />
        <Placeholder label="Stays results grid — compare, shortlist, select per itinerary night" className="min-h-80" />
      </div>
    </main>
  );
}
