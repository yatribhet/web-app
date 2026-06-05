"use client";

import { useState } from "react";
import { Navigation, Bookmark, Share2, Map, Compass } from "lucide-react";
import dynamic from "next/dynamic";
import { Toast } from "../ui/Toast";
import { PlaceDocument, Route } from "../../types/place";
import { OpeningHours } from "./OpeningHours";
import { RatingBars } from "../ui/RatingBars";
import { RouteTimeline } from "../ui/RouteTimeline";
import { Button } from "../ui/Button";
import { useFavourites } from "../../hooks/useFavourites";
import { MapExplorerModal } from "./MapExplorerModal";
import type { RouteMapPoint } from "../ui/RouteMap";

const RouteMap = dynamic(
  () => import("../ui/RouteMap").then((m) => ({ default: m.RouteMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 rounded-xl bg-sand dark:bg-[#13100d] flex items-center justify-center">
        <span className="text-stone/40 text-xs uppercase tracking-widest animate-pulse">Loading map…</span>
      </div>
    ),
  }
);

// ── Module-level sub-components ──────────────────────────────────────────────
// Defined OUTSIDE the render body so React never sees new identities on re-render.
// This is the fix for the "map resets on every click" bug: nested function
// components inside a render body get new identities each call, causing unmount.

interface ActionsCardProps {
  place: PlaceDocument;
  saved: boolean;
  onDirections: () => void;
  onToggleFav: () => void;
  onShare: () => void;
  onOpenExplorer: () => void;
}

function ActionsCard({
  place, saved, onDirections, onToggleFav, onShare, onOpenExplorer,
}: ActionsCardProps) {
  return (
    <div className="border border-border-warm dark:border-[#3a2e24] shadow-sm rounded-xl bg-white dark:bg-[#1e1912] p-4 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-ember/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

      <div className="bg-terracotta/90 dark:bg-[#26201a] border border-[#f5c89a] dark:border-[#5a3820] rounded-lg px-4 py-2.5 text-sm mb-1 font-medium text-[#8b4a1a] dark:text-[#d4936a] text-center shadow-sm">
        {place.structuredData.entryFee.amount && place.structuredData.entryFee.amount > 0
          ? `NPR ${place.structuredData.entryFee.amount} · Entry Fee`
          : "Free Entry"}
      </div>

      <Button onClick={onDirections} fullWidth className="gap-2 shadow-md">
        <Navigation size={18} />
        Get Directions
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={onToggleFav} className="gap-2 bg-sand/50 dark:bg-black/20">
          <Bookmark size={16} className={saved ? "fill-current" : ""} />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button variant="outline" onClick={onShare} className="gap-2 bg-sand/50 dark:bg-black/20">
          <Share2 size={16} />
          Share
        </Button>
      </div>

      {/* Open Explorer CTA */}
      <button
        onClick={onOpenExplorer}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-ember text-white hover:bg-dusk transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50 mt-1"
      >
        <div className="flex items-center gap-2">
          <Compass size={16} />
          <span className="text-sm font-medium">Explore Map &amp; Stays</span>
        </div>
        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full tracking-wide uppercase">Full View</span>
      </button>
    </div>
  );
}

interface MapCardProps {
  place: PlaceDocument;
  focusPoint: RouteMapPoint | null;
  tracedRoute: Route | null;
  mapLabel: string;
  onFocusPoint: (pt: RouteMapPoint | null) => void;
  onTraceRoute: (rt: Route | null) => void;
  onClear: () => void;
}

function MapCard({
  place, focusPoint, tracedRoute, mapLabel,
  onFocusPoint, onTraceRoute, onClear,
}: MapCardProps) {
  const center: [number, number] = [
    place.location.coordinates[1],
    place.location.coordinates[0],
  ];

  return (
    <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] shadow-sm overflow-hidden">
      {/* Map header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-warm/60 dark:border-[#3a2e24]/60">
        <div className="flex items-center gap-2 min-w-0">
          <Map size={14} className="text-ember shrink-0" />
          <span className="text-xs font-semibold text-ink dark:text-[#f5ede4] truncate">{mapLabel}</span>
        </div>
        {(focusPoint || tracedRoute) && (
          <button
            onClick={onClear}
            className="text-[10px] text-stone/60 hover:text-ember transition-colors shrink-0 ml-2"
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Compact map — fixed height, never moves */}
      <RouteMap
        center={center}
        focusPoint={focusPoint}
        traceRoute={tracedRoute}
        canvasClassName="w-full h-48 bg-sand dark:bg-[#13100d]"
      />

      {/* Route timeline — bounded height with inner scroll so map stays put */}
      {place.routes.length > 0 && (
        <div className="border-t border-border-warm/60 dark:border-[#3a2e24]/60">
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <h4 className="font-display text-sm text-ink dark:text-[#f5ede4]">
              {place.routes.length > 1 ? "Travel Routes" : "Route Itinerary"}
            </h4>
            <span className="text-[10px] text-stone/50 uppercase tracking-wider">
              {place.routes.length} {place.routes.length === 1 ? "route" : "routes"}
            </span>
          </div>
          {/* max-h caps the list; the map above never scrolls out of view */}
          <div className="max-h-64 overflow-y-auto overscroll-contain px-4 pb-4 pt-1 [scrollbar-width:thin] [scrollbar-color:#e8d5c4_transparent]">
            <RouteTimeline
              routes={place.routes}
              onFocusPoint={onFocusPoint}
              onTraceRoute={onTraceRoute}
              activeTracedRoute={tracedRoute}
              activeFocusPoint={focusPoint}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface OtherDetailsProps {
  place: PlaceDocument;
}

function OtherDetailsCards({ place }: OtherDetailsProps) {
  return (
    <>
      {place.structuredData.openingHours.length > 0 && (
        <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-4 shadow-sm">
          <h4 className="font-display text-base mb-2 text-ink dark:text-[#f5ede4]">Opening Hours</h4>
          <OpeningHours hours={place.structuredData.openingHours} />
        </div>
      )}
      <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-4 shadow-sm">
        <h4 className="font-display text-base mb-3 text-ink dark:text-[#f5ede4]">Reviews</h4>
        <RatingBars aggregateRating={place.structuredData.aggregateRating} />
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface SidebarActionsProps {
  place: PlaceDocument;
  variant?: "desktop" | "mobileActions" | "mobileDetails";
}

export function SidebarActions({ place, variant = "desktop" }: SidebarActionsProps) {
  const [toastMsg, setToastMsg] = useState("");
  const [focusPoint, setFocusPoint] = useState<RouteMapPoint | null>(null);
  const [tracedRoute, setTracedRoute] = useState<Route | null>(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const saved = isFavourite(place._id);

  const mapLabel = tracedRoute
    ? `Route: ${tracedRoute.name}`
    : focusPoint
    ? focusPoint.label
    : "Location";

  const handleDirections = () => {
    const [lng, lat] = place.location.coordinates;
    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = place.seo.metaTitle || place.popularName || place.name;
    if (navigator.share) {
      try { await navigator.share({ title, url }); }
      catch (err) { console.error("Share error", err); }
    } else {
      navigator.clipboard.writeText(url);
      setToastMsg("Link copied to clipboard!");
    }
  };

  const handleFocusPoint = (pt: RouteMapPoint | null) => {
    setTracedRoute(null);
    setFocusPoint(pt);
  };
  const handleTraceRoute = (rt: Route | null) => {
    setFocusPoint(null);
    setTracedRoute(rt);
  };
  const handleClear = () => {
    setFocusPoint(null);
    setTracedRoute(null);
  };

  // Mobile actions-only strip (below title, above description)
  if (variant === "mobileActions") {
    return (
      <>
        <div className="lg:hidden w-full my-6">
          <ActionsCard
            place={place}
            saved={saved}
            onDirections={handleDirections}
            onToggleFav={() => toggleFavourite(place._id)}
            onShare={handleShare}
            onOpenExplorer={() => setExplorerOpen(true)}
          />
        </div>
        <MapExplorerModal
          place={place}
          isOpen={explorerOpen}
          onClose={() => setExplorerOpen(false)}
        />
        <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg("")} />
      </>
    );
  }

  // Mobile full details (map + opening hours + reviews)
  if (variant === "mobileDetails") {
    return (
      <div className="lg:hidden w-full mt-10 space-y-4">
        <h3 className="font-display text-xl mb-2 text-ink dark:text-[#f5ede4]">Details &amp; Guides</h3>
        <MapCard
          place={place}
          focusPoint={focusPoint}
          tracedRoute={tracedRoute}
          mapLabel={mapLabel}
          onFocusPoint={handleFocusPoint}
          onTraceRoute={handleTraceRoute}
          onClear={handleClear}
        />
        <OtherDetailsCards place={place} />
      </div>
    );
  }

  // Desktop sticky sidebar
  return (
    <>
      <div className="sticky top-24 space-y-4 hidden lg:block w-full min-w-0 overflow-hidden">
        <ActionsCard
          place={place}
          saved={saved}
          onDirections={handleDirections}
          onToggleFav={() => toggleFavourite(place._id)}
          onShare={handleShare}
          onOpenExplorer={() => setExplorerOpen(true)}
        />
        <MapCard
          place={place}
          focusPoint={focusPoint}
          tracedRoute={tracedRoute}
          mapLabel={mapLabel}
          onFocusPoint={handleFocusPoint}
          onTraceRoute={handleTraceRoute}
          onClear={handleClear}
        />
        <OtherDetailsCards place={place} />
      </div>
      <MapExplorerModal
        place={place}
        isOpen={explorerOpen}
        onClose={() => setExplorerOpen(false)}
      />
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg("")} />
    </>
  );
}
