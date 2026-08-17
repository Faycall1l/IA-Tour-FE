import PlanPageClient from "@/components/plan/PlanPageClient";

export const metadata = {
  title: "Plan a trip — ATHAR",
  description:
    "Tell ATHAR where you want to go and get an itinerary optimized for maximum fun and exploration.",
};

export default function PlanPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <PlanPageClient />
    </main>
  );
}
