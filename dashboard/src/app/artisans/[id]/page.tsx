import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Artisan — ATHAR",
  description: "Artisan public page.",
};

export default async function ArtisanPage({
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
          <p className="text-sm text-zinc-500">Artisan #{id}</p>
          <h1 className="text-3xl font-bold text-zinc-900">Artisan page</h1>
          <p className="mt-1 text-zinc-600">
            This is how the artisan is shown to visitors.
          </p>
        </header>

        <Placeholder label="Artisan header — photo, craft, workshop location" className="mb-8 min-h-48" />
        <Placeholder label="Artisan work gallery & products" className="mb-8" />
        <Placeholder label="Artisan reviews & contact" />
      </div>
    </main>
  );
}
