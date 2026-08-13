import ProviderDetailView from "@/components/providers/ProviderDetailView";

export const metadata = {
  title: "Agency — ATHAR",
  description: "Travel agency public page.",
};

export default function AgencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProviderDetailView
      userIdPromise={params}
      backHref="/"
      backLabel="Home"
      eyebrow="Travel agency"
    />
  );
}