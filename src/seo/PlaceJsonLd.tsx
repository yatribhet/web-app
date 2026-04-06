import { PlaceDocument } from "../types/place";

interface PlaceJsonLdProps {
  place: PlaceDocument;
}

export function PlaceJsonLd({ place }: PlaceJsonLdProps) {
  const schemaA = {
    "@context": "https://schema.org",
    "@type": place.structuredData.schemaType,
    name: place.name,
    alternateName: place.aiMeta.entityAliases,
    description: place.aiMeta.summaryForAi ?? place.description,
    url: `https://yatribhet.com/${place.slug}`,
    image: place.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.district,
      addressRegion: place.state,
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.location.coordinates[1],
      longitude: place.location.coordinates[0],
    },
    openingHoursSpecification: place.structuredData.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: place.structuredData.aggregateRating.ratingValue,
      reviewCount: place.structuredData.aggregateRating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    amenityFeature: place.structuredData.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    priceRange: place.structuredData.priceRange,
    telephone: place.structuredData.phone,
    email: place.structuredData.email,
    ...(place.structuredData.website
      ? { sameAs: [place.structuredData.website] }
      : {}),
  };

  const schemaB =
    place.aiMeta.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: place.aiMeta.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaA) }}
      />
      {schemaB && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaB) }}
        />
      )}
    </>
  );
}
