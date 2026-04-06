"use client";

import { useState, useEffect } from "react";

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("yatra-favourites");
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load favourites from localStorage:", e);
    }
  }, []);

  const toggleFavourite = (id: string) => {
    setFavourites((current) => {
      let updated: string[];
      if (current.includes(id)) {
        updated = current.filter((favId) => favId !== id);
      } else {
        updated = [...current, id];
      }
      try {
        localStorage.setItem("yatra-favourites", JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save favourites to localStorage:", e);
      }
      return updated;
    });
  };

  const isFavourite = (id: string) => favourites.includes(id);

  return { favourites, toggleFavourite, isFavourite };
}
