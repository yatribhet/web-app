import { getAllPlaces } from "@/src/lib/places";
import { Navbar } from "@/src/components/layout/Navbar";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import ExploreClient from "./ExploreClient";

export default function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const places = getAllPlaces();
  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="bg-sand dark:bg-[#13100d] flex-1 min-h-[calc(100vh-56px)]">
          <ExploreClient initialPlaces={places} searchParams={searchParams} />
        </div>
      </PageWrapper>
    </>
  );
}
