"use client";

import { use, useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { PoiRead, StayRead, WilayaSummary } from "@/lib/types";
import SectionHeading from "@/components/ui/SectionHeading";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";
import PoiDetailView from "@/components/pois/PoiDetailView";
import StayHero from "@/components/stays/StayHero";
import StayFacts from "@/components/stays/StayFacts";
import StayAmenities from "@/components/stays/StayAmenities";
import StayProviderCard from "@/components/stays/StayProviderCard";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; poi: PoiRead | null; stay: StayRead | null };

/**
 * Generic "place" page. Tries the ID as a POI first; when the POI is not
 * found, falls back to treating the ID as a stay.
 */
export default function PlacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);
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
    setState({ status: "loading" });

    async function load() {
      try {
        const poiRes = await client.GET("/api/v1/pois/{poi_id}", {
          params: { path: { poi_id: id } },
        });
        const poi = unwrap(poiRes);
        if (!cancelled) setState({ status: "ready", poi, stay: null });
        return;
      } catch {
        // not a POI — fall through to stay lookup
      }
      try {
        const stayRes = await client.GET("/api/v1/stays/{stay_id}", {
          params: { path: { stay_id: id } },
        });
        const stay = unwrap(stayRes);
        if (!cancelled) setState({ status: "ready", poi: null, stay });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, retry]);

  const wilayaId =
    state.status === "ready"
      ? state.poi?.wilaya_id ?? state.stay?.wilaya_id
      : undefined;
  const wilayaName = wilayas.find((w) => w.id === wilayaId)?.name;

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          backHref="/"
          backLabel="Home"
          eyebrow="Place"
          title={
            state.status === "ready"
              ? state.poi?.name ?? state.stay?.name ?? "Place details"
              : "Place details"
          }
        />

        {state.status === "loading" && <LoadingPanel />}

        {state.status === "error" && (
          <ErrorPanel
            message="Could not load this place — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {state.status === "ready" && state.poi && (
          <PoiDetailView poi={state.poi} wilayaName={wilayaName} />
        )}

        {state.status === "ready" && !state.poi && state.stay && (
          <>
            <StayHero stay={state.stay} wilayaName={wilayaName} />

            {state.stay.description && (
              <p className="mt-6 text-sm leading-relaxed text-moss sm:text-base">
                {state.stay.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <StayFacts stay={state.stay} />
                <StayAmenities stay={state.stay} />
              </div>
              <aside className="space-y-6">
                <StayProviderCard stay={state.stay} />
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
