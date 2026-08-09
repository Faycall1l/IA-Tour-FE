import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Trip tracking — ATHAR",
  description: "Track active trips for your agency.",
};

export default function BusinessTripsPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Trip tracking</h1>
        <p className="mt-1 text-zinc-600">
          Follow the live status of every trip your agency is running.
        </p>
      </header>

      <Placeholder label="Active trips list — destination, dates, travelers, status" className="mb-6" />
      <Placeholder label="Trip detail — live timeline, checkpoints, traveler updates" className="min-h-64" />
    </main>
  );
}
