"use client";

import Link from "next/link";
import { useState } from "react";
import {
  SAMPLE_AGENCIES,
  SAMPLE_WILAYA_SITES,
  type SampleAgency,
  type SampleSite,
} from "@/lib/sample-data";
import type { PickedWilaya } from "./AlgeriaWilayaMap";

type Props = {
  picked: PickedWilaya[];
};

const PAGE_SIZE = 4;

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
  site: SampleSite;
  selected: boolean;
  onToggle: () => void;
}) {
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={site.photo}
        alt={site.name}
        className="h-36 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <p className="text-sm font-bold text-pine">{site.name}</p>
        <p className="mt-0.5 text-[10px] font-normal uppercase tracking-wider text-rustic-gold">
          {site.category}
        </p>
        <p className="mt-1.5 line-clamp-2 text-xs text-moss">
          {site.description}
        </p>
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

function AgencyCard({ agency }: { agency: SampleAgency }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-champagne bg-white shadow-sm">
      <div className="bg-gradient-to-br from-champagne to-sea-foam/60 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-pine">{agency.name}</p>
          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-normal text-pine">
            ★ {agency.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] font-normal uppercase tracking-wider text-rustic-gold">
          {agency.city}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-moss">{agency.description}</p>
        <ul className="mt-3 space-y-2">
          {agency.itineraries.map((it) => (
            <li
              key={it.title}
              className="rounded-xl border border-champagne bg-champagne/20 p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-pine">{it.title}</p>
                <span className="shrink-0 text-[10px] text-moss">
                  {it.days}d · {it.budget}
                </span>
              </div>
              <p className="mt-1 line-clamp-1 text-[10px] text-moss">
                {it.wilayas.join(" → ")}
              </p>
            </li>
          ))}
        </ul>
        <Link
          href={`/agencies/${agency.id}`}
          className="mt-3 inline-block text-[10px] font-normal text-rustic-gold transition hover:text-pine hover:underline"
        >
          View agency →
        </Link>
      </div>
    </div>
  );
}

export default function PlanSections({ picked }: Props) {
  const [sitesPage, setSitesPage] = useState(0);
  const [agenciesPage, setAgenciesPage] = useState(0);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const pickedWithSites = picked.filter(
    (p) => p.id && SAMPLE_WILAYA_SITES[p.id],
  );
  const allSites = pickedWithSites.flatMap((w) =>
    SAMPLE_WILAYA_SITES[w.id as number].map((site) => ({ site, wilaya: w })),
  );
  const sites = allSites.slice(sitesPage * PAGE_SIZE, (sitesPage + 1) * PAGE_SIZE);

  function toggleSite(key: string) {
    setSelectedSites((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key],
    );
  }

  const selectedSiteCards = allSites.filter(({ site, wilaya }) =>
    selectedSites.includes(`${wilaya.key}-${site.name}`),
  );

  const matchedAgencies = SAMPLE_AGENCIES.filter((a) =>
    a.itineraries.some((it) =>
      it.wilayas.some((w) =>
        picked.some(
          (p) =>
            p.name.toLowerCase() === w.toLowerCase() ||
            p.name.toLowerCase().includes(w.toLowerCase()),
        ),
      ),
    ),
  );
  const agencies = matchedAgencies.slice(
    agenciesPage * PAGE_SIZE,
    (agenciesPage + 1) * PAGE_SIZE,
  );

  return (
    <div className="mt-8 space-y-8">
      {/* Sites from the picked wilayas */}
      <section>
        <SectionHeading>Choose sites you wanna visit</SectionHeading>

        {selectedSiteCards.length > 0 && (
          <div className="mb-4 rounded-2xl border border-champagne bg-champagne/20 p-3">
            <p className="text-[10px] font-normal uppercase tracking-widest text-rustic-gold">
              Your selected sites ({selectedSiteCards.length})
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {selectedSiteCards.map(({ site, wilaya }) => (
                <li key={`${wilaya.key}-${site.name}`}>
                  <button
                    type="button"
                    onClick={() => toggleSite(`${wilaya.key}-${site.name}`)}
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
        ) : pickedWithSites.length === 0 ? (
          <EmptyPanel>
            No site details for these wilayas yet — they&apos;ll appear once the
            database is connected.
          </EmptyPanel>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sites.map(({ site, wilaya }) => {
                const key = `${wilaya.key}-${site.name}`;
                return (
                  <div key={key} className="flex flex-col">
                    <SiteCard
                      site={site}
                      selected={selectedSites.includes(key)}
                      onToggle={() => toggleSite(key)}
                    />
                    <Link
                      href={`/wilayas/${wilaya.id}`}
                      className="mt-2 self-end text-[10px] font-normal text-rustic-gold transition hover:text-pine hover:underline"
                    >
                      Explore {wilaya.name} →
                    </Link>
                  </div>
                );
              })}
            </div>
            {allSites.length > PAGE_SIZE && (
              <Pager
                page={sitesPage}
                total={allSites.length}
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
              {agencies.map((a) => (
                <AgencyCard key={a.id} agency={a} />
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
