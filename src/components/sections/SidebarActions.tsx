"use client";

import { useState } from "react";
import { Navigation, Bookmark, Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Toast } from "../ui/Toast";
import { PlaceDocument, Route } from "../../types/place";
import { OpeningHours } from "./OpeningHours";
import { RatingBars } from "../ui/RatingBars";
import { RouteTimeline } from "../ui/RouteTimeline";
import { Button } from "../ui/Button";
import { useFavourites } from "../../hooks/useFavourites";
import type { RouteMapPoint } from "../ui/RouteMap";

// Use Next.js dynamic with ssr:false so Leaflet never runs on the server
const RouteMap = dynamic(
  () => import("../ui/RouteMap").then((m) => ({ default: m.RouteMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-52 md:h-64 rounded-xl bg-sand dark:bg-[#13100d] flex items-center justify-center">
        <span className="text-stone/40 text-xs uppercase tracking-widest animate-pulse">Loading map…</span>
      </div>
    ),
  }
);

interface SidebarActionsProps {
  place: PlaceDocument;
  variant?: "desktop" | "mobileActions" | "mobileDetails";
}

export function SidebarActions({ place, variant = "desktop" }: SidebarActionsProps) {
  const [toastMsg, setToastMsg] = useState("");
  const [focusPoint, setFocusPoint] = useState<RouteMapPoint | null>(null);
  const [tracedRoute, setTracedRoute] = useState<Route | null>(null);
  const { isFavourite, toggleFavourite } = useFavourites();
  const saved = isFavourite(place._id);

  const mapCenter: [number, number] = [
    place.location.coordinates[1],
    place.location.coordinates[0],
  ];

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

  // ── Action buttons card ───────────────────────────────────────────────
  const ActionBox = () => (
    <div className="border border-border-warm dark:border-[#3a2e24] shadow-sm rounded-xl bg-white dark:bg-[#1e1912] p-4 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-ember/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

      <div className="bg-terracotta/90 dark:bg-[#26201a] border border-[#f5c89a] dark:border-[#5a3820] rounded-lg px-4 py-2.5 text-sm mb-1 font-medium text-[#8b4a1a] dark:text-[#d4936a] text-center shadow-sm">
        {place.structuredData.entryFee.amount && place.structuredData.entryFee.amount > 0
          ? `NPR ${place.structuredData.entryFee.amount} · Entry Fee`
          : "Free Entry"}
      </div>

      <Button onClick={handleDirections} fullWidth className="gap-2 shadow-md">
        <Navigation size={18} />
        Get Directions
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => toggleFavourite(place._id)}
          className="gap-2 bg-sand/50 dark:bg-black/20"
        >
          <Bookmark size={16} className={saved ? "fill-current" : ""} />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button variant="outline" onClick={handleShare} className="gap-2 bg-sand/50 dark:bg-black/20">
          <Share2 size={16} />
          Share
        </Button>
      </div>
    </div>
  );

  // ── Map + Route card (always mounted together so Leaflet is ready) ────
  const MapAndRouteCard = () => (
    <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-5 shadow-sm space-y-5">
      {/* Map header */}
      <h4 className="font-display text-lg text-ink dark:text-[#f5ede4]">
        {tracedRoute
          ? `Route: ${tracedRoute.name}`
          : focusPoint
          ? focusPoint.label
          : "Location"}
      </h4>

      {/* THE MAP — always rendered, Leaflet updates imperatively via props */}
      <RouteMap
        center={mapCenter}
        focusPoint={focusPoint}
        traceRoute={tracedRoute}
      />

      {(focusPoint || tracedRoute) && (
        <button
          onClick={() => { setFocusPoint(null); setTracedRoute(null); }}
          className="text-[11px] text-stone/60 hover:text-ember transition-colors"
        >
          ✕ Clear selection — return to overview
        </button>
      )}

      {/* Route timeline — inside the same card so layout is coherent */}
      {place.routes.length > 0 && (
        <>
          <div className="border-t border-border-warm/60 dark:border-[#3a2e24]/60 pt-4">
            <h4 className="font-display text-base mb-3 text-ink dark:text-[#f5ede4]">
              {place.routes.length > 1 ? "Travel Routes" : "Route Itinerary"}
            </h4>
            <RouteTimeline
              routes={place.routes}
              onFocusPoint={(pt) => {
                setTracedRoute(null);
                setFocusPoint(pt);
              }}
              onTraceRoute={(rt) => {
                setFocusPoint(null);
                setTracedRoute(rt);
              }}
              activeTracedRoute={tracedRoute}
              activeFocusPoint={focusPoint}
            />
          </div>
        </>
      )}
    </div>
  );

  // ── Other detail cards ─────────────────────────────────────────────────
  const OtherDetails = () => (
    <>
      {place.structuredData.openingHours.length > 0 && (
        <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-5 shadow-sm">
          <h4 className="font-display text-lg mb-2 text-ink dark:text-[#f5ede4]">Opening Hours</h4>
          <OpeningHours hours={place.structuredData.openingHours} />
        </div>
      )}
      <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-5 shadow-sm">
        <h4 className="font-display text-lg mb-3 text-ink dark:text-[#f5ede4]">Reviews</h4>
        <RatingBars aggregateRating={place.structuredData.aggregateRating} />
      </div>
    </>
  );

  // ── Render variants ────────────────────────────────────────────────────
  if (variant === "mobileActions") {
    return (
      <>
        <div className="lg:hidden w-full my-6">
          <ActionBox />
        </div>
        <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg("")} />
      </>
    );
  }

  if (variant === "mobileDetails") {
    return (
      <div className="lg:hidden w-full mt-10 space-y-4">
        <h3 className="font-display text-xl mb-2 text-ink dark:text-[#f5ede4]">Details & Guides</h3>
        <MapAndRouteCard />
        <OtherDetails />
      </div>
    );
  }

  // Desktop — sticky sidebar
  return (
    <>
      <div className="sticky top-24 space-y-4 hidden lg:block w-full min-w-0 overflow-hidden">
        <ActionBox />
        <MapAndRouteCard />
        <OtherDetails />
      </div>
      <Toast message={toastMsg} isVisible={!!toastMsg} onClose={() => setToastMsg("")} />
    </>
  );
}
