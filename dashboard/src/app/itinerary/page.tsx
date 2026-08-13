"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import AgentChat from "@/components/AgentChat";
import StayNode from "@/components/itinerary/StayNode";
import TransportEdge from "@/components/itinerary/TransportEdge";
import SiteNode from "@/components/itinerary/SiteNode";
import StaySwitchCard from "@/components/itinerary/StaySwitchCard";
import type {
  EdgeDef,
  RouteResponse,
  RouteStatus,
} from "@/components/itinerary/types";
import { client, unwrap } from "@/lib/client";
import type { ProviderUserRead, StayRead, WilayaSummary } from "@/lib/types";
import {
  clearChosenStay,
  clearSites,
  loadAlternateStays,
  loadChosenStay,
  loadItineraryDates,
  loadSavedSites,
  saveAlternateStays,
  saveSites,
  setDestinationDate,
  type AlternateStays,
  type ItineraryDates,
  type PickedSite,
  type PickedStay,
} from "@/lib/itinerary";
import { MOCK_STAYS } from "@/lib/mock-data";
import {
  MOCK_CHOSEN_TRANSPORTS,
  MOCK_ITINERARY_DATES,
  MOCK_PICKED_SITES,
  MOCK_PICKED_STAY,
} from "@/lib/mock-itinerary";

const CHOSEN_TRANSPORT_KEY = "athar:chosen-transport";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s']+/g, " ")
    .trim();
}

