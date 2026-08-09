import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "My profile — ATHAR",
  description: "Your tourist profile.",
};

export default function ProfilePage() {
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
          <h1 className="text-3xl font-bold text-zinc-900">My profile</h1>
          <p className="mt-1 text-zinc-600">
            Your traveler profile — preferences, saved trips and activity.
          </p>
        </header>

        <Placeholder label="Profile card — photo, name, travel preferences" className="mb-8 min-h-40" />
        <Placeholder label="Saved itineraries & upcoming trips" className="mb-8" />
        <Placeholder label="Saved stays, offers & artisans" />
      </div>
    </main>
  );
}
