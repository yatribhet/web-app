"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PILLS = ["Kathmandu", "Pokhara", "Everest", "Temples", "Hiking"];

export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/explore?q=${encodeURIComponent(search)}`);
    }
  };

  const handlePillClick = (pill: string) => {
    router.push(`/explore?type=${encodeURIComponent(pill)}`);
  };

  return (
    <section
      className={[
        "relative w-full flex flex-col items-center justify-center overflow-hidden",
        // Horizontal padding
        "px-4 md:px-8",
        // Vertical: natural height on mobile (content-driven), fixed aspect on desktop
        "py-20 sm:py-24",
        "md:h-[80vh] md:min-h-[560px] md:py-0",
        // Safety floor so content never clips on tiny phones
        "min-h-[520px]",
      ].join(" ")}
    >
      {/* ── Background image + overlay ─────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2600&auto=format&fit=crop"
          alt="Trekking in Nepal"
          className="w-full h-full object-cover object-center select-none"
          draggable="false"
        />
        {/* Slightly darker overlay for readability across all screen sizes */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-2xl w-full text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="mb-3 sm:mb-4 inline-block"
        >
          <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Plan your next journey
          </span>
        </motion.div>

        {/* Headline — smaller base size to avoid 3-line wrap on 320px */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="font-display text-[1.85rem] leading-tight sm:text-5xl lg:text-6xl text-white mb-3 sm:mb-5"
        >
          Discover{" "}
          <em className="italic text-ember not-italic">Sacred</em>{" "}
          Places &amp; Hidden Trails
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="text-white/75 text-sm sm:text-base lg:text-lg mb-6 sm:mb-9 max-w-xl mx-auto leading-relaxed"
        >
          Explore the Himalayas, ancient artifacts, and spiritual centres
          tailored to your soul.
        </motion.p>

        {/* ── Search bar ─────────────────────────────────────────
            Single row on ALL screen sizes.
            On mobile: [icon + input] [Search button]
            On sm+:    [icon + input] [|] [filter] [Search button]
        ───────────────────────────────────────────────────────── */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSearch}
          className="bg-white rounded shadow-2xl flex items-center overflow-hidden max-w-xl mx-auto h-12 sm:h-14"
        >
          {/* Icon + input */}
          <div className="flex flex-1 items-center px-3 sm:px-4 h-full min-w-0">
            <Search className="text-stone flex-shrink-0 w-4 h-4 sm:w-[18px] sm:h-[18px] mr-2 sm:mr-3" />
            <input
              type="text"
              placeholder="Search temples, trails, regions…"
              className="flex-1 min-w-0 font-body text-ink placeholder:text-stone/70 border-none outline-none focus:ring-0 bg-transparent text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Divider — desktop only */}
          <div className="hidden sm:block w-[1px] h-8 bg-border-warm flex-shrink-0" />

          {/* Filter button — desktop only */}
          <button
            type="button"
            className="hidden sm:flex items-center justify-center px-5 h-full flex-shrink-0 hover:bg-stone/5 transition-colors focus-visible:outline-none focus-visible:bg-stone/10"
            aria-label="Advanced filters"
            onClick={() => router.push("/explore")}
          >
            <SlidersHorizontal className="text-stone w-5 h-5" />
          </button>

          {/* Search CTA */}
          <button
            type="submit"
            className="bg-ember text-white px-5 sm:px-8 h-full flex-shrink-0 font-medium text-sm sm:text-base hover:bg-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dusk"
          >
            Search
          </button>
        </motion.form>

        {/* Quick-filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-2 justify-center mt-4 sm:mt-5"
        >
          {PILLS.map((pill) => (
            <motion.button
              key={pill}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePillClick(pill)}
              className="bg-white/10 text-white/80 backdrop-blur border border-white/20 text-xs px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none"
            >
              {pill}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Sentinel for FilterTabBar sticky observer */}
      <div id="hero-sentinel" className="absolute bottom-0 w-full h-[1px]" />
    </section>
  );
}
