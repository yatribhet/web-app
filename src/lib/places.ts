import { places } from "../data/places";
import { PlaceDocument } from "../types/place";

export function getPlaceBySlug(slug: string): PlaceDocument | undefined {
  return places.find((place) => place.slug === slug);
}

export function getAllPlaces(): PlaceDocument[] {
  return places;
}

export function getPlacesByDistrict(district: string): PlaceDocument[] {
  return places.filter(
    (place) => place.district.toLowerCase() === district.toLowerCase()
  );
}

export function getPlacesByType(type: string): PlaceDocument[] {
  return places.filter(
    (place) => place.placeType.toLowerCase() === type.toLowerCase()
  );
}
