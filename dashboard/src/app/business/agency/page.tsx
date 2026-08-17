"use client";

import ProfileEditorForm from "@/components/business/ProfileEditorForm";

export default function BusinessAgencyPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-pine">Agency profile</h1>
        <p className="mt-1 text-sm text-moss">
          How your agency appears to travelers — edits apply to the public page.
        </p>
      </header>

      <div className="max-w-2xl">
        <ProfileEditorForm />
      </div>
    </main>
  );
}