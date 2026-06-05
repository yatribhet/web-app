"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight, Play, Mountain } from "lucide-react";
import { PlaceDocument } from "../../types/place";
import { FALLBACK_IMAGE } from "../../lib/constants";

interface PlaceHeroProps {
  place: PlaceDocument;
}

// ─── Lightbox ──────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
}: {
  images: string[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
      >
        <X size={28} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-10 hover:bg-white/10 rounded-full p-2"
      >
        <ChevronLeft size={32} />
      </button>

      <div className="relative max-w-5xl max-h-[85vh] w-full px-10 sm:px-16" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Image ${current + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl bg-[#13100d]"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              // Check if we haven't already tried the fallback
              if (!img.dataset.fallbackTried) {
                img.dataset.fallbackTried = 'true';
                img.src = FALLBACK_IMAGE;
                img.style.opacity = '0.8';
                img.style.objectFit = 'contain';
              }
            }}
          />
        </AnimatePresence>
        <p className="text-center text-white/40 text-xs mt-3 tracking-widest uppercase">
          {current + 1} / {images.length}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-10 hover:bg-white/10 rounded-full p-2"
      >
        <ChevronRight size={32} />
      </button>
    </motion.div>
  );
}

// ─── Main Hero ──────────────────────────────────────────────────────────────
export function PlaceHero({ place }: PlaceHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  const hero = place.displayImage || place.images?.[0];
  const galleryImages = place.images ?? [];

  // Determine gallery layout
  const side1 = galleryImages[1];
  const side2 = galleryImages[2];
  const remaining = galleryImages.length - 3;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO: full-bleed cinematic display image
      ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="w-full relative">
        {/* Main hero image */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-[#13100d] group aspect-video max-h-[500px] min-h-[200px]">
          {hero ? (
            <>
              <motion.img
                src={hero}
                alt={`${place.popularName || place.name} — hero`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                draggable={false}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  // Check if we haven't already tried the fallback
                  if (!img.dataset.fallbackTried) {
                    img.dataset.fallbackTried = 'true';
                    img.src = FALLBACK_IMAGE;
                    img.style.opacity = '0.7';
                    img.style.objectFit = 'cover';
                  }
                }}
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

              {/* Bottom-left info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 flex items-end justify-between">
                <div className="flex flex-col gap-1.5">
                  {place.altitude && (
                    <div className="flex items-center gap-1.5 text-white/80">
                      <Mountain size={13} />
                      <span className="text-xs font-mono tracking-widest">{place.altitude.toLocaleString()}m</span>
                    </div>
                  )}
                  <h1 className="font-display italic text-white text-2xl md:text-4xl lg:text-5xl leading-tight drop-shadow-lg line-clamp-2">
                    {place.popularName || place.name}
                  </h1>
                  <p className="text-white/60 text-xs tracking-widest uppercase">
                    {place.district} · {place.state}
                  </p>
                </div>

                {/* Expand button */}
                <button
                  onClick={() => openLightbox(0)}
                  className="group/btn flex items-center gap-2 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition-all"
                >
                  <ZoomIn size={14} className="group-hover/btn:scale-110 transition-transform" />
                  <span className="hidden sm:inline tracking-wide">View full</span>
                </button>
              </div>
            </>
          ) : (
            /* Placeholder when no image */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <img src="/images/logo-short-dark.svg" alt="Yatribhet" className="w-20 h-20 opacity-20" />
              <span className="text-white/30 text-sm uppercase tracking-widest">No image yet</span>
            </div>
          )}
        </div>

        {/* ─── Photo gallery strip below hero ────────────────────── */}
        {galleryImages.length > 1 && (
          <div className={`mt-3 grid gap-2 md:gap-3 ${
            side2 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"
          }`}>
            {side1 && (
              <button
                onClick={() => openLightbox(1)}
                className="relative rounded-xl overflow-hidden bg-[#13100d] group h-20 sm:h-28 md:h-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <img
                  src={side1}
                  alt="Gallery 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { 
                    const img = e.target as HTMLImageElement;
                    if (!img.dataset.fallbackTried) {
                      img.dataset.fallbackTried = 'true';
                      img.src = FALLBACK_IMAGE;
                      img.style.opacity = '0.7';
                      img.style.objectFit = 'cover';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            )}

            {side2 && (
              <button
                onClick={() => openLightbox(2)}
                className="relative rounded-xl overflow-hidden bg-[#13100d] group h-20 sm:h-28 md:h-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
              >
                <img
                  src={side2}
                  alt="Gallery 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { 
                    const img = e.target as HTMLImageElement;
                    if (!img.dataset.fallbackTried) {
                      img.dataset.fallbackTried = 'true';
                      img.src = FALLBACK_IMAGE;
                      img.style.opacity = '0.7';
                      img.style.objectFit = 'cover';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            )}

            {/* "See all photos" if more than 3 */}
            {galleryImages.length > 1 && (
              <button
                onClick={() => openLightbox(0)}
                className="relative rounded-xl overflow-hidden bg-[#1a140e] group h-20 sm:h-28 md:h-36 border border-border-warm dark:border-[#3a2e24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember hover:border-ember/40 transition-colors"
              >
                {galleryImages[3] && (
                  <img
                    src={galleryImages[3]}
                    alt="More photos"
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    onError={(e) => { 
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.fallbackTried) {
                        img.dataset.fallbackTried = 'true';
                        img.src = FALLBACK_IMAGE;
                        img.style.opacity = '0.3';
                        img.style.objectFit = 'cover';
                      }
                    }}
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <span className="font-display text-2xl text-white font-bold">
                    {remaining > 0 ? `+${remaining}` : ""}
                  </span>
                  <span className="text-white/70 text-xs tracking-widest uppercase">All photos</span>
                </div>
              </button>
            )}
          </div>
        )}


        {/* ─── Video teaser placeholder ─────────────────────────── */}
        <div className="mt-3 rounded-xl border border-dashed border-border-warm dark:border-[#3a2e24] bg-[#13100d]/50 dark:bg-[#0e0b08]/60 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ember/10 dark:bg-ember/20 ring-1 ring-ember/30 flex items-center justify-center shrink-0">
            <Play size={22} className="text-ember ml-1" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-ink dark:text-[#f5ede4]">
              Video Tour — Coming Soon
            </p>
            <p className="text-xs text-stone/70 leading-relaxed">
              Immersive short films from Yatribhet's field team. Drone footage, ground level walkthroughs, and real traveler stories will appear here.
            </p>
          </div>
        </div>

      </section>

      {/* ─── Lightbox Portal ──────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={galleryImages}
            index={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
