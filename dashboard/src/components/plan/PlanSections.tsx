"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { client, unwrap } from "@/lib/client";
import type { PoiRead, ProviderUserRead } from "@/lib/types";
import {
  loadSavedSites,
  saveSites,
  type PickedSite,
} from "@/lib/itinerary";
import type { PickedWilaya } from "./AlgeriaWilayaMap";

type Props = {
  picked: PickedWilaya[];
};

type SiteWithWilaya = {
  poi: PoiRead;
  wilaya: PickedWilaya;
};

const PAGE_SIZE = 4;
const POIS_PER_WILAYA = 8;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s']+/g, " ")
    .trim();
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-center text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
      {children}
    </h3>
  );
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed border-champagne bg-champagne/20 px-6 text-center text-xs text-moss">
      {children}
    </div>
  );
}

function Pager({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 0}
        aria-label="Previous"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-sea-foam text-pine transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-30"
      >
        ←
      </button>
      <span className="text-[10px] font-normal text-moss">
        {page + 1} / {pages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages - 1}
        aria-label="Next"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-sea-foam text-pine transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-30"
      >
        →
      </button>
    </div>
  );
}

function SiteCard({
  site,
  selected,
  onToggle,
}: {
  site: SiteWithWilaya;
  selected: boolean;
  onToggle: () => void;
}) {
  const { poi } = site;
  const photo = poi.photo_url ?? poi.photo_urls?.[0];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition ${
        selected
          ? "border-sea-foam ring-2 ring-sea-foam/50"
          : "border-champagne hover:border-sea-foam"
      }`}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={poi.name}
          className="h-36 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-3xl">
          {poi.category.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="p-4">
        <p className="text-sm font-bold text-pine">{poi.name}</p>
        <p className="mt-0.5 text-[10px] font-normal uppercase tracking-wider text-rustic-gold">
          {poi.category}
        </p>
        {poi.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-moss">
            {poi.description}
          </p>
        )}
      </div>
      <div
        className={`flex items-center justify-center border-t px-4 py-1.5 text-[10px] font-normal transition ${
          selected
            ? "border-sea-foam bg-sea-foam/30 text-pine"
            : "border-champagne bg-white text-moss"
        }`}
      >
        {selected ? "✓ Added" : "Click to add"}
      </div>
    </button>
  );
}

function AgencyCard({ provider }: { provider: ProviderUserRead }) {
  const profile = provider.profile;
  const name = provider.display_name ?? profile?.company_name ?? "Local agency";
  const areas = profile?.service_areas ?? [];
  const specializations = profile?.specializations ?? [];
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
      <div className="bg-gradient-to-br from-champagne to-sea-foam/60 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-pine">{name}</p>
          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-normal text-pine capitalize">
            {profile?.provider_type ?? "agency"}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] font-normal uppercase tracking-wider text-rustic-gold">
          {areas[0] ?? "Algeria"}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {provider.bio && (
          <p className="line-clamp-3 text-xs text-moss">{provider.bio}</p>
        )}
        {specializations.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1">
            {specializations.slice(0, 3).map((s) => (
              <li
                key={s}
                className="rounded-full bg-champagne px-2 py-0.5 text-[10px] font-normal text-pine"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        {areas.length > 0 && (
          <p className="mt-3 line-clamp-1 text-[10px] text-moss">
            {areas.join(" · ")}
          </p>
        )}
        <Link
          href={`/agencies/${provider.id}`}
          className="mt-3 inline-block text-[10px] font-normal text-rustic-gold transition hover:text-pine hover:underline"
        >
          View agency →
        </Link>
      </div>
    </div>
  );
}

export default function PlanSections({ picked }: Props) {
  const [sites, setSites] = useState<SiteWithWilaya[]>([]);
  const [sitesStatus, setSitesStatus] = useState<
    "loading" | "error" | "ready"
  >("loading");
  const [providers, setProviders] = useState<ProviderUserRead[]>([]);
  const [sitesPage, setSitesPage] = useState(0);
  const [agenciesPage, setAgenciesPage] = useState(0);
  const [selectedSites, setSelectedSites] = useState<PickedSite[]>([]);

  useEffect(() => {
    setSelectedSites(loadSavedSites());
  }, []);

  useEffect(() => {
    const ids = picked
      .map((p) => p.id)
      .filter((id): id is number => typeof id === "number");
    if (ids.length === 0) {
      setSites([]);
      setSitesStatus("ready");
      return;
    }
    let cancelled = false;
    setSitesStatus("loading");
    Promise.all(
      ids.map((wilaya_id) =>
        client
          .GET("/api/v1/pois", {
            params: {
              query: {
                wilaya_id,
                page: 1,
                page_size: POIS_PER_WILAYA,
              },
            },
          })
          .then((res) => {
            const feed = unwrap(res);
            return { wilaya_id, pois: feed.items ?? [] };
          }),
      ),
    )
      .then((groups) => {
        if (cancelled) return;
        const seen = new Set<string>();
        const merged: SiteWithWilaya[] = [];
        for (const group of groups) {
          const wilaya = picked.find((p) => p.id === group.wilaya_id);
          if (!wilaya) continue;
          for (const poi of group.pois) {
            if (seen.has(poi.id)) continue;
            seen.add(poi.id);
            merged.push({ poi, wilaya });
          }
        }
        setSites(merged);
        setSitesStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setSitesStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [picked]);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/users/providers", { params: { query: { page_size: 100 } } })
      .then((res) => {
        if (!cancelled) setProviders(unwrap(res) ?? []);
      })
      .catch(() => {
        // providers are optional — the section just shows empty state
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleSite(poi: PoiRead, wilaya: PickedWilaya) {
    setSelectedSites((prev) => {
      const exists = prev.some((s) => s.id === poi.id);
      const next = exists
        ? prev.filter((s) => s.id !== poi.id)
        : [
            ...prev,
            {
              id: poi.id,
              name: poi.name,
              category: poi.category,
              wilaya_id: poi.wilaya_id,
              wilaya_name: wilaya.name,
              photo_url: poi.photo_url ?? poi.photo_urls?.[0],
            },
          ];
      saveSites(next);
      return next;
    });
  }

  const sitesView = sites.slice(
    sitesPage * PAGE_SIZE,
    (sitesPage + 1) * PAGE_SIZE,
  );

  const agencyCandidates = providers.filter(
    (p) =>
      p.role === "agency" ||
      p.role === "guide" ||
      p.profile?.provider_type === "agency" ||
      p.profile?.provider_type === "guide",
  );
  const pickedNames = picked.map((p) => normalize(p.name));
  const matchedAgencies =
    picked.length === 0
      ? agencyCandidates
      : agencyCandidates.filter((p) => {
          const areas = (p.profile?.service_areas ?? []).map(normalize);
          return pickedNames.some(
            (pickedName) =>
              areas.some((area) => area.includes(pickedName)) ||
              areas.some((area) => pickedName.includes(area)),
          );
        });
  const agenciesView = matchedAgencies.slice(
    agenciesPage * PAGE_SIZE,
    (agenciesPage + 1) * PAGE_SIZE,
  );

  return (
    <div className="mt-8 space-y-8">
      {/* Sites from the picked wilayas */}
      <section>
        <SectionHeading>Choose sites you wanna visit</SectionHeading>

        {selectedSites.length > 0 && (
          <div className="mb-4 rounded-2xl border border-champagne bg-champagne/20 p-3">
            <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
              Your selected sites ({selectedSites.length})
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {selectedSites.map((site) => (
                <li key={site.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSites((prev) => {
                        const next = prev.filter((s) => s.id !== site.id);
                        saveSites(next);
                        return next;
                      });
                    }}
                    className="rounded-full bg-white px-3 py-1 text-[10px] font-normal text-pine shadow-sm transition hover:bg-sea-foam"
                  >
                    {site.name} ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {picked.length === 0 ? (
          <EmptyPanel>
            No wilaya selected yet — click on the map to see its sites.
          </EmptyPanel>
        ) : sitesStatus === "loading" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-champagne"
              />
            ))}
          </div>
        ) : sitesStatus === "error" ? (
          <EmptyPanel>
            Could not load sites for these wilayas — is the API running?
          </EmptyPanel>
        ) : sites.length === 0 ? (
          <EmptyPanel>
            No site details for these wilayas yet.
          </EmptyPanel>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sitesView.map(({ poi, wilaya }) => (
                <div key={poi.id} className="flex flex-col">
                  <SiteCard
                    site={{ poi, wilaya }}
                    selected={selectedSites.some((s) => s.id === poi.id)}
                    onToggle={() => toggleSite(poi, wilaya)}
                  />
                  <Link
                    href={`/wilayas/${wilaya.id}`}
                    className="mt-2 self-end text-[10px] font-normal text-rustic-gold transition hover:text-pine hover:underline"
                  >
                    Explore {wilaya.name} →
                  </Link>
                </div>
              ))}
            </div>
            {sites.length > PAGE_SIZE && (
              <Pager
                page={sitesPage}
                total={sites.length}
                onChange={(p) => setSitesPage(Math.max(0, p))}
              />
            )}
          </>
        )}
      </section>

      {/* Agencies itineraries */}
      <section>
        <SectionHeading>Agencies itineraries</SectionHeading>
        {matchedAgencies.length === 0 ? (
          <EmptyPanel>
            {picked.length === 0
              ? "Pick a wilaya on the map to see matching agency itineraries."
              : "No agency itineraries match your picks yet."}
          </EmptyPanel>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {agenciesView.map((a) => (
                <AgencyCard key={a.id} provider={a} />
              ))}
            </div>
            {matchedAgencies.length > PAGE_SIZE && (
              <Pager
                page={agenciesPage}
                total={matchedAgencies.length}
                onChange={(p) => setAgenciesPage(Math.max(0, p))}
              />
            )}
          </>
        )}
      </section>

      {/* Customized itinerary */}
      <section>
        <SectionHeading>Customized itinerary</SectionHeading>
        <div className="flex justify-center">
          <Link
            href="/itinerary"
            className="rounded-full bg-sea-foam px-6 py-2.5 text-sm font-normal text-pine shadow-sm transition hover:bg-champagne"
          >
            Explore your customized itinerary →
          </Link>
        </div>
      </section>
    </div>
  );
}
