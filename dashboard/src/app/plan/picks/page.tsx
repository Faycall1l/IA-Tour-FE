import PicksClient from "@/components/plan/PicksClient";

export const metadata = {
  title: "Pick sites — ATHAR",
  description: "Choose the sites you want to visit on your trip.",
};

export default function PicksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <PicksClient searchParams={searchParams} />
    </main>
  );
}
