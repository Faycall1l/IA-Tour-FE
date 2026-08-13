import ProviderDetailView from "@/components/providers/ProviderDetailView";

export const metadata = {
  title: "Guide — ATHAR",
  description: "Guide public page.",
};

export default function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <ProviderDetailView
      userIdPromise={params}
      backHref="/"
      backLabel="Home"
      eyebrow="Guide"
    />
  );
}