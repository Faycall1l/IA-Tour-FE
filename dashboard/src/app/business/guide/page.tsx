import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Guide profile — ATHAR",
  description: "Manage your touristic guide profile.",
};

export default function BusinessGuidePage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Guide profile</h1>
        <p className="mt-1 text-zinc-600">
          This is how your guide page looks to you, the owner.
        </p>
      </header>

      <Placeholder label="Guide info editor — photo, bio, languages, specialties" className="mb-6 min-h-48" />
      <Placeholder label="Manage tours, pricing & availability" className="mb-6" />
      <Placeholder label="Reviews & ratings management" />
    </main>
  );
}
