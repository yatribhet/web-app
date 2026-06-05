"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, Map as MapIcon } from "lucide-react";
import { PlaceDocument, Route, Hospitality } from "../../types/place";
import { RouteTimeline } from "../ui/RouteTimeline";
import type { RouteMapPoint, HospitalityMapPoint } from "../ui/RouteMap";
import { WhereToStay, StayFilter } from "./WhereToStay";

// Leaflet must never run on the server.
const RouteMap = dynamic(
  () => import("../ui/RouteMap").then((m) => ({ default: m.RouteMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 sm:h-80 lg:h-[68vh] bg-sand dark:bg-[#13100d] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-ember/30 border-t-ember animate-spin" />
        <span className="text-stone/40 text-[10px] uppercase tracking-widest">Loading map…</span>
      </div>
    ),
  }
);

const PAGE_SIZE = 12;

export function PlaceExplorer({ place }: { place: PlaceDocument }) {
  // ── Map / itinerary state ─────────────────────────────────────────────
  const [focusPoint, setFocusPoint] = useState<RouteMapPoint | null>(null);
  const [tracedRoute, setTracedRoute] = useState<Route | null>(null);

  const hasRoutes = place.routes && place.routes.length > 0;

  const mapCenter = useMemo<[number, number]>(
    () => [place.location.coordinates[1], place.location.coordinates[0]],
    [place.location.coordinates]
  );

  const mapLabel = tracedRoute
    ? `Route: ${tracedRoute.name}`
    : focusPoint
    ? focusPoint.label
    : place.popularName || place.name;

  const handleFocusPoint = useCallback((pt: RouteMapPoint | null) => {
    setTracedRoute(null);
    setFocusPoint(pt);
  }, []);
  const handleTraceRoute = useCallback((rt: Route | null) => {
    setFocusPoint(null);
    setTracedRoute(rt);
  }, []);

  // ── Hospitality state ─────────────────────────────────────────────────
  const embedded = place.hospitality ?? [];
  const [items, setItems] = useState<Hospitality[]>(embedded);
  const [activeType, setActiveType] = useState<StayFilter>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(embedded.length >= PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [activeHospId, setActiveHospId] = useState<string | null>(null);
  const reqId = useRef(0);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Filter tabs derived once from the embedded batch (stable, no empty tabs).
  const tabs = useMemo<StayFilter[]>(() => {
    const present = Array.from(new Set(embedded.map((h) => h.hospitalityType)));
    return present.length > 0 ? ["all", ...present] : [];
  }, [embedded]);

  const hospitalityPoints = useMemo<HospitalityMapPoint[]>(
    () =>
      items
        .filter((h) => h.location?.coordinates)
        .map((h) => ({
          id: h._id,
          lat: h.location!.coordinates[1],
          lng: h.location!.coordinates[0],
          label: h.name,
          type: h.hospitalityType,
        })),
    [items]
  );

  const fetchPage = useCallback(
    async (type: StayFilter, nextPage: number, replace: boolean) => {
      const id = ++reqId.current;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(PAGE_SIZE),
        });
        if (type !== "all") params.set("hospitalityType", type);
        const res = await fetch(`/api/hospitality/${place.slug}?${params}`);
        const json = await res.json();
        if (id !== reqId.current) return; // a newer request superseded this one
        const data: Hospitality[] = json.data ?? [];
        setItems((prev) => (replace ? data : [...prev, ...data]));
        setPage(nextPage);
        setHasMore(Boolean(json.pagination?.hasNextPage));
      } catch {
        if (id === reqId.current && replace) setItems([]);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    },
    [place.slug]
  );

  const handleTypeChange = useCallback(
    (t: StayFilter) => {
      if (t === activeType) return;
      setActiveType(t);
      setActiveHospId(null);
      fetchPage(t, 1, true);
    },
    [activeType, fetchPage]
  );

  const handleLoadMore = useCallback(
    () => fetchPage(activeType, page + 1, false),
    [activeType, page, fetchPage]
  );

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  const handlePinClick = useCallback((id: string) => {
    setActiveHospId(id);
    cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const mapsHref = `https://maps.google.com/?q=${place.location.coordinates[1]},${place.location.coordinates[0]}`;

  return (
    <section className="mt-10 pt-8 border-t border-border-warm dark:border-[#3a2e24]">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-display text-xl text-ink dark:text-[#f5ede4] flex items-center gap-2">
          <MapIcon size={18} className="text-ember" />
          Map &amp; Itinerary
        </h3>
        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-ember hover:text-dusk flex items-center gap-1 transition-colors"
        >
          Open in Maps <ExternalLink size={12} />
        </a>
      </div>

      {/* Two-pane: pinned map + scrolling itinerary (stacks on mobile) */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
        {/* MAP — sticky so it stays visible while interacting with steps */}
        <div className="sticky top-14 lg:top-20 self-start z-[5]">
          <div className="rounded-xl border border-border-warm dark:border-[#3a2e24] shadow-sm overflow-hidden bg-white dark:bg-[#1e1912]">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-warm/60 dark:border-[#3a2e24]/60">
              <span className="w-2 h-2 rounded-full bg-ember shrink-0" />
              <span className="text-xs font-semibold text-ink dark:text-[#f5ede4] truncate">
                {mapLabel}
              </span>
            </div>
            <RouteMap
              center={mapCenter}
              focusPoint={focusPoint}
              traceRoute={tracedRoute}
              hospitalityPoints={hospitalityPoints}
              activeHospitalityId={activeHospId}
              onHospitalityClick={handlePinClick}
              canvasClassName="w-full h-64 sm:h-80 lg:h-[68vh] bg-sand dark:bg-[#13100d]"
            />
          </div>
        </div>

        {/* ITINERARY — own bounded scroll on desktop, natural flow on mobile */}
        {hasRoutes ? (
          <div className="relative lg:max-h-[calc(68vh+44px)] lg:overflow-y-auto lg:pr-1 rounded-xl border border-border-warm dark:border-[#3a2e24] bg-white dark:bg-[#1e1912] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-sm text-ink dark:text-[#f5ede4]">
                {place.routes.length > 1 ? "Travel Routes" : "Route Itinerary"}
              </h4>
              <span className="text-[10px] text-stone/50 uppercase tracking-wider">
                {place.routes.length} {place.routes.length === 1 ? "route" : "routes"}
              </span>
            </div>
            <RouteTimeline
              routes={place.routes}
              onFocusPoint={handleFocusPoint}
              onTraceRoute={handleTraceRoute}
              activeTracedRoute={tracedRoute}
              activeFocusPoint={focusPoint}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border-warm dark:border-[#3a2e24] bg-white/50 dark:bg-[#1e1912]/50 p-5 flex items-center">
            <p className="text-xs text-stone/60 italic">
              No route itinerary mapped for this place yet.
            </p>
          </div>
        )}
      </div>

      {/* Where to stay & eat */}
      <WhereToStay
        items={items}
        tabs={tabs}
        activeType={activeType}
        onTypeChange={handleTypeChange}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        activeId={activeHospId}
        onCardHover={setActiveHospId}
        registerRef={registerRef}
      />
    </section>
  );
}
