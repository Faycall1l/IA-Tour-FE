"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { PoiRead, WilayaSummary } from "@/lib/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/ui/SectionHeading";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";
import PoiDetailView from "@/components/pois/PoiDetailView";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; poi: PoiRead };

export default function PoiDetailPage() {
  const params = useParams();
  const id = String(params.id);
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
    client
      .GET("/api/v1/pois/{poi_id}", { params: { path: { poi_id: id } } })
      .then((res) => {
        if (!cancelled) setState({ status: "ready", poi: unwrap(res) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [id, retry]);

  const wilayaName = wilayas.find(
    (w) => w.id === (state.status === "ready" ? state.poi.wilaya_id : undefined),
  )?.name;

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        <Breadcrumb
          segments={[
            { label: "home", href: "/" },
            ...(state.status === "ready" && wilayaName
              ? [{ label: wilayaName, href: `/wilayas/${state.poi.wilaya_id}` }]
              : []),
            ...(state.status === "ready"
              ? [{ label: state.poi.name ?? state.poi.category }]
              : []),
          ]}
        />
        <SectionHeading
          eyebrow="Place"
          title={state.status === "ready" ? (state.poi.name ?? state.poi.category) : "Place details"}
        />

        {state.status === "loading" && <LoadingPanel />}

        {state.status === "error" && (
          <ErrorPanel
            message="Could not load this place — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {state.status === "ready" && (
          <PoiDetailView poi={state.poi} wilayaName={wilayaName} />
        )}
      </div>
    </main>
  );
}
