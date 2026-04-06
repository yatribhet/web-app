import {
  ParkingCircle,
  Bath,
  Wifi,
  Accessibility,
  Camera,
  ShoppingBag,
  Users,
  UtensilsCrossed,
  type LucideIcon,
  CheckCircle,
} from "lucide-react";

export const amenityIcons: Record<string, LucideIcon> = {
  Parking: ParkingCircle,
  Restrooms: Bath,
  WiFi: Wifi,
  "Wheelchair Accessible": Accessibility,
  Photography: Camera,
  "Gift Shops": ShoppingBag,
  "Guided Tours": Users,
  Restaurant: UtensilsCrossed,
  Lodging: UtensilsCrossed, // Fallback representing a place to stay/eat
  Boating: Users, // Fallback
};

interface AmenityChipProps {
  amenity: string;
}

export function AmenityChip({ amenity }: AmenityChipProps) {
  const Icon = amenityIcons[amenity] || CheckCircle;

  return (
    <div className="bg-sand dark:bg-[#26201a] border border-border-warm dark:border-[#3a2e24] rounded text-[11px] text-stone flex items-center gap-1.5 px-2.5 py-1 w-fit flex-shrink-0">
      <Icon size={12} className="text-stone" />
      <span>{amenity}</span>
    </div>
  );
}
