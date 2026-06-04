"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";
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

  const [emblaRef] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps" });

  if (nearby.length === 0) return null;

  return (
    <section className="mt-12 w-full pt-8 border-t border-border-warm dark:border-[#3a2e24]">
      <h3 className="font-display text-xl mb-4 text-ink dark:text-[#f5ede4]">
        Places Nearby
      </h3>

      <div className="relative">
        <OverlayScrollbarsComponent
          options={{
            scrollbars: { theme: "os-theme-ember", visibility: "auto" },
          }}
          className="pb-3"
          defer
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 min-w-min pl-0">
              {nearby.map((place) => (
                <div key={place._id} className="w-56 flex-shrink-0">
                  <PlaceCard place={place} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </OverlayScrollbarsComponent>
      </div>
    </section>
  );
}
