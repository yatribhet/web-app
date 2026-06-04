"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PlaceDocument } from "../../types/place";
import { FALLBACK_IMAGE } from "../../lib/constants";

interface FeaturedCarouselProps {
  places: PlaceDocument[];
}

function FeaturedCard({ place }: { place: PlaceDocument }) {
  return (
    <Link
      href={`/${place.slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[3/4] md:aspect-[16/10] bg-[#13100d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
    >
      {/* Background image with zoom on hover */}
      {place.displayImage && (
        <img
          src={place.displayImage}
          alt={place.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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

      {/* Gradient overlays — bottom heavy for text, subtle top for badge */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-ember/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top badge: place type pill */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] uppercase tracking-widest font-medium px-3 py-1.5 rounded-full">
          {place.placeType}
        </span>
      </div>

      {/* Content block — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-6 transition-transform duration-500 group-hover:-translate-y-1">
        {/* Location line */}
        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{place.district}, {place.state}</span>
        </div>

        {/* Title */}
        <h3 className="font-display italic text-white text-xl md:text-2xl lg:text-3xl leading-tight mb-3 drop-shadow-md line-clamp-2">
          {place.popularName || place.name}
        </h3>

        {/* Rating + CTA row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
            <span className="text-white font-medium text-sm">{place.famousRating.toFixed(1)}</span>
            <span className="text-white/50 text-xs">/ 5</span>
          </div>

          {/* CTA — animated arrow appears on hover */}
          <span className="flex items-center gap-1 text-ember text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            Explore
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCarousel({ places }: FeaturedCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", containScroll: "trimSnaps", dragFree: false },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!places || places.length === 0) return null;

  return (
    <section
      className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-label="Featured Destinations"
    >
      {/* Section header */}
      <div className="flex justify-between items-end mb-7">
        <div>
          <p className="text-ember text-xs uppercase tracking-widest font-medium mb-1.5">
            Top picks
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-ink dark:text-[#f5ede4]">
            Featured Destinations
          </h2>
          <p className="text-stone text-sm mt-1 max-w-xs">
            Handpicked by our local experts for an unforgettable journey.
          </p>
        </div>

        {/* Desktop prev/next arrows — top right */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            onClick={scrollPrev}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="w-10 h-10 rounded-full border border-border-warm dark:border-[#3a2e24] bg-sand dark:bg-[#1e1912] text-ink dark:text-[#f5ede4] flex items-center justify-center hover:border-ember hover:text-ember transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </motion.button>
          <motion.button
            onClick={scrollNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="w-10 h-10 rounded-full border border-border-warm dark:border-[#3a2e24] bg-sand dark:bg-[#1e1912] text-ink dark:text-[#f5ede4] flex items-center justify-center hover:border-ember hover:text-ember transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>

      {/* Carousel viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex -ml-4">
          {places.map((place) => (
            <div
              key={place._id}
              className="pl-4 min-w-[88%] sm:min-w-[65%] md:min-w-[46%] lg:min-w-[33.333%] flex-shrink-0"
            >
              <FeaturedCard place={place} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: dot indicators + mobile arrows */}
      <div className="flex items-center justify-between mt-5">
        {/* Mobile arrows */}
        <div className="flex md:hidden items-center gap-2">
          <motion.button
            onClick={scrollPrev}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full border border-border-warm dark:border-[#3a2e24] bg-sand dark:bg-[#1e1912] text-ink dark:text-[#f5ede4] flex items-center justify-center hover:border-ember hover:text-ember transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </motion.button>
          <motion.button
            onClick={scrollNext}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full border border-border-warm dark:border-[#3a2e24] bg-sand dark:bg-[#1e1912] text-ink dark:text-[#f5ede4] flex items-center justify-center hover:border-ember hover:text-ember transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Dots */}
        <div className="flex gap-1.5 items-center mx-auto md:mx-0" aria-live="polite">
          {scrollSnaps.map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ember ${
                  isActive
                    ? "w-6 h-2 bg-ember"
                    : "w-2 h-2 bg-border-warm dark:bg-[#3a2e24] hover:bg-stone"
                }`}
              />
            );
          })}
        </div>

        {/* View all link - desktop */}
        <Link
          href="/explore"
          className="hidden md:flex items-center gap-1 text-sm text-stone hover:text-ember transition-colors group"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
