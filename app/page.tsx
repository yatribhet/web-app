import { HeroSection } from "@/src/components/sections/HeroSection";
import { FilterTabBar } from "@/src/components/sections/FilterTabBar";
import { FeaturedCarousel } from "@/src/components/sections/FeaturedCarousel";
import { CategoryGrid } from "@/src/components/sections/CategoryGrid";
import { getAllPlaces } from "@/src/lib/places";
import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

export default function HomePage() {
  const places = getAllPlaces();

  // Pick top 5 based on rating to feature
  const featured = [...places].sort((a, b) => b.famousRating - a.famousRating).slice(0, 5);

  return (
    <>
      <Navbar />
      <PageWrapper noPaddingTop>
        <HeroSection />
        <FilterTabBar />
        <div className="bg-sand dark:bg-[#13100d] flex-1">
          <FeaturedCarousel places={featured} />
          <CategoryGrid />
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}