function loadChosenTransports(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CHOSEN_TRANSPORT_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveChosenTransports(map: Record<string, string>) {
  try {
    window.localStorage.setItem(CHOSEN_TRANSPORT_KEY, JSON.stringify(map));
  } catch {
    // storage unavailable — choice still works in-memory
  }
}

type ItinerarySegment = {
  base: PickedStay;
  sites: PickedSite[];
};

type RenderStop = {
  base: PickedStay;
  sites: PickedSite[];
  transfer?: {
    from: PickedStay;
    edge: EdgeDef;
  };
};

function pickStayFromRead(s: StayRead): PickedStay {
  return {
    id: s.id,
    name: s.name,
    property_type: s.property_type,
    wilaya_id: s.wilaya_id,
    address: s.address,
    latitude: s.latitude,
    longitude: s.longitude,
    price_per_night_dzd: s.price_per_night_dzd,
    photos: s.photos,
  };
}

/** A leg is "too far" when it needs a flight — that's when we switch stays. */
function needsFlight(route: RouteStatus | undefined): boolean {
  if (!route || route.status !== "ready" || !route.route) return false;
  const r = route.route;
  return (
    (r.driving_distance_km ?? 0) > 400 ||
    (r.options ?? []).some((o) => o.mode === "flight")
  );
}

/** First mock stay near a wilaya, used as the default switch target. */
function defaultNearbyStay(wilayaId: number): PickedStay | null {
  const s = MOCK_STAYS.find((st) => st.wilaya_id === wilayaId);
  return s ? pickStayFromRead(s) : null;
}

export default function ItineraryPage() {
  const [sites, setSites] = useState<PickedSite[]>([]);
  const [stay, setStay] = useState<PickedStay | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [wilayaMap, setWilayaMap] = useState<Map<number, WilayaSummary>>(
    new Map(),
  );
  const [guides, setGuides] = useState<ProviderUserRead[]>([]);
  const [routes, setRoutes] = useState<Record<string, RouteStatus>>({});
  const [chosenTransports, setChosenTransports] = useState<Record<string, string>>(
    () => loadChosenTransports(),
  );
  const [dates, setDates] = useState<ItineraryDates>(() =>
    loadItineraryDates(),
  );
  const [alternateStays, setAlternateStays] = useState<AlternateStays>(() =>
    loadAlternateStays(),
  );

  const inflight = useRef(new Set<string>());

  // True when the shown trip is filled in with sample data (partial or empty
  // user selection) rather than the user's own complete picks.
  const [preview, setPreview] = useState(false);

  // Always render a complete trip. A full saved selection (sites + stay) is
  // used as-is; otherwise the gaps are filled with mock data so a realistic
  // hub-and-spoke path (stay → site → back) is visible immediately.
  useEffect(() => {
    const savedSites = loadSavedSites();
    const savedStay = loadChosenStay();
    const complete = savedSites.length > 0 && savedStay != null;

    setSites(savedSites.length > 0 ? savedSites : MOCK_PICKED_SITES);
    setStay(savedStay ?? MOCK_PICKED_STAY);
    setDates(complete ? loadItineraryDates() : MOCK_ITINERARY_DATES);
    setChosenTransports(
      complete ? loadChosenTransports() : MOCK_CHOSEN_TRANSPORTS,
    );
    setPreview(!complete);
    setLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/discover/wilayas")
      .then((res) => {
        if (cancelled) return;
        const list = unwrap(res);
        const arr = Array.isArray(list) ? list : [];
        setWilayaMap(new Map(arr.map((w) => [w.id, w])));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    client
      .GET("/api/v1/users/providers", {
        params: { query: { role: "guide", page_size: 50 } },
      })
      .then((res) => {
        if (!cancelled) {
          const list = unwrap(res);
          setGuides(Array.isArray(list) ? list : []);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const stayWilayaName = stay
    ? wilayaMap.get(stay.wilaya_id)?.name ?? undefined
    : undefined;

  // Cluster sites into segments around base stays. Sites reached by flight
  // from their base start a new segment whose stay is near the destination —
  // you don't fly back to the same hotel every night.
  const segments = useMemo<ItinerarySegment[]>(() => {
    if (!stay || sites.length === 0) return [];
    const segs: ItinerarySegment[] = [];
    let base: PickedStay = stay;
    let group: PickedSite[] = [];
    for (const site of sites) {
      if (needsFlight(routes[`${base.id}->${site.id}`])) {
        if (group.length > 0) segs.push({ base, sites: group });
        base =
          alternateStays[site.wilaya_id] ??
          defaultNearbyStay(site.wilaya_id) ??
          base;
        group = [];
      }
      group.push(site);
    }
    if (group.length > 0) segs.push({ base, sites: group });
    return segs;
  }, [sites, stay, routes, alternateStays]);

  // Ordered render plan: each stop is a base stay with its day trips, and a
  // long-haul transfer (flight) into it when its stay differs from the one
  // before it (e.g. fly Algiers → Tamanrasset, then stay there).
  const plan = useMemo<RenderStop[]>(() => {
    const stops: RenderStop[] = [];
    let prevBase: PickedStay | null = stay;
    for (const seg of segments) {
      const transfer =
        prevBase && seg.base.id !== prevBase.id
          ? {
              from: prevBase,
              edge: {
                key: `${prevBase.id}->${seg.base.id}`,
                from_wilaya_id: prevBase.wilaya_id,
                to_wilaya_id: seg.base.wilaya_id,
                from_name: prevBase.name,
                to_name: seg.base.name,
              } satisfies EdgeDef,
            }
          : undefined;
      stops.push({ base: seg.base, sites: seg.sites, transfer });
      prevBase = seg.base;
    }
    return stops;
  }, [segments, stay]);

  // Every leg of the trip: the transfer into a base, then each site as a round
  // trip from that base.
  const dayEdges = useMemo<EdgeDef[]>(() => {
    const list: EdgeDef[] = [];
    for (const stop of plan) {
      if (stop.transfer) list.push(stop.transfer.edge);
      for (const site of stop.sites) {
        list.push(
          {
            key: `${stop.base.id}->${site.id}`,
            from_wilaya_id: stop.base.wilaya_id,
            to_wilaya_id: site.wilaya_id,
            from_name: stop.base.name,
            to_name: site.name,
          },
          {
            key: `${site.id}->${stop.base.id}`,
            from_wilaya_id: site.wilaya_id,
            to_wilaya_id: stop.base.wilaya_id,
            from_name: site.name,
            to_name: stop.base.name,
          },
        );
      }
    }
    return list;
  }, [plan]);

  // Fetch transport options for every leg of the trip.
  useEffect(() => {
    for (const edge of dayEdges) {
      if (inflight.current.has(edge.key)) continue;
      inflight.current.add(edge.key);
      setRoutes((prev) => ({ ...prev, [edge.key]: { status: "loading" } }));
      client
        .GET("/api/v1/transport/routes/{origin_wilaya_id}/{dest_wilaya_id}", {
          params: {
            path: {
              origin_wilaya_id: edge.from_wilaya_id,
              dest_wilaya_id: edge.to_wilaya_id,
            },
          },
        })
        .then((res) => {
          const route = unwrap(res) as unknown as RouteResponse;
          setRoutes((prev) => ({
            ...prev,
            [edge.key]: { status: "ready", route },
          }));
        })
        .catch(() => {
          setRoutes((prev) => ({
            ...prev,
            [edge.key]: { status: "error" },
          }));
        });
    }
  }, [dayEdges]);

  const guidesByWilaya = useMemo(() => {
    const map = new Map<number, ProviderUserRead[]>();
    if (guides.length === 0) return map;
    const targets = new Map<number, string>();
    for (const site of sites) {
      if (!targets.has(site.wilaya_id)) {
        targets.set(site.wilaya_id, site.wilaya_name);
      }
    }
    for (const [wilayaId, name] of targets) {
      const t = normalize(name);
      const matches = guides.filter((g) =>
        (g.profile?.service_areas ?? []).some((area) => {
          const a = normalize(area);
          return a.includes(t) || t.includes(a);
        }),
      );
      if (matches.length > 0) map.set(wilayaId, matches);
    }
    return map;
  }, [guides, sites]);

  function clearAll() {
    clearSites();
    clearChosenStay();
    setSites([]);
    setStay(null);
    setAlternateStays({});
    saveAlternateStays({});
  }

  function removeStay() {
    clearChosenStay();
    setStay(null);
  }

  function removeSite(siteId: string) {
    const next = sites.filter((s) => s.id !== siteId);
    setSites(next);
    saveSites(next);
  }

  function moveSite(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= sites.length) return;
    const next = [...sites];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setSites(next);
    saveSites(next);
  }

  function chooseTransport(key: string, mode: string) {
    setChosenTransports((prev) => {
      const next = { ...prev, [key]: mode };
      saveChosenTransports(next);
      return next;
    });
  }

  function setDate(key: string, iso: string | null) {
    setDates((prev) => setDestinationDate(prev, key, iso));
  }

  function chooseAlternateStay(wilayaId: number, s: PickedStay) {
    setAlternateStays((prev) => {
      const next = { ...prev, [String(wilayaId)]: s };
      saveAlternateStays(next);
      return next;
    });
  }

  const empty = loaded && sites.length === 0 && !stay;

  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/plan"
          className="mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline"
        >
          ← Plan
        </Link>

        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-pine">
            My itinerary
          </h1>
          <p className="mt-1 text-sm text-moss">
            {!loaded
              ? "Loading your picks…"
              : empty
                ? "Pick sites on the plan page and they'll appear here as your travel path."
                : preview
                  ? "This is a sample trip to show how your path looks — pick real sites and a stay to replace it."
                  : `${sites.length} site${sites.length === 1 ? "" : "s"}${stay ? ` · sleeping at ${stay.name}` : ""}.`}
          </p>
        </header>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/plan"
            className="rounded-full bg-sea-foam px-4 py-1.5 text-xs font-normal text-pine shadow-sm transition hover:bg-champagne"
          >
            Optimize my itinerary
          </Link>
          <Link
            href="/stays"
            className="rounded-full border border-champagne bg-white px-4 py-1.5 text-xs font-normal text-moss transition hover:border-sea-foam hover:text-pine"
          >
            Choose my stay
          </Link>
          {(sites.length > 0 || stay) && (
            <button
              onClick={clearAll}
              className="rounded-full border border-amber-200 bg-white px-4 py-1.5 text-xs font-normal text-amber-700 transition hover:bg-amber-50"
            >
              Clear selection
            </button>
          )}
        </div>

        {empty && (
          <div className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-10 text-center">
            <p className="text-sm text-moss">
              Your trip, mapped as a path: a stay to sleep in, the exact sites
              you want to visit, and the transport between them. Head to the
              plan page, pick the wilayas you want to visit and add the sites
              you don&apos;t want to miss.
            </p>
            <Link
              href="/plan"
              className="mt-4 inline-block rounded-full bg-rustic-gold px-6 py-2.5 text-sm font-normal text-white shadow-sm transition hover:bg-pine"
            >
              Start planning →
            </Link>
          </div>
        )}

        {loaded && (sites.length > 0 || stay) && (
          <div className="mx-auto max-w-3xl">
            {stay && (
              <StayNode
                stay={stay}
                wilayaName={stayWilayaName}
                onRemove={removeStay}
              />
            )}

            {plan.map((stop, si) => {
              let dayOffset = 0;
              for (let k = 0; k < si; k++) dayOffset += plan[k].sites.length;
              const toRegion =
                wilayaMap.get(stop.base.wilaya_id)?.name ??
                `Wilaya ${stop.base.wilaya_id}`;

              return (
                <Fragment key={stop.base.id}>
                  {stop.transfer && (() => {
                    const transfer = stop.transfer!;
                    const fromRegion =
                      wilayaMap.get(transfer.from.wilaya_id)?.name ??
                      `Wilaya ${transfer.from.wilaya_id}`;
                    return (
                      <Fragment key={`transfer-${transfer.edge.key}`}>
                        <TransportEdge
                          fromName={fromRegion}
                          toName={toRegion}
                          heading={`Fly from ${fromRegion} to ${toRegion}`}
                          data={
                            routes[transfer.edge.key] ?? { status: "loading" }
                          }
                          chosen={chosenTransports[transfer.edge.key] ?? null}
                          onChoose={(mode) =>
                            chooseTransport(transfer.edge.key, mode)
                          }
                        />
                        <StaySwitchCard
                          fromName={transfer.from.name}
                          fromWilayaName={fromRegion}
                          wilayaName={toRegion}
                          candidates={MOCK_STAYS.filter(
                            (s) => s.wilaya_id === stop.base.wilaya_id,
                          ).map(pickStayFromRead)}
                          chosen={stop.base}
                          onChoose={(s) =>
                            chooseAlternateStay(stop.base.wilaya_id, s)
                          }
                        />
                      </Fragment>
                    );
                  })()}

                  {stop.sites.map((site, i) => {
                    const day = dayOffset + i + 1;
                    const outKey = `${stop.base.id}->${site.id}`;
                    const backKey = `${site.id}->${stop.base.id}`;
                    return (
                      <Fragment key={site.id}>
                        <TransportEdge
                          fromName={stop.base.name}
                          toName={site.name}
                          heading={`Day ${day} · from ${stop.base.name} to ${site.name}`}
                          data={routes[outKey] ?? { status: "loading" }}
                          chosen={chosenTransports[outKey] ?? null}
                          onChoose={(mode) => chooseTransport(outKey, mode)}
                        />
                        <SiteNode
                          index={dayOffset + i}
                          total={sites.length}
                          site={site}
                          guides={guidesByWilaya.get(site.wilaya_id) ?? []}
                          date={dates[site.id] ?? null}
                          onSetDate={(iso) => setDate(site.id, iso)}
                          onRemoveSite={removeSite}
                          onMove={(dir) =>
                            moveSite(dayOffset + i, dayOffset + i + dir)
                          }
                        />
                        <TransportEdge
                          fromName={site.name}
                          toName={stop.base.name}
                          heading={`Back to ${stop.base.name}`}
                          data={routes[backKey] ?? { status: "loading" }}
                          chosen={chosenTransports[backKey] ?? null}
                          onChoose={(mode) => chooseTransport(backKey, mode)}
                        />
                      </Fragment>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        )}

        {/* Real agent refinement */}
        <section id="refine" className="mt-12">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-pine">
              Refine with the ATHAR agent
            </h2>
            <p className="text-sm text-moss">
              Ask for day-by-day order, transport between stops or what to pack.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-2xl border border-champagne bg-white p-4 shadow-sm">
            <AgentChat />
          </div>
        </section>
      </div>
    </main>
  );
}
