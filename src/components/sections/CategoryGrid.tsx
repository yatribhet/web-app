"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mountain, Flame, Leaf, Binoculars, Home, Map } from "lucide-react";
import { places } from "../../../src/data/places";
import { FALLBACK_IMAGE } from "../../lib/constants";

const CATEGORIES = [
  {
    name: "Temple",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Trekking",
    icon: Mountain,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Heritage",
    icon: Map,
    image: "https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Nature",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Viewpoint",
    icon: Binoculars,
    image: "https://images.unsplash.com/photo-1520188740392-68be7cecb373?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Village",
    icon: Home,
    image: "https://images.unsplash.com/photo-1582654313543-c793ff80145c?q=80&w=800&auto=format&fit=crop",
  },
];

function CategoryTile({ cat, count }: { cat: typeof CATEGORIES[number]; count: number }) {
  const IconComponent = cat.icon;
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  // Programmatic preload — catches failures that <img> onError misses
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    const timeout = setTimeout(() => {
      // If image hasn't loaded in 6s, switch to fallback
      if (!cancelled) setImgSrc(FALLBACK_IMAGE);
    }, 6000);

    img.onload = () => {
      clearTimeout(timeout);
      if (!cancelled) setImgSrc(img.naturalWidth > 0 ? cat.image : FALLBACK_IMAGE);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      if (!cancelled) setImgSrc(FALLBACK_IMAGE);
    };
    img.src = cat.image;

    return () => { cancelled = true; clearTimeout(timeout); };
  }, [cat.image]);

  return (
    <Link
      href={`/explore?type=${encodeURIComponent(cat.name)}`}
      className="group relative overflow-hidden rounded-md aspect-[5/3] md:aspect-video flex flex-col items-center justify-center bg-[#13100d] border border-transparent hover:border-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember shadow-sm"
    >
      {/* Background Image — preloaded via JS, guaranteed to resolve */}
      <img
        src={imgSrc ?? FALLBACK_IMAGE}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2 mt-4">
        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white mb-2 opacity-80 group-hover:opacity-100 group-hover:text-ember transition-colors duration-300" strokeWidth={1.5} />
        <h3 className="font-display italic text-white text-xl md:text-2xl drop-shadow-md">
          {cat.name}
        </h3>
        
        {/* Micro-interaction: The count pill slides up and fades in on hover */}
        <span className="absolute -bottom-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-ember/90 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
          {count} {count === 1 ? "place" : "places"}
        </span>
      </div>
    </Link>
  );
}

export function CategoryGrid() {
  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-ink dark:text-[#f5ede4]">
          Browse by Type
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const count = places.filter(
            (p) => p.placeType.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return <CategoryTile key={cat.name} cat={cat} count={count} />;
        })}
      </div>
    </section>
  );
}
