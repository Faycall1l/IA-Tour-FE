"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { StayRead } from "@/lib/types";
import StayCard from "@/components/cards/StayCard";

/**
 * Similar stays in the same wilaya, excluding the current stay. Loads up to
 * 4 siblings; stays silent (no section) when there are none to show.
 */
export default function SimilarStays({
  stay,
  wilayaName,
}: {
  stay: StayRead;
  wilayaName?: string;
}) {
  const [stays, setStays] = useState<StayRead[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    client
      .GET("/api/v1/stays", {
        params: {
          query: { wilaya_id: stay.wilaya_id, page_size: 5 },
        },
      })
      .then((res) => {
        if (cancelled) return;
        const feed = unwrap(res);
        setStays((feed.items ?? []).filter((s) => s.id !== stay.id).slice(0, 4));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [stay.id, stay.wilaya_id]);

  if (status !== "ready" || stays.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-pine">
        More places to stay in wilaya {stay.wilaya_id}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stays.map((s) => (
          <StayCard key={s.id} stay={s} wilayaName={wilayaName} />
        ))}
      </div>
    </section>
  );
}
