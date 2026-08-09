import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Itinerary — ATHAR",
  description:
    "Your optimized day-by-day itinerary, tuned for maximum fun and exploration.",
};

export default function ItineraryPage() {
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
          <h1 className="text-3xl font-bold text-zinc-900">My itinerary</h1>
          <p className="mt-1 text-zinc-600">
            Your trip, optimized day by day. Reorder, swap and fine-tune until
            it&apos;s perfect.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/plan"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Optimize my itinerary
          </Link>
          <Link
            href="/stays"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-emerald-500 hover:text-emerald-700"
          >
            Choose my stay
          </Link>
        </div>

        <Placeholder label="Day-by-day itinerary timeline — activities, transport, meals, notes" className="min-h-96" />
      </div>
    </main>
  );
}
