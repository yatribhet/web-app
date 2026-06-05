"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaceCard } from "../ui/PlaceCard";
import { PlaceDocument } from "../../types/place";

interface NearbyStripProps {
  currentPlace: PlaceDocument;
  allPlaces: PlaceDocument[];
}

const SCROLL_STEP = 340;

export function NearbyStrip({ currentPlace, allPlaces }: NearbyStripProps) {
  const nearby = allPlaces
    .filter(
      (p) => p.district === currentPlace.district && p._id !== currentPlace._id
    )
    .slice(0, 10);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const sync = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [nearby.length]);

  // Translate vertical mouse-wheel → horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const maxLeft = el.scrollWidth - el.clientWidth;
      if (maxLeft <= 0) return; // not scrollable, let page handle it
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= maxLeft && e.deltaY > 0;
      if (atStart || atEnd) return; // let page handle boundary
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? SCROLL_STEP : -SCROLL_STEP,
      behavior: "smooth",
    });
  };

  if (nearby.length === 0) return null;

  return (
    <section className="mt-12 w-full pt-8 border-t border-border-warm dark:border-[#3a2e24]">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-xl text-ink dark:text-[#f5ede4]">
            Places Nearby
          </h3>
          <p className="text-xs text-stone mt-0.5">
            More to explore in {currentPlace.district}
          </p>
        </div>

        {/* Prev / Next arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            aria-label="Scroll left"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
              canLeft
                ? "border-border-warm dark:border-[#3a2e24] bg-white dark:bg-[#1e1912] text-stone hover:text-ember hover:border-ember/50 shadow-sm"
                : "border-border-warm/30 dark:border-[#3a2e24]/30 bg-white/40 dark:bg-[#1e1912]/40 text-stone/25 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            aria-label="Scroll right"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
              canRight
                ? "border-border-warm dark:border-[#3a2e24] bg-white dark:bg-[#1e1912] text-stone hover:text-ember hover:border-ember/50 shadow-sm"
                : "border-border-warm/30 dark:border-[#3a2e24]/30 bg-white/40 dark:bg-[#1e1912]/40 text-stone/25 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Carousel with edge fades */}
      <div className="relative">
        {/* Left fade — shows more content exists behind */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-sand dark:from-[#13100d] to-transparent transition-opacity duration-300 ${
            canLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Right fade — teases content ahead */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-sand dark:from-[#13100d] to-transparent transition-opacity duration-300 ${
            canRight ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {nearby.map((place) => (
            <div key={place._id} className="w-44 flex-shrink-0">
              <PlaceCard place={place} variant="strip" />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint — visible only when there are hidden cards */}
      {canRight && (
        <p className="mt-2.5 flex items-center gap-1 text-[10px] text-stone/50 italic select-none">
          <ChevronRight size={10} className="text-ember/50" />
          Scroll or use arrows to see more places
        </p>
      )}
    </section>
  );
}
