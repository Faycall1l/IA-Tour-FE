import Link from "next/link";
import DateRangeBar from "@/components/plan/DateRangeBar";
import WilayaPicker from "@/components/plan/WilayaPicker";

export const metadata = {
  title: "Plan a trip — GOAA",
  description:
    "Tell GOAA where you want to go and get an itinerary optimized for maximum fun and exploration.",
};

const STEPS = [
  { n: 1, label: "Pick your choices", active: true },
  { n: 2, label: "Pick a stay", active: false },
  { n: 3, label: "Customize itinerary", active: false },
];

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
        >
          ← Home
        </Link>

        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            Wanna go somewhere?
          </h1>
          <p className="mt-1 text-sm text-moss">
            You already know where you&apos;re headed. Pick your wilayas and
            dates, and we&apos;ll optimize your itinerary for maximum fun and
            exploration.
          </p>
        </header>

        <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs ${
                step.active
                  ? "bg-sea-foam font-normal text-pine"
                  : "border border-champagne bg-white font-normal text-moss"
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  step.active ? "bg-pine text-sea-foam" : "bg-champagne text-pine"
                }`}
              >
                {step.n}
              </span>
              {step.label}
            </div>
          ))}
        </div>

        <DateRangeBar />

        <div className="mt-8">
          <h2 className="mb-3 text-center text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
            Where do you want to go?
          </h2>
          <WilayaPicker />
        </div>
      </div>
    </main>
  );
}
