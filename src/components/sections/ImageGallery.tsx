"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Mountain } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [activeIndex, images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 z-10 relative mt-4 md:mt-0">
      {/* Hero Image */}
      <div className="w-full aspect-video rounded-md relative overflow-hidden bg-[#1e1912] border border-border-warm dark:border-[#3a2e24]">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[activeIndex]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <img
              src={images[activeIndex]}
              alt={`Gallery image ${activeIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
                if (target.nextElementSibling) target.nextElementSibling.classList.remove('hidden');
              }}
            />
            {/* Fallback Component */}
            <div className="hidden absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#13100d]">
              <img src="/images/logo-short-dark.svg" alt="Yatribhet Placeholder" className="w-20 h-20 opacity-50 mb-3" />
              <span className="text-xs text-stone tracking-wider uppercase font-medium">Image Unavailable</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <OverlayScrollbarsComponent
          options={{ scrollbars: { theme: "os-theme-ember", visibility: "auto" } }}
          className="w-full pb-1"
          defer
        >
          <div className="flex gap-2 min-w-min">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-16 h-12 rounded object-cover cursor-pointer flex-shrink-0 relative overflow-hidden focus-visible:outline-none bg-sand dark:bg-[#13100d] transition-all border ${
                  activeIndex === idx ? "ring-2 ring-ember border-transparent shadow-sm" : "border-border-warm dark:border-[#3a2e24] opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Quick inline fallback for thumbnails
                    (e.target as HTMLElement).style.display = 'none';
                    (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center bg-[#13100d]">
                   <img src="/images/logo-short-dark.svg" alt="Placeholder" className="w-8 h-8 opacity-50" />
                </div>
              </button>
            ))}
          </div>
        </OverlayScrollbarsComponent>
      )}
    </div>
  );
}
