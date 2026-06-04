export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Transportation {
  air: boolean;
  land: boolean;
  water: boolean;
  human: boolean;
}

export interface SubRoute {
  name: string;
  description: string;
  starting: string;
  startLocation: GeoLocation;
  ending: string;
  endLocation: GeoLocation;
  position: number;
  myCode: string;
  estimatedDuration: number; // minutes
  estimatedDistance: number; // km
}

export interface Route {
  name: string;
  myRouteUniqueCode: string;
  estimatedDuration: number;
  estimatedDistance: number;
  subRoutes: SubRoute[];
}

export interface Tag {
  _id: string;
  name: string;
}

export interface OpeningHoursSpec {
  days: string[];
  opens: string; // "HH:MM"
  closes: string; // "HH:MM"
}

export interface EntryFee {
  amount: number | null;
  currency: string;
}

export interface StarBreakdown {
  star: number;
  count: number;
  percentage: number;
}

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
  breakdown: StarBreakdown[];
}

export interface StructuredData {
  schemaType:
    | "TouristAttraction"
    | "LocalBusiness"
    | "Restaurant"
    | "Hotel"
    | "Museum"
    | "Park"
    | "LandmarksOrHistoricalBuildings"
    | "Place";
  openingHours: OpeningHoursSpec[];
  priceRange: "Free" | "$" | "$$" | "$$$" | "$$$$" | null;
  entryFee: EntryFee;
  phone: string | null;
  email: string | null;
  website: string | null;
  aggregateRating: AggregateRating;
  amenities: string[];
}

export interface SEO {
  metaTitle: string | null; // max 60 chars
  metaDescription: string | null; // max 160 chars
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  sitemapPriority: number; // 0.0–1.0
  sitemapChangefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AIMeta {
  summaryForAi: string | null; // max 500 chars, factual, no fluff
  entityAliases: string[];
  faq: FAQ[];
  keyFacts: string[];
  topicAssociations: string[];
}

export interface PlaceDocument {
  _id: string;
  country: string;
  name: string;
  description: string;
  popularName: string;
  location: GeoLocation;
  displayImage: string | null;
  displayMap: string | null;
  images: string[];
  placeType: string;
  state: string;
  zone: string;
  district: string;
  myUniqueCode: string;
  parentCode: string | null;
  parent: string | null;
  tags: Tag[];
  famousRating: number;
  routes: Route[];
  slug: string;
  seo: SEO;
  structuredData: StructuredData;
  aiMeta: AIMeta;
  lastVerifiedAt: string | null; // ISO date string
  altitude?: number; // meters
  difficulty?: "Easy" | "Moderate" | "Hard" | "Expert" | "Godmode";
}
