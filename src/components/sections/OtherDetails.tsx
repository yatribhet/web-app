import { PlaceDocument } from "../../types/place";
import { OpeningHours } from "./OpeningHours";
import { RatingBars } from "../ui/RatingBars";

/**
 * Opening Hours + Reviews. Relocated out of the right rail into the main
 * column so the sticky rail stays compact and these read full-width.
 */
export function OtherDetails({ place }: { place: PlaceDocument }) {
  const hasHours = place.structuredData.openingHours.length > 0;

  return (
    <div className="mt-10 pt-8 border-t border-border-warm dark:border-[#3a2e24] grid gap-4 sm:grid-cols-2">
      {hasHours && (
        <div className="border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-5 shadow-sm">
          <h4 className="font-display text-lg mb-2 text-ink dark:text-[#f5ede4]">Opening Hours</h4>
          <OpeningHours hours={place.structuredData.openingHours} />
        </div>
      )}
      <div
        className={`border border-border-warm dark:border-[#3a2e24] rounded-xl bg-white dark:bg-[#1e1912] p-5 shadow-sm ${
          hasHours ? "" : "sm:col-span-2"
        }`}
      >
        <h4 className="font-display text-lg mb-3 text-ink dark:text-[#f5ede4]">Reviews</h4>
        <RatingBars aggregateRating={place.structuredData.aggregateRating} />
      </div>
    </div>
  );
}
