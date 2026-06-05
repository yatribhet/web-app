"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Navigation2,
  BedDouble,
  ChevronDown,
} from "lucide-react";
import { Hospitality, HospitalityType, PlaceDocument, Route } from "../../types/place";
import { RouteTimeline } from "../ui/RouteTimeline";
import type { RouteMapPoint, HospitalityMapPoint } from "../ui/RouteMap";
import { HospitalityCard } from "../ui/HospitalityCard";
import { StayFilter } from "./WhereToStay";

const RouteMap = dynamic(
  () => import("../ui/RouteMap").then((m) => ({ default: m.RouteMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#d4e8d4] dark:bg-[#1a2e1a] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-ember/30 border-t-ember animate-spin" />
      </div>
    ),
  }
);

const PAGE_SIZE = 12;

const STAY_LABELS: Record<StayFilter, string> = {
  all: "All",
  hotel: "Hotels",
  resort: "Resorts",
  lodge: "Lodges",
  guesthouse: "Guesthouses",
  homestay: "Homestays",
  restaurant: "Restaurants",
  cafe: "Cafés",
};

type Tab = "itinerary" | "stays";

interface Props {
  place: PlaceDocument;
  isOpen: boolean;
  onClose: () => void;
}

export function MapExplorerModal({ place, isOpen, onClose }: Props) {
  // ── Close on Escape ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // ── Tab ───────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("itinerary");

  // ── Map state (lifted here so map never remounts) ─────────────────────
  const [focusPoint, setFocusPoint] = useState<RouteMapPoint | null>(null);
  const [tracedRoute, setTracedRoute] = useState<Route | null>(null);

  const mapCenter = useMemo<[number, number]>(
    () => [place.location.coordinates[1], place.location.coordinates[0]],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleFocus = useCallback((pt: RouteMapPoint | null) => {
    setTracedRoute(null);
    setFocusPoint(pt);
  }, []);
  const handleTrace = useCallback((rt: Route | null) => {
    setFocusPoint(null);
    setTracedRoute(rt);
  }, []);

  const mapLabel =
    tracedRoute?.name
      ? `Route: ${tracedRoute.name}`
      : focusPoint?.label ?? (place.popularName || place.name);

  // ── Hospitality state ─────────────────────────────────────────────────
  const embedded = useMemo(() => place.hospitality ?? [], [place.hospitality]);
  const [items, setItems] = useState<Hospitality[]>(embedded);
  const [stayFilter, setStayFilter] = useState<StayFilter>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(embedded.length >= PAGE_SIZE);
  const [stayLoading, setStayLoading] = useState(false);
  const [activeHospId, setActiveHospId] = useState<string | null>(null);
  const reqId = useRef(0);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

  const stayTabs = useMemo<StayFilter[]>(() => {
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

  const fetchStays = useCallback(
    async (type: StayFilter, nextPage: number, replace: boolean) => {
      const id = ++reqId.current;
      setStayLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: String(PAGE_SIZE),
        });
        if (type !== "all") params.set("hospitalityType", type as HospitalityType);
        const res = await fetch(`/api/hospitality/${place.slug}?${params}`);
        const json = await res.json();
        if (id !== reqId.current) return;
        const data: Hospitality[] = json.data ?? [];
        setItems((prev) => (replace ? data : [...prev, ...data]));
        setPage(nextPage);
        setHasMore(Boolean(json.pagination?.hasNextPage));
      } catch {
        if (id === reqId.current && replace) setItems([]);
      } finally {
        if (id === reqId.current) setStayLoading(false);
      }
    },
    [place.slug]
  );

  const handleStayFilter = useCallback(
    (t: StayFilter) => {
      if (t === stayFilter) return;
      setStayFilter(t);
      setActiveHospId(null);
      fetchStays(t, 1, true);
    },
    [stayFilter, fetchStays]
  );

  const handlePinClick = useCallback((id: string) => {
    setActiveHospId(id);
    setTab("stays");
    cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const hasRoutes = place.routes && place.routes.length > 0;
  const hasStays = items.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[190] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── Modal panel ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-[3%] bottom-[3%] z-[200] md:inset-x-6 lg:inset-x-10 xl:inset-x-16 flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-sand dark:bg-[#13100d] border border-border-warm dark:border-[#3a2e24]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border-warm dark:border-[#3a2e24] bg-white/70 dark:bg-[#1e1912]/70 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2 h-2 rounded-full bg-ember shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <p className="font-display text-base text-ink dark:text-[#f5ede4] truncate leading-tight">
                    {place.popularName || place.name}
                  </p>
                  <p className="text-[10px] text-stone/60 uppercase tracking-widest">
                    {place.district} · {place.state}
                  </p>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-sand dark:bg-[#13100d] border border-border-warm dark:border-[#3a2e24] rounded-full p-0.5">
                <button
                  onClick={() => setTab("itinerary")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    tab === "itinerary"
                      ? "bg-ember text-white shadow-sm"
                      : "text-stone hover:text-ink dark:hover:text-[#f5ede4]"
                  }`}
                >
                  <Navigation2 size={12} />
                  Itinerary
                  {hasRoutes && (
                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full ml-0.5 ${tab === "itinerary" ? "bg-white/25" : "bg-border-warm dark:bg-[#3a2e24]"}`}>
                      {place.routes.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTab("stays")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    tab === "stays"
                      ? "bg-sky text-white shadow-sm"
                      : "text-stone hover:text-ink dark:hover:text-[#f5ede4]"
                  }`}
                >
                  <BedDouble size={12} />
                  Stays
                  {items.length > 0 && (
                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded-full ml-0.5 ${tab === "stays" ? "bg-white/25" : "bg-border-warm dark:bg-[#3a2e24]"}`}>
                      {items.length}{hasMore ? "+" : ""}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={onClose}
                aria-label="Close explorer"
                className="shrink-0 w-8 h-8 rounded-full border border-border-warm dark:border-[#3a2e24] bg-white/80 dark:bg-[#1e1912]/80 flex items-center justify-center text-stone hover:text-ember hover:border-ember/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Body: map + panel ─────────────────────────────────────── */}
            {/*
              Mobile:  two explicit rows — map 40 vh, panel fills the rest.
              Desktop: two columns, single row of 1fr so both cells stretch to
                       the full modal-body height (flex-1). Without grid-rows-[1fr]
                       the implicit row is "auto" and h-full on the map wrapper
                       resolves to 0.
            */}
            <div className="flex-1 grid grid-rows-[40vh_1fr] lg:grid-rows-[1fr] lg:grid-cols-[minmax(0,1fr)_380px] min-h-0 overflow-hidden">

              {/* MAP — always rendered & pinned (never remounts) */}
              <div className="relative min-h-0 h-full">
                <RouteMap
                  center={mapCenter}
                  focusPoint={focusPoint}
                  traceRoute={tracedRoute}
                  hospitalityPoints={tab === "stays" ? hospitalityPoints : []}
                  activeHospitalityId={tab === "stays" ? activeHospId : null}
                  onHospitalityClick={handlePinClick}
                  wrapperClassName="h-full"
                  canvasClassName="w-full h-full"
                />
                {/* Map label overlay */}
                <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
                  <div className="flex items-center gap-1.5 bg-white/90 dark:bg-[#1e1912]/90 backdrop-blur-sm border border-border-warm dark:border-[#3a2e24] text-[11px] text-ink dark:text-[#f5ede4] px-2.5 py-1 rounded-full shadow-sm">
                    <MapPin size={11} className="text-ember shrink-0" />
                    <span className="truncate max-w-[180px]">{mapLabel}</span>
                  </div>
                </div>
              </div>

              {/* PANEL — scrollable, tabs drive content */}
              <div className="flex flex-col min-h-0 border-t border-border-warm dark:border-[#3a2e24] lg:border-t-0 lg:border-l bg-white dark:bg-[#1e1912]">

                {/* Mobile tab bar */}
                <div className="sm:hidden shrink-0 flex border-b border-border-warm dark:border-[#3a2e24]">
                  <button
                    onClick={() => setTab("itinerary")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors ${
                      tab === "itinerary"
                        ? "border-ember text-ember"
                        : "border-transparent text-stone"
                    }`}
                  >
                    <Navigation2 size={13} /> Itinerary
                  </button>
                  <button
                    onClick={() => setTab("stays")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors ${
                      tab === "stays"
                        ? "border-sky text-sky"
                        : "border-transparent text-stone"
                    }`}
                  >
                    <BedDouble size={13} /> Stays
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <AnimatePresence mode="wait">
                    {tab === "itinerary" ? (
                      <motion.div
                        key="itinerary"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                        className="p-5"
                      >
                        {hasRoutes ? (
                          <>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-display text-base text-ink dark:text-[#f5ede4]">
                                {place.routes.length > 1 ? "Travel Routes" : "Route Itinerary"}
                              </h3>
                              <span className="text-[10px] text-stone/50 uppercase tracking-wider">
                                {place.routes.length} {place.routes.length === 1 ? "route" : "routes"}
                              </span>
                            </div>
                            <RouteTimeline
                              routes={place.routes}
                              onFocusPoint={handleFocus}
                              onTraceRoute={handleTrace}
                              activeTracedRoute={tracedRoute}
                              activeFocusPoint={focusPoint}
                            />
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                            <Navigation2 size={32} className="text-stone/25 stroke-[1.5]" />
                            <p className="text-sm text-stone/60">No route itinerary mapped for this place yet.</p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="stays"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className="p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-display text-base text-ink dark:text-[#f5ede4]">
                            Where to Stay &amp; Eat
                          </h3>
                          <span className="text-[10px] text-stone/50 uppercase tracking-wider">
                            {items.length}{hasMore ? "+" : ""} listed
                          </span>
                        </div>

                        {/* Type filter pills */}
                        {stayTabs.length > 1 && (
                          <div className="flex gap-1.5 flex-wrap mb-4">
                            {stayTabs.map((t) => (
                              <button
                                key={t}
                                onClick={() => handleStayFilter(t)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                                  stayFilter === t
                                    ? "bg-sky text-white border-sky shadow-sm"
                                    : "border-border-warm dark:border-[#3a2e24] text-stone hover:text-sky hover:border-sky/40"
                                }`}
                              >
                                {STAY_LABELS[t]}
                              </button>
                            ))}
                          </div>
                        )}

                        {!hasStays && !stayLoading ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                            <BedDouble size={32} className="text-stone/25 stroke-[1.5]" />
                            <p className="text-sm text-stone/60">No stays listed for this area yet.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {items.map((item) => (
                              <div key={item._id} ref={(el) => {
                                if (el) cardRefs.current.set(item._id, el);
                                else cardRefs.current.delete(item._id);
                              }}>
                                <HospitalityCard
                                  item={item}
                                  active={activeHospId === item._id}
                                  onMouseEnter={() => setActiveHospId(item._id)}
                                  onMouseLeave={() => setActiveHospId(null)}
                                />
                              </div>
                            ))}

                            {(hasMore || stayLoading) && (
                              <button
                                onClick={() => fetchStays(stayFilter, page + 1, false)}
                                disabled={stayLoading}
                                className="mt-1 flex items-center justify-center gap-2 text-xs font-medium text-stone hover:text-ember border border-border-warm dark:border-[#3a2e24] hover:border-ember/40 py-2.5 rounded-lg transition-all disabled:opacity-60 focus-visible:outline-none"
                              >
                                {stayLoading ? (
                                  <span className="animate-pulse">Loading…</span>
                                ) : (
                                  <><ChevronDown size={14} /> Show more</>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
