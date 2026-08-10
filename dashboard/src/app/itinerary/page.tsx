import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Itinerary — ATHAR",
  description:
    "Your optimized day-by-day itinerary, tuned for maximum fun and exploration.",
};

export default function ItineraryPage() {
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
            My itinerary
          </h1>
          <p className="mt-1 text-sm text-moss">
            Your trip, optimized day by day. Reorder, swap and fine-tune until
            it&apos;s perfect.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/plan"
            className="rounded-full bg-sea-foam px-4 py-1.5 text-xs font-normal text-pine shadow-sm transition hover:bg-champagne"
          >
            Optimize my itinerary
          </Link>
          <Link
            href="/stays"
            className="rounded-full border border-champagne bg-white px-4 py-1.5 text-xs font-normal text-moss transition hover:border-sea-foam hover:text-pine"
          >
            Choose my stay
          </Link>
        </div>

        <Placeholder label="Day-by-day itinerary timeline — activities, transport, meals, notes" className="min-h-96" />
      </div>
    </main>
  );
}
