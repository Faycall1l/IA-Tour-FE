"use client";

import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { WilayaSummary } from "@/lib/types";

const selectClass =
  "rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine focus:border-rustic-gold focus:outline-none";

/**
 * Wilaya dropdown fed by GET /discover/wilayas. Shared by every filter bar.
 */
export default function WilayaSelect({
  value,
  onChange,
  allLabel = "All wilayas",
  className,
}: {
  value: number | undefined;
  onChange: (id: number | undefined) => void;
  allLabel?: string;
  className?: string;
}) {
  const [wilayas, setWilayas] = useState<WilayaSummary[]>([]);

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

  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value ? Number(e.target.value) : undefined)
      }
      aria-label="Filter by wilaya"
      className={`${selectClass} ${className ?? ""}`}
    >
      <option value="">{allLabel}</option>
      {wilayas.map((w) => (
        <option key={w.id} value={w.id}>
          {w.id} — {w.name}
        </option>
      ))}
    </select>
  );
}
