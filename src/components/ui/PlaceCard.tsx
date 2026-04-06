"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Mountain } from "lucide-react";
import { PlaceDocument } from "../../types/place";
import { useFavourites } from "../../hooks/useFavourites";
import { FALLBACK_IMAGE } from "../../lib/constants";

interface PlaceCardProps {
  place: PlaceDocument;
  variant: "large" | "compact";
}

export function PlaceCard({ place, variant }: PlaceCardProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const fav = isFavourite(place._id);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation
    toggleFavourite(place._id);
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/${place.slug}`}
        className="flex flex-row h-20 border border-border-warm dark:border-[#3a2e24] rounded-md overflow-hidden bg-white dark:bg-[#1e1912] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2"
      >
        <div className="w-24 h-full relative bg-[#13100d] flex-shrink-0 border-r border-border-warm dark:border-[#3a2e24]">
          {place.displayImage && (
            <img
              src={place.displayImage}
              alt={place.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
              }}
            />
          )}
          
          {/* Fallback Placeholder (Hidden if image loads, Default if no image) */}
          <div className={`${place.displayImage ? 'hidden' : ''} absolute inset-0 w-full h-full bg-[#13100d]`}>
            <img src={FALLBACK_IMAGE} alt="Yatribhet Placeholder" className="w-full h-full object-cover opacity-40" />
          </div>
        </div>
        <div className="flex-1 p-2 flex flex-col justify-center">
          <h3 className="text-sm font-medium text-ink dark:text-[#f5ede4] line-clamp-1">
            {place.name}
          </h3>
          <p className="text-xs text-stone mb-1">{place.district}</p>
          <div className="mt-auto flex">
            {place.routes?.[0]?.estimatedDistance ? (
              <span className="text-[10px] bg-terracotta dark:bg-[#26201a] text-[#8b4a1a] dark:text-[#d4936a] rounded px-1.5 py-0.5">
                {place.routes[0].estimatedDistance}km
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  // Large Variant
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="relative rounded-md overflow-hidden border border-border-warm dark:border-[#3a2e24] bg-white dark:bg-[#1e1912] cursor-pointer"
    >
      <Link href={`/${place.slug}`} className="block focus-visible:outline-none">
        {/* IMAGE AREA */}
        <div className="h-56 relative bg-[#13100d] overflow-hidden border-b border-border-warm dark:border-[#3a2e24]">
          {place.displayImage && (
            <img
              src={place.displayImage}
              alt={place.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
              }}
            />
          )}

          {/* Fallback Placeholder */}
          <div className={`${place.displayImage ? 'hidden' : ''} absolute inset-0 w-full h-full bg-[#1e1912]`}>
            <img src={FALLBACK_IMAGE} alt="Yatribhet Placeholder" className="w-full h-full object-cover opacity-40" />
          </div>

          {/* Dark gradient overlay for text readability of top badges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-ember text-white rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider shadow-sm">
              {place.placeType}
            </span>
          </div>

          <motion.button
            onClick={handleFav}
            whileTap={{ scale: 1.4 }}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 focus-visible:outline-none"
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          >
            <motion.div animate={{ color: fav ? "#ea7022" : "#ffffff" }}>
              <Heart
                size={16}
                className={fav ? "fill-ember stroke-ember transition-colors" : "fill-transparent stroke-white"}
              />
            </motion.div>
          </motion.button>

          <div className="absolute bottom-2 right-2 z-10 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            ★ {place.famousRating}
          </div>
        </div>

        {/* BODY */}
        <div className="p-4">
          <div className="text-[10px] uppercase tracking-wider text-ember mb-1 flex items-center gap-1.5">
            <span>{place.placeType}</span>
            <span className="w-1 h-1 rounded-full bg-stone" />
            <span className="text-stone">{place.district}</span>
          </div>

          <h3 className="font-display text-lg text-ink dark:text-[#f5ede4] mb-1 line-clamp-1">
            {place.name}
          </h3>

          <p className="font-body font-light text-stone text-xs line-clamp-2 mb-3">
            {place.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {place.tags.slice(0, 3).map((tag) => (
              <span
                key={tag._id}
                className="bg-terracotta dark:bg-[#26201a] text-[#8b4a1a] dark:text-[#d4936a] text-[10px] px-2 py-0.5 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
