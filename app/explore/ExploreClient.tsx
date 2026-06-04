"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { PlaceCard } from "@/src/components/ui/PlaceCard";
import { PlaceDocument } from "@/src/types/place";

/** Mirror Tailwind responsive grid breakpoints */
function colsFromWidth(px: number): number {
  if (px >= 1280) return 4; // xl:grid-cols-4
  if (px >= 1024) return 3; // lg:grid-cols-3
  if (px >= 640)  return 2; // sm:grid-cols-2
  return 1;
}

// PlaceCard large = h-56 image + ~168px body + 20px gap row spacing
const ESTIMATED_ROW_HEIGHT = 440;

export default function ExploreClient({
  initialPlaces,
  searchParams,
}: {
  initialPlaces: PlaceDocument[];
  searchParams: any;
}) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [search, setSearch] = useState(
    typeof searchParams?.q === "string" ? searchParams.q : ""
  );
  const [types, setTypes] = useState<string[]>(
    typeof searchParams?.type === "string" ? [searchParams.type] : []
  );
  const [districts, setDistricts] = useState<string[]>([]);
  const [sort, setSort] = useState<"Rating" | "Name" | "Distance">("Rating");

  // ── Filter & sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = initialPlaces.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (types.length > 0 && !types.includes(p.placeType)) return false;
      if (districts.length > 0 && !districts.includes(p.district))
        return false;
      return true;
    });

    if (sort === "Rating")
      list = [...list].sort((a, b) => b.famousRating - a.famousRating);
    else if (sort === "Name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Distance")
      list = [...list].sort(
        (a, b) =>
          (a.routes?.[0]?.estimatedDistance ?? 9999) -
          (b.routes?.[0]?.estimatedDistance ?? 9999)
      );

    return list;
  }, [initialPlaces, search, types, districts, sort]);

  const allTypes = useMemo(
    () => Array.from(new Set(initialPlaces.map((p) => p.placeType))),
    [initialPlaces]
  );
  const allDistricts = useMemo(
    () => Array.from(new Set(initialPlaces.map((p) => p.district))),
    [initialPlaces]
  );

  const toggleType = (t: string) =>
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  const toggleDistrict = (d: string) =>
    setDistricts((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  const clearFilters = () => {
    setSearch("");
    setTypes([]);
    setDistricts([]);
    setSort("Rating");
  };

  // ── Virtualization ────────────────────────────────────────────────────────
  // scrollRef  → the scrollable viewport (inner content div)
  // gridRef    → measured to determine column count via ResizeObserver
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const [colCount, setColCount] = useState(2); // safe SSR default

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setColCount(colsFromWidth(entry.contentRect.width));
    });
    ro.observe(el);
    // Measure immediately after mount
    setColCount(colsFromWidth(el.offsetWidth));
    return () => ro.disconnect();
  }, []);

  // Group flat filtered list → rows of colCount cards each
  const rows = useMemo(() => {
    const out: PlaceDocument[][] = [];
    for (let i = 0; i < filtered.length; i += colCount) {
      out.push(filtered.slice(i, i + colCount));
    }
    return out;
  }, [filtered, colCount]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 3, // render 3 rows above + below visible area
  });

  // ── Sidebar content (shared by desktop aside + mobile drawer) ─────────────
  const SidebarContent = () => (
    <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-full">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-stone w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#1e1912] border border-border-warm dark:border-[#3a2e24] rounded-md pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus:ring-1 focus:ring-ember placeholder:text-stone text-ink dark:text-[#f5ede4]"
        />
      </div>

      {/* Place type */}
      <div>
        <h4 className="font-medium text-sm mb-3">Place Type</h4>
        <div className="flex flex-wrap gap-2">
          {allTypes.map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`px-3 py-1.5 rounded text-xs border ${
                types.includes(t)
                  ? "bg-terracotta dark:bg-[#26201a] border-[#f5c89a] text-[#8b4a1a] dark:text-[#d4936a]"
                  : "border-border-warm dark:border-[#3a2e24] hover:border-ember text-stone"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* District */}
      <div>
        <h4 className="font-medium text-sm mb-3">District</h4>
        <div className="flex flex-wrap gap-2">
          {allDistricts.map((d) => (
            <button
              key={d}
              onClick={() => toggleDistrict(d)}
              className={`px-3 py-1.5 rounded text-xs border ${
                districts.includes(d)
                  ? "bg-terracotta dark:bg-[#26201a] border-[#f5c89a] text-[#8b4a1a] dark:text-[#d4936a]"
                  : "border-border-warm dark:border-[#3a2e24] hover:border-ember text-stone"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-medium text-sm mb-3">Sort By</h4>
        <div className="flex text-xs border border-border-warm dark:border-[#3a2e24] rounded-md overflow-hidden">
          {(["Rating", "Name", "Distance"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`flex-1 py-2 ${
                sort === opt
                  ? "bg-ember text-white"
                  : "bg-white dark:bg-[#1e1912] hover:bg-stone/5"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="mt-auto pt-8 flex flex-col gap-2">
        <button
          onClick={clearFilters}
          className="text-ember text-sm hover:underline text-left font-medium mb-4 focus-visible:outline-none"
        >
          Reset filters
        </button>
        <div className="text-xs text-stone/60 flex flex-wrap gap-x-3 gap-y-1">
          <a href="/privacy" className="hover:text-stone transition-colors">
            Privacy
          </a>
          <a href="/contact" className="hover:text-stone transition-colors">
            Contact
          </a>
        </div>
        <div className="text-xs text-stone/50 mt-1">
          &copy; {new Date().getFullYear()} Yatribhet
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto w-full relative">
      {/* ── Desktop sidebar (fixed) ────────────────────────────────────────── */}
      <aside className="hidden lg:block w-64 fixed left-auto top-14 h-[calc(100vh-56px)] border-r border-border-warm dark:border-[#3a2e24] overflow-y-auto bg-sand dark:bg-[#13100d]">
        <SidebarContent />
      </aside>

      {/* ── Main scrollable area ───────────────────────────────────────────── */}
      {/*
        Height = viewport minus the 56px fixed navbar.
        overflow-y-auto makes this the scroll container that TanStack Virtual
        reads — only the rows inside the visible window are mounted in the DOM.
      */}
      <div
        ref={scrollRef}
        className="lg:ml-64 overflow-y-auto"
        style={{ height: "calc(100vh - 3.5rem)" }}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Heading + result count */}
          <h1 className="font-display text-2xl lg:text-3xl mb-6">
            Exploring Nepal
            <span className="text-stone font-body text-base font-normal ml-3">
              {filtered.length}{" "}
              {filtered.length === 1 ? "result" : "results"}
            </span>
          </h1>

          {/* ── Empty state ──────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-16 h-16 text-ember/40 stroke-[1.5] mb-4" />
              <h2 className="font-display text-xl mb-2">No places found</h2>
              <p className="text-stone text-sm mb-4">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={clearFilters}
                className="bg-ember text-white px-6 py-2 rounded text-sm hover:bg-dusk transition-colors focus-visible:outline-none"
              >
                Clear filters
              </button>
            </div>
          ) : (
            /* ── Virtualised grid ──────────────────────────────────────── */
            <div ref={gridRef}>
              {/*
                Outer div has the TOTAL height of all (virtual) rows so the
                scrollbar thumb accurately reflects how much content exists.
                Inner items are absolutely positioned and translated into view.
              */}
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualizer.getVirtualItems().map((vRow) => (
                  <div
                    key={vRow.key}
                    data-index={vRow.index}
                    ref={virtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      transform: `translateY(${vRow.start}px)`,
                    }}
                  >
                    {/* Each virtual row is a full-width CSS grid slice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-5">
                      {rows[vRow.index].map((place) => (
                        <PlaceCard
                          key={place._id}
                          place={place}
                          variant="large"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 w-full h-[80vh] bg-sand dark:bg-[#13100d] z-50 rounded-t-xl overflow-hidden shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="w-12 h-1.5 bg-border-warm dark:bg-[#3a2e24] rounded-full mx-auto mt-3 mb-2" />
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile filter FAB ──────────────────────────────────────────────── */}
      <button
        onClick={() => setIsMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-ember text-white rounded-full flex items-center justify-center shadow-lg z-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ember/40 hover:bg-dusk transition-colors"
        aria-label="Filter options"
      >
        <SlidersHorizontal size={24} />
        {(types.length > 0 || districts.length > 0 || search) && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-ink dark:bg-[#f5ede4] text-white dark:text-ink text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow">
            {types.length + districts.length + (search ? 1 : 0)}
          </span>
        )}
      </button>
    </div>
  );
}
