"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PILLS = [
  "Kathmandu",
  "Pokhara",
  "Everest",
  "Temples",
  "Hiking",
];

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
    <section className="relative w-full flex flex-col items-center justify-center pt-24 pb-20 px-4 md:px-8 overflow-hidden h-[80vh] min-h-[500px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?q=80&w=2600&auto=format&fit=crop"
          alt="Trekking in Nepal"
          className="w-full h-full object-cover select-none"
          draggable="false"
        />
        {/* Dark Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5, ease: "easeOut" }}
          className="mb-4 inline-block"
        >
          <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Plan your next journey
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight"
        >
          Discover <em className="italic text-ember not-italic">Sacred</em>{" "}
          Places & Hidden Trails
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="text-stone text-sm sm:text-base lg:text-lg mb-10 max-w-xl mx-auto"
        >
          Explore the Himalayas, ancient artifacts, and spiritual centres tailored to your soul.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSearch}
          className="bg-white rounded shadow-2xl flex flex-col sm:flex-row h-auto sm:h-14 overflow-hidden max-w-xl mx-auto"
        >
          <div className="flex flex-1 items-center px-4 h-14 sm:h-full">
            <Search className="text-stone w-[18px] h-[18px] mr-3" />
            <input
              type="text"
              placeholder="Search for temples, trails, regions..."
              className="flex-1 font-body text-ink placeholder:text-stone border-none outline-none focus:ring-0 bg-transparent text-sm sm:text-base h-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="hidden sm:block w-[1px] h-8 bg-border-warm my-auto" />

          <div className="flex h-14 sm:h-full w-full sm:w-auto border-t sm:border-t-0 border-border-warm">
            <button
              type="button"
              className="flex items-center justify-center px-4 sm:px-5 hover:bg-stone/5 transition-colors focus-visible:outline-none focus-visible:bg-stone/10"
              aria-label="Advanced filters"
              onClick={() => router.push("/explore")}
            >
              <SlidersHorizontal className="text-stone w-5 h-5" />
            </button>
            <button
              type="submit"
              className="bg-ember text-white px-6 sm:px-8 h-full font-medium hover:bg-dusk transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-dusk flex-1 sm:flex-none"
            >
              Search
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44, duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap gap-2 justify-center mt-5"
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
      
      {/* Sentinel for sticky intersection observer in next component */}
      <div id="hero-sentinel" className="absolute bottom-0 w-full h-[1px]" />
    </section>
  );
}
