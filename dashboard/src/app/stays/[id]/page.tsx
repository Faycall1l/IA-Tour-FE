"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { StayRead, WilayaSummary } from "@/lib/types";
import SectionHeading from "@/components/ui/SectionHeading";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";
import StayHero from "@/components/stays/StayHero";
import StayFacts from "@/components/stays/StayFacts";
import StayAmenities from "@/components/stays/StayAmenities";
import StayProviderCard from "@/components/stays/StayProviderCard";
import SimilarStays from "@/components/stays/SimilarStays";

export default function StayDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [stay, setStay] = useState<StayRead | null>(null);
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (!cancelled) setWilayas(unwrap(res) ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/stays/{stay_id}", { params: { path: { stay_id: id } } })
      .then((res) => {
        if (cancelled) return;
        setStay(unwrap(res));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, retry]);

  const wilayaName = wilayas.find((w) => w.id === stay?.wilaya_id)?.name;

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          backHref="/stays"
          backLabel="All stays"
          eyebrow="Where to sleep"
          title={stay ? stay.name : "Stay details"}
        />

        {status === "loading" && <LoadingPanel />}

        {status === "error" && (
          <ErrorPanel
            message="Could not load this stay — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {status === "ready" && stay && (
          <>
            <StayHero stay={stay} wilayaName={wilayaName} />

            {stay.description && (
              <p className="mt-6 text-sm leading-relaxed text-moss sm:text-base">
                {stay.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <StayFacts stay={stay} />
                <StayAmenities stay={stay} />
              </div>
              <aside className="space-y-6">
                <StayProviderCard stay={stay} />
              </aside>
            </div>

            <div className="mt-12">
              <SimilarStays stay={stay} wilayaName={wilayaName} />
            </div>

            <p className="mt-12 text-center text-xs text-moss">
              Listing via the ATHAR database — booking handled directly with
              the provider.
            </p>
          </>
        )}

        {status === "ready" && !stay && (
          <ErrorPanel
            message="This stay was not found."
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}
      </div>
    </main>
  );
}
