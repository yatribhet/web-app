"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mountain, Flame, Leaf, Binoculars, Home, Map,
  TreePine, Waves, Building2, Church, Tent, Camera,
  type LucideIcon,
} from "lucide-react";
import { PlaceDocument } from "@/src/types/place";
import { FALLBACK_IMAGE } from "../../lib/constants";

const TYPE_ICONS: Record<string, LucideIcon> = {
  Temple: Flame,
  Trekking: Mountain,
  Heritage: Map,
  Nature: Leaf,
  Viewpoint: Binoculars,
  Village: Home,
  Shrine: Flame,
  Forest: TreePine,
  Lake: Waves,
  Museum: Building2,
  Church: Church,
  Camp: Tent,
  Photography: Camera,
};

type CategoryData = {
  name: string;
  icon: LucideIcon;
  image: string;
  count: number;
};

function buildCategories(places: PlaceDocument[]): CategoryData[] {
  const typeMap: Record<string, { count: number; image: string | null }> = {};

  for (const place of places) {
    const type = place.placeType;
    if (!typeMap[type]) {
      typeMap[type] = { count: 0, image: place.displayImage ?? null };
    }
    typeMap[type].count++;
    if (!typeMap[type].image && place.displayImage) {
      typeMap[type].image = place.displayImage;
    }
  }

  return Object.entries(typeMap)
    .map(([name, { count, image }]) => ({
      name,
      icon: (TYPE_ICONS[name] ?? Mountain) as LucideIcon,
      image: image ?? FALLBACK_IMAGE,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function CategoryTile({ cat }: { cat: CategoryData }) {
  const IconComponent = cat.icon;
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    const timeout = setTimeout(() => {
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
      <img
        src={imgSrc ?? FALLBACK_IMAGE}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-2 mt-4">
        <IconComponent
          className="w-6 h-6 md:w-8 md:h-8 text-white mb-2 opacity-80 group-hover:opacity-100 group-hover:text-ember transition-colors duration-300"
          strokeWidth={1.5}
        />
        <h3 className="font-display italic text-white text-xl md:text-2xl drop-shadow-md">
          {cat.name}
        </h3>
        <span className="absolute -bottom-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-ember/90 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
          {cat.count} {cat.count === 1 ? "place" : "places"}
        </span>
      </div>
    </Link>
  );
}

export function CategoryGrid({ places }: { places: PlaceDocument[] }) {
  const categories = buildCategories(places);

  if (categories.length === 0) return null;

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="font-display text-2xl md:text-3xl text-ink dark:text-[#f5ede4]">
          Browse by Type
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <CategoryTile key={cat.name} cat={cat} />
        ))}
      </div>
    </section>
  );
}
