"use client";

import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { PlaceCard } from "../ui/PlaceCard";
import { PlaceDocument } from "../../types/place";

interface NearbyStripProps {
  currentPlace: PlaceDocument;
  allPlaces: PlaceDocument[];
}

export function NearbyStrip({ currentPlace, allPlaces }: NearbyStripProps) {
  const nearby = allPlaces
    .filter(
      (p) => p.district === currentPlace.district && p._id !== currentPlace._id
    )
    .slice(0, 6);

  if (nearby.length === 0) return null;

  return (
    <section className="mt-12 w-full pt-8 border-t border-border-warm dark:border-[#3a2e24]">
      <h3 className="font-display text-xl mb-4 text-ink dark:text-[#f5ede4]">
        Places Nearby
      </h3>

      <OverlayScrollbarsComponent
        options={{
          scrollbars: { theme: "os-theme-ember", visibility: "auto" },
          overflow: { x: "scroll", y: "hidden" },
        }}
        className="pb-3"
        defer
      >
        <div className="flex gap-4">
          {nearby.map((place) => (
            <div key={place._id} className="w-56 flex-shrink-0">
              <PlaceCard place={place} variant="compact" />
            </div>
          ))}
        </div>
      </OverlayScrollbarsComponent>
    </section>
  );
}
