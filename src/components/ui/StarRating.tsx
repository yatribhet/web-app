"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // e.g. 4.6
  size?: number; // default 16
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  const starsArray = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-0.5 items-center">
      {starsArray.map((star) => {
        const isFull = rating >= star;
        const isPartial = !isFull && rating > star - 1;
        const fraction = isPartial ? rating - (star - 1) : 0;

        return (
          <div key={star} className="relative">
            {/* Background empty star */}
            <Star size={size} className="text-stone/30" />

            {/* Foreground filled/partial star */}
            {(isFull || isPartial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFull ? "100%" : `${fraction * 100}%` }}
              >
                <Star size={size} className="fill-ember stroke-ember" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
