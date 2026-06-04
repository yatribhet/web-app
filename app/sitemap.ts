import type { MetadataRoute } from "next";
import { getAllPlaces } from "@/src/lib/places";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const places = await getAllPlaces();
  const placeRoutes = places.map((p) => ({
    url: `https://yatribhet.com/${p.slug}`,
    lastModified: p.lastVerifiedAt ? new Date(p.lastVerifiedAt) : new Date(),
    changeFrequency: p.seo.sitemapChangefreq as any,
    priority: p.seo.sitemapPriority,
  }));

  const staticPages = ["", "explore", "routes", "religion", "journal", "privacy", "contact"].map((p) => ({
    url: `https://yatribhet.com${p ? `/${p}` : ""}`,
    lastModified: new Date(),
    changeFrequency: "daily" as any,
    priority: p === "" ? 1.0 : p === "explore" ? 0.9 : 0.7,
  }));

  return [
    ...staticPages,
    ...placeRoutes,
  ];
}
