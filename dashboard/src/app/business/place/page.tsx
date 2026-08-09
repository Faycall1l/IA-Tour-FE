import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Place profile — ATHAR",
  description: "Manage your site, hotel or restaurant profile.",
};

export default function BusinessPlacePage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">
          Site / hotel / restaurant profile
        </h1>
        <p className="mt-1 text-zinc-600">
          This is how your place page looks to you, the owner.
        </p>
      </header>

      <Placeholder label="Place info editor — photos, type, description, location, amenities" className="mb-6 min-h-48" />
      <Placeholder label="Availability, pricing & booking management" className="mb-6" />
      <Placeholder label="Reviews & ratings management" />
    </main>
  );
}
