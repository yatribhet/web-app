import { Star } from "lucide-react";
import { AggregateRating } from "../../types/place";

interface RatingBarsProps {
  aggregateRating: AggregateRating;
}

export function RatingBars({ aggregateRating }: RatingBarsProps) {
  // Mock breakdown data since the schema only gives total count and average
  const breakdown = [
    { star: 5, percentage: 80 },
    { star: 4, percentage: 12 },
    { star: 3, percentage: 5 },
    { star: 2, percentage: 2 },
    { star: 1, percentage: 1 },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-display text-5xl text-ink dark:text-[#f5ede4]">
          {aggregateRating.ratingValue.toString()}
        </span>
        <div className="flex flex-col">
          <div className="flex text-ember mb-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(aggregateRating.ratingValue)
                    ? "fill-ember"
                    : "fill-transparent text-stone/30"
                }
              />
            ))}
          </div>
          <span className="text-stone text-xs">
            {aggregateRating.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {breakdown.map((row) => (
          <div key={row.star} className="flex items-center gap-2 text-[11px]">
            <span className="text-stone w-3 text-right">{row.star}</span>
            <div className="flex-1 h-1 bg-border-warm dark:bg-[#3a2e24] rounded-sm overflow-hidden">
              <div
                className="h-full bg-ember rounded-sm"
                style={{ width: `${row.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
