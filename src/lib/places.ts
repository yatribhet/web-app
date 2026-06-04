import { PlaceDocument } from "../types/place";

const API_URL = process.env.API_URL!;
const API_KEY = process.env.GOD_API_KEY!;

const fetchOptions: RequestInit = {
  headers: { "x-api-key": API_KEY },
  next: { revalidate: 3600 },
};

export async function getAllPlaces(): Promise<PlaceDocument[]> {
  const res = await fetch(
    `${API_URL}/v1/api/seo/places?limit=1000`,
    fetchOptions
  );
  if (!res.ok) throw new Error(`Failed to fetch places: ${res.status}`);
  const json = await res.json();
  return json.data as PlaceDocument[];
}

export async function getPlaceBySlug(
  slug: string
): Promise<PlaceDocument | undefined> {
  const res = await fetch(
    `${API_URL}/v1/api/seo/places/${slug}`,
    fetchOptions
  );
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Failed to fetch place "${slug}": ${res.status}`);
  const json = await res.json();
  return json.data as PlaceDocument;
}

export async function getPlacesByDistrict(
  district: string
): Promise<PlaceDocument[]> {
  const places = await getAllPlaces();
  return places.filter(
    (p) => p.district.toLowerCase() === district.toLowerCase()
  );
}

export async function getPlacesByType(type: string): Promise<PlaceDocument[]> {
  const places = await getAllPlaces();
  return places.filter(
    (p) => p.placeType.toLowerCase() === type.toLowerCase()
  );
}
