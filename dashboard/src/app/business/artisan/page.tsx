import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Artisan profile — ATHAR",
  description: "Manage your artisan profile.",
};

export default function BusinessArtisanPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Artisan profile</h1>
        <p className="mt-1 text-zinc-600">
          This is how your artisan page looks to you, the owner.
        </p>
      </header>

      <Placeholder label="Artisan info editor — photo, craft, workshop, story" className="mb-6 min-h-48" />
      <Placeholder label="Manage work gallery & products" className="mb-6" />
      <Placeholder label="Reviews & contact management" />
    </main>
  );
}
