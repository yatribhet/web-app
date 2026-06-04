import { PlaceDocument } from "../../types/place";
import { StarRating } from "../ui/StarRating";

interface PlaceInfoGridProps {
  place: PlaceDocument;
}

export function PlaceInfoGrid({ place }: PlaceInfoGridProps) {
  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case "Easy": return "text-emerald-600 dark:text-emerald-400";
      case "Moderate": return "text-amber-600 dark:text-amber-400";
      case "Hard": return "text-orange-600 dark:text-orange-400";
      case "Expert": return "text-rose-600 dark:text-rose-400";
      case "Godmode": return "text-purple-600 dark:text-purple-400 font-bold animate-pulse";
      default: return "text-stone";
    }
  };

  const fields = [
    { label: "District", value: place.district },
    { label: "State", value: place.state },
    { label: "Famous Rating", value: <StarRating rating={place.famousRating} /> },
    { label: "Place Type", value: place.placeType },
    ...(place.altitude ? [{ label: "Altitude", value: `${place.altitude.toLocaleString()}m` }] : []),
    ...(place.difficulty ? [{ 
      label: "Difficulty", 
      value: <span className={getDifficultyColor(place.difficulty)}>{place.difficulty}</span> 
    }] : []),
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
      {fields.map((field, idx) => (
        <div
          key={idx}
          className="bg-sand/30 dark:bg-[#1e1912] border border-border-warm dark:border-[#3a2e24] shadow-sm rounded-xl p-4 flex flex-col justify-center transition-all hover:shadow-md hover:border-ember/30"
        >
          <span className="text-[11px] uppercase tracking-widest text-stone/60 mb-1.5 font-medium">
            {field.label}
          </span>
          <div className="text-[14px] font-semibold text-ink dark:text-[#f5ede4]">
            {field.value}
          </div>
        </div>
      ))}
    </div>
  );
}
