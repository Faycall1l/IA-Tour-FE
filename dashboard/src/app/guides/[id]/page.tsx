import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Tour guide — ATHAR",
  description: "Touristic guide public page.",
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <p className="text-sm text-zinc-500">Guide #{id}</p>
          <h1 className="text-3xl font-bold text-zinc-900">
            Touristic guide page
          </h1>
          <p className="mt-1 text-zinc-600">
            This is how the guide is shown to visitors.
          </p>
        </header>

        <Placeholder label="Guide header — photo, name, languages, specialties" className="mb-8 min-h-48" />
        <Placeholder label="Guide tours & availability" className="mb-8" />
        <Placeholder label="Guide reviews & ratings" />
      </div>
    </main>
  );
}
