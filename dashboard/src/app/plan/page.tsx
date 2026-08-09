import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Plan a trip — ATHAR",
  description:
    "Tell ATHAR where you want to go and get an itinerary optimized for maximum fun and exploration.",
};

export default function PlanPage() {
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
            Wanna go somewhere?
          </h1>
          <p className="mt-1 text-zinc-600">
            You already know where you&apos;re headed. Give us the basics and we&apos;ll
            optimize your itinerary for maximum fun and exploration.
          </p>
        </header>

        <Placeholder label="Trip brief form — destination, dates, budget, travel style, must-sees" className="mb-8 min-h-64" />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900">
            Suggested itinerary
          </h2>
          <Placeholder label="Generated day-by-day itinerary preview — links to /itinerary" />
        </section>
      </div>
    </main>
  );
}
