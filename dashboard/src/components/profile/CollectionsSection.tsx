"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client, unwrap } from "@/lib/client";
import type { CollectionBrief } from "@/lib/types";
import { LoadingPanel, ErrorPanel, EmptyPanel } from "@/components/ui/StatePanel";

/**
 * Profile collections: lists the authenticated user's named collections
 * (wishlists/trip boards), newest first, with item counts. Each row links
 * to a future collection detail (placeholder for now).
 */
export default function CollectionsSection() {
  const [collections, setCollections] = useState<CollectionBrief[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/collections")
      .then((res) => {
        if (cancelled) return;
        setCollections(unwrap(res).items ?? []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [retry]);

  return (
    <section className="rounded-2xl border border-champagne bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-pine">Collections</h2>

      <div className="mt-4">
        {status === "loading" && <LoadingPanel />}
        {status === "error" && (
          <ErrorPanel
            message="Could not load collections."
            onRetry={() => setRetry((n) => n + 1)}
          />
        )}
        {status === "ready" && collections.length === 0 && (
          <EmptyPanel title="No collections yet — group your favorite places." />
        )}
        {status === "ready" && collections.length > 0 && (
          <ul className="divide-y divide-champagne/60">
            {collections.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-pine">
                    {c.name}
                    {c.is_public && (
                      <span className="ml-2 rounded-full bg-sea-foam/60 px-2 py-0.5 text-[10px] font-semibold text-pine">
                        Public
                      </span>
                    )}
                  </p>
                  {c.description && (
                    <p className="truncate text-xs text-moss">{c.description}</p>
                  )}
                  <p className="text-xs text-moss">
                    {c.item_count} item{c.item_count === 1 ? "" : "s"} ·{" "}
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="shrink-0 rounded-full bg-champagne/40 px-3 py-1 text-xs font-medium text-pine transition hover:bg-champagne"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}