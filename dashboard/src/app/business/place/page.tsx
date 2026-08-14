"use client";

import ProfileEditorForm from "@/components/business/ProfileEditorForm";

export default function BusinessPlacePage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-pine">
          Site / hotel / restaurant profile
        </h1>
        <p className="mt-1 text-sm text-moss">
          How your property appears to travelers.
        </p>
      </header>

      <div className="max-w-2xl">
        <ProfileEditorForm />
      </div>
    </main>
  );
}