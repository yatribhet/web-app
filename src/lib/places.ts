import { Hospitality, HospitalityType, PlaceDocument } from "../types/place";

const API_URL = process.env.API_URL!;
const API_KEY = process.env.GOD_API_KEY!;

const fetchOptions: RequestInit = {
  headers: { "x-api-key": API_KEY },
  next: { revalidate: 3600 },
};

export interface HospitalityPage {
  data: Hospitality[];
  pagination: {
    totalDocs?: number;
    page?: number;
    totalPages?: number;
    hasNextPage?: boolean;
  };
}

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

/**
 * Paginated hospitality for a place (server-only — keeps the API key secret).
 * The first batch is embedded in the place detail response; this powers
 * type-filtering and "load more" via the /api/hospitality/[slug] proxy route.
 */
export async function getPlaceHospitality(
  slug: string,
  opts: { hospitalityType?: HospitalityType; page?: number; limit?: number } = {}
): Promise<HospitalityPage> {
  const params = new URLSearchParams();
  if (opts.hospitalityType) params.set("hospitalityType", opts.hospitalityType);
  if (opts.page) params.set("page", String(opts.page));
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();

  const res = await fetch(
    `${API_URL}/v1/api/seo/places/${slug}/hospitality${qs ? `?${qs}` : ""}`,
    fetchOptions
  );
  if (!res.ok)
    throw new Error(`Failed to fetch hospitality "${slug}": ${res.status}`);
  const json = await res.json();
  return {
    data: (json.data ?? []) as Hospitality[],
    pagination: json.pagination ?? {},
  };
}
