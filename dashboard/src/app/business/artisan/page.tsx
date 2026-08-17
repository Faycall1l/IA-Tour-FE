"use client";

import ArtisanManager from "@/components/business/ArtisanManager";

export default function BusinessArtisanPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-pine">Artisan profile</h1>
        <p className="mt-1 text-sm text-moss">
          How your artisan page appears to travelers.
        </p>
      </header>

      <div className="max-w-2xl">
        <ArtisanManager />
      </div>
    </main>
  );
}