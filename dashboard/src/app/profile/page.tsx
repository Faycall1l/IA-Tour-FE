"use client";

import { useAuth } from "@/lib/auth";
import AuthGate from "@/components/AuthGate";
import SectionHeading from "@/components/ui/SectionHeading";
import ProfileHeader from "@/components/profile/ProfileHeader";
import FavoritesSection from "@/components/profile/FavoritesSection";
import CollectionsSection from "@/components/profile/CollectionsSection";
import TripsSection from "@/components/profile/TripsSection";

export default function ProfilePage() {
  const auth = useAuth();

  if (auth.status !== "authenticated") {
    return (
      <main className="min-h-screen bg-white px-6 pb-16 pt-24">
        <div className="mx-auto max-w-md">
          <SectionHeading
            backHref="/"
            backLabel="Home"
            eyebrow="Account"
            title="Sign in"
            subtitle="Your traveler profile — saved places, collections and trips."
          />
          {auth.status === "loading" ? (
            <p className="text-sm text-moss">Loading…</p>
          ) : (
            <AuthGate onAuthed={auth.signIn} submitLabel="Sign in to your profile" />
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          backHref="/"
          backLabel="Home"
          eyebrow="Account"
          title="My profile"
        />

        <div className="space-y-6">
          <ProfileHeader user={auth.user} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FavoritesSection />
            <CollectionsSection />
          </div>
          <TripsSection />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={auth.signOut}
            className="rounded-full border border-champagne bg-white px-4 py-2 text-xs font-medium text-moss transition hover:bg-champagne/30"
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}