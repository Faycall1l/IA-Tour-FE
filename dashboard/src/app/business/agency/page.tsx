import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Agency profile — ATHAR",
  description: "Manage your agency profile.",
};

export default function BusinessAgencyPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Agency profile</h1>
        <p className="mt-1 text-zinc-600">
          This is how your agency page looks to you, the owner. Edits apply to
          the public page visitors see.
        </p>
      </header>

      <Placeholder label="Agency info editor — name, cover, description, contact, location" className="mb-6 min-h-48" />
      <Placeholder label="Manage offers & trip packages" className="mb-6" />
      <Placeholder label="Reviews & ratings management" />
    </main>
  );
}
