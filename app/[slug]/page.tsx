import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaceBySlug, getAllPlaces } from "@/src/lib/places";
import { PlaceJsonLd } from "@/src/seo/PlaceJsonLd";
import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { PlaceHero } from "@/src/components/sections/PlaceHero";
import { PlaceInfoGrid } from "@/src/components/sections/PlaceInfoGrid";
import { FAQSection } from "@/src/components/sections/FAQSection";
import { SidebarActions } from "@/src/components/sections/SidebarActions";
import { NearbyStrip } from "@/src/components/sections/NearbyStrip";
import { AmenityChip } from "@/src/components/ui/AmenityChip";
import { TitleBlock, DescriptionBlock, KeyFactsList } from "./ClientComponents";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const place = await getPlaceBySlug(params.slug);
  if (!place) return { title: "Place Not Found" };

  return {
    title: place.seo.metaTitle ?? (place.popularName || place.name),
    description: place.seo.metaDescription ?? place.description.slice(0, 160),
    robots: place.seo.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: place.seo.canonicalUrl ?? `https://yatribhet.com/${place.slug}`,
    },
    openGraph: {
      title: place.seo.metaTitle ?? (place.popularName || place.name),
      description: place.seo.metaDescription ?? "",
      images: place.seo.ogImage
        ? [{ url: place.seo.ogImage, width: 1200, height: 630 }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: place.seo.metaTitle ?? (place.popularName || place.name),
      description: place.seo.metaDescription ?? "",
      images: place.seo.ogImage ? [place.seo.ogImage] : [],
    },
  };
}

export async function generateStaticParams() {
  const places = await getAllPlaces();
  return places.map((p) => ({ slug: p.slug }));
}

export default async function PlaceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [place, places] = await Promise.all([
    getPlaceBySlug(params.slug),
    getAllPlaces(),
  ]);

  if (!place) {
    notFound();
  }

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yatribhet.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: place.state,
        item: `https://yatribhet.com/explore?state=${place.state}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: place.popularName || place.name,
        item: `https://yatribhet.com/${place.slug}`,
      },
    ],
  };

  return (
    <>
      <PlaceJsonLd place={place} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <Navbar />
      <PageWrapper>
        <div className="bg-sand dark:bg-[#13100d] flex-1">
          <div className="max-w-6xl mx-auto px-4 pt-5 pb-10 items-start grid lg:grid-cols-[1fr_340px] gap-8">
            <div className="flex flex-col">
              {/* Breadcrumb */}
              <nav className="text-xs text-stone mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <a href="/" className="hover:text-ember transition-colors">Nepal</a>
                <span>›</span>
                <a href={`/explore?state=${place.state}`} className="hover:text-ember transition-colors">{place.state}</a>
                <span>›</span>
                <span className="text-ink dark:text-[#f5ede4] font-medium">{place.popularName || place.name}</span>
              </nav>

              {/* ═══ NEW HERO SECTION ══════════════════════════════ */}
              <PlaceHero place={place} />

              <div className="mt-8">
                <TitleBlock place={place} />
                <SidebarActions place={place} variant="mobileActions" />
                <DescriptionBlock description={place.description} />
                <PlaceInfoGrid place={place} />
                
                <SidebarActions place={place} variant="mobileDetails" />

                {place.structuredData.amenities.length > 0 ? (
                  <div className="mt-10 pt-8 border-t border-border-warm dark:border-[#3a2e24]">
                    <h3 className="font-display text-xl mb-4 text-ink dark:text-[#f5ede4]">
                      Available Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {place.structuredData.amenities.map((amenity) => (
                        <AmenityChip key={amenity} amenity={amenity} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-10 pt-8 border-t border-border-warm dark:border-[#3a2e24]">
                    <h3 className="font-display text-xl mb-2 text-ink dark:text-[#f5ede4]">
                      Available Amenities
                    </h3>
                    <p className="text-xs text-stone/60 italic">
                      No amenities information available for this place yet.
                    </p>
                  </div>
                )}

                {place.aiMeta.keyFacts.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border-warm dark:border-[#3a2e24]">
                    <h3 className="font-display text-xl mb-4 text-ink dark:text-[#f5ede4]">
                      Key Facts
                    </h3>
                    <KeyFactsList facts={place.aiMeta.keyFacts} />
                  </div>
                )}

                <div className="mt-8">
                  <FAQSection faqs={place.aiMeta.faq} />
                </div>
                
                <div className="mt-8">
                  <NearbyStrip currentPlace={place} allPlaces={places} />
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <SidebarActions place={place} variant="desktop" />
            </div>
          </div>
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}
