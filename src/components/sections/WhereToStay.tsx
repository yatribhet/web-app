"use client";

import { BedDouble, Loader2 } from "lucide-react";
import { Hospitality, HospitalityType } from "../../types/place";
import { HospitalityCard } from "../ui/HospitalityCard";

export type StayFilter = HospitalityType | "all";

interface WhereToStayProps {
  items: Hospitality[];
  tabs: StayFilter[];
  activeType: StayFilter;
  onTypeChange: (t: StayFilter) => void;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  activeId: string | null;
  onCardHover: (id: string | null) => void;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

const TAB_LABEL: Record<StayFilter, string> = {
  all: "All",
  hotel: "Hotels",
  resort: "Resorts",
  lodge: "Lodges",
  guesthouse: "Guesthouses",
  homestay: "Homestays",
  restaurant: "Restaurants",
  cafe: "Cafés",
};

export function WhereToStay({
  items,
  tabs,
  activeType,
  onTypeChange,
  loading,
  hasMore,
  onLoadMore,
  activeId,
  onCardHover,
  registerRef,
}: WhereToStayProps) {
  return (
    <section className="mt-10 pt-8 border-t border-border-warm dark:border-[#3a2e24]">
      <div className="flex items-end justify-between gap-3 mb-1">
        <h3 className="font-display text-xl text-ink dark:text-[#f5ede4] flex items-center gap-2">
          <BedDouble size={18} className="text-sky" />
          Where to Stay &amp; Eat
        </h3>
      </div>
      <p className="text-xs text-stone mb-4">
        Hotels, lodges and places to eat around this destination.
      </p>

      {/* Type filter */}
      {tabs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => onTypeChange(t)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                activeType === t
                  ? "bg-ember text-white border-ember shadow-sm"
                  : "border-border-warm dark:border-[#3a2e24] text-stone hover:text-ember hover:border-ember/40"
              }`}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>
      )}

      {/* Grid / states */}
      {items.length === 0 && !loading ? (
        <p className="text-xs text-stone/60 italic py-6">
          No stays or dining options listed for this area yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item._id} ref={(el) => registerRef?.(item._id, el)}>
                <HospitalityCard
                  item={item}
                  active={activeId === item._id}
                  onMouseEnter={() => onCardHover(item._id)}
                  onMouseLeave={() => onCardHover(null)}
                />
              </div>
            ))}
          </div>

          {/* Load more */}
          {(hasMore || loading) && (
            <div className="flex justify-center mt-6">
              <button
                onClick={onLoadMore}
                disabled={loading}
                className="flex items-center gap-2 text-sm font-medium text-ember border border-ember/30 hover:border-ember/60 hover:bg-ember/5 px-5 py-2 rounded-full transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Loading…
                  </>
                ) : (
                  "Show more"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
