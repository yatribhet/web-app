"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, BedDouble, UtensilsCrossed } from "lucide-react";
import { Hospitality } from "../../types/place";
import { FALLBACK_IMAGE } from "../../lib/constants";

interface HospitalityCardProps {
  item: Hospitality;
  active?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const FOOD_TYPES = new Set(["restaurant", "cafe"]);

const PRICE_LABEL: Record<string, string> = {
  budget: "$",
  "mid-range": "$$",
  luxury: "$$$",
};

export function HospitalityCard({
  item,
  active = false,
  onMouseEnter,
  onMouseLeave,
}: HospitalityCardProps) {
  const isFood = FOOD_TYPES.has(item.hospitalityType);
  const TypeIcon = isFood ? UtensilsCrossed : BedDouble;
  const accent = isFood ? "text-sage" : "text-sky";

  const inner = (
    <>
      {/* Image */}
      <div className="h-32 relative bg-[#13100d] overflow-hidden">
        {item.displayImage && (
          <img
            src={item.displayImage}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
            }}
          />
        )}
        <div className={`${item.displayImage ? "hidden" : ""} absolute inset-0 bg-[#13100d]`}>
          <img src={FALLBACK_IMAGE} alt="" className="w-full h-full object-cover opacity-40" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Type badge */}
        <span className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 dark:bg-[#1e1912]/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded">
          <TypeIcon size={11} className={accent} />
          <span className="text-ink dark:text-[#f5ede4] capitalize">{item.hospitalityType}</span>
        </span>

        {/* Rating */}
        {item.rating > 0 && (
          <span className="absolute bottom-2 right-2 bg-black/55 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
            ★ {Number(item.rating).toFixed(1)}
          </span>
        )}

        {/* Chain logo */}
        {item.chain?.logo && (
          <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-[#1e1912]/90 border border-white/60 overflow-hidden flex items-center justify-center shadow-sm">
            <img src={item.chain.logo} alt={item.chain.name ?? ""} className="w-full h-full object-contain" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4
            title={item.name}
            className="text-[13px] font-semibold text-ink dark:text-[#f5ede4] truncate"
          >
            {item.name}
          </h4>
          {item.priceRange && (
            <span
              title={item.priceRange}
              className={`shrink-0 text-[11px] font-bold ${accent}`}
            >
              {PRICE_LABEL[item.priceRange] ?? ""}
            </span>
          )}
        </div>

        <p className="mt-1 text-[11px] text-stone/80 flex items-start gap-1 leading-snug">
          <MapPin size={11} className="text-stone/50 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{item.address}</span>
        </p>

        {item.phone && (
          <p className="mt-1 text-[11px] text-stone/70 flex items-center gap-1">
            <Phone size={11} className="text-stone/50 shrink-0" />
            <span className="truncate">{item.phone}</span>
          </p>
        )}
      </div>
    </>
  );

  const baseClass = `group block rounded-lg overflow-hidden border bg-white dark:bg-[#1e1912] transition-all duration-200 ${
    active
      ? "border-ember/60 ring-1 ring-ember/40 shadow-md"
      : "border-border-warm dark:border-[#3a2e24] hover:border-ember/40 hover:shadow-md"
  }`;

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
      {item.website ? (
        <a
          href={item.website}
          target="_blank"
          rel="noreferrer"
          className={`${baseClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {inner}
        </a>
      ) : (
        <div
          className={baseClass}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {inner}
        </div>
      )}
    </motion.div>
  );
}
