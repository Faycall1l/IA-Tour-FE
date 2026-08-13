"use client";

import { use, useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { ProviderUserRead } from "@/lib/types";
import SectionHeading from "@/components/ui/SectionHeading";
import { LoadingPanel, ErrorPanel } from "@/components/ui/StatePanel";
import ProviderHero from "@/components/providers/ProviderHero";
import ProviderProfileCard from "@/components/providers/ProviderProfileCard";

/**
 * Shared provider detail view. Fetches a single provider by user_id and
 * renders the hero + profile card. Used by /agencies/[id] and /guides/[id].
 */
export default function ProviderDetailView({
  userIdPromise,
  backHref = "/",
  backLabel = "Home",
  eyebrow = "Provider",
}: {
  userIdPromise: Promise<{ id: string }>;
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
}) {
  const { id } = use(userIdPromise);

  const [provider, setProvider] = useState<ProviderUserRead | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/users/providers/{user_id}", {
        params: { path: { user_id: id } },
      })
      .then((res) => {
        if (cancelled) return;
        setProvider(unwrap(res));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, retry]);

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          backHref={backHref}
          backLabel={backLabel}
          eyebrow={eyebrow}
          title={provider?.display_name ?? "Provider"}
        />

        {status === "loading" && <LoadingPanel />}

        {status === "error" && (
          <ErrorPanel
            message="Could not load this provider — is the API running?"
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}

        {status === "ready" && provider && (
          <div className="space-y-6">
            <ProviderHero provider={provider} />
            <ProviderProfileCard provider={provider} />
          </div>
        )}

        {status === "ready" && !provider && (
          <ErrorPanel
            message="This provider was not found."
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}
      </div>
    </main>
  );
}