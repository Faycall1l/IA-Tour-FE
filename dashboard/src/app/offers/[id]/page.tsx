import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Offer — ATHAR",
  description: "Offer details from a travel agency.",
};

export default async function OfferDetailPage({
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
          <p className="text-sm text-zinc-500">Offer #{id}</p>
          <h1 className="text-3xl font-bold text-zinc-900">
            Offer details
          </h1>
          <p className="mt-1 text-zinc-600">
            Everything about this offer — what&apos;s included, pricing and how to
            book it.
          </p>
        </header>

        <Placeholder label="Offer summary — gallery, description, inclusions, pricing" className="mb-8 min-h-72" />
        <Placeholder label="Related offers from the same agency" />
      </div>
    </main>
  );
}
