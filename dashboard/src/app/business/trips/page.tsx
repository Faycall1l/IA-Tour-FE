"use client";

import TripsManager from "@/components/business/TripsManager";

export default function BusinessTripsPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-pine">Trip tracking</h1>
        <p className="mt-1 text-sm text-moss">
          View and manage your trip plans and their status.
        </p>
      </header>

      <div className="max-w-2xl">
        <TripsManager />
      </div>
    </main>
  );
}