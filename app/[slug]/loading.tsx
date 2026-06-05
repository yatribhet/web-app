import { Navbar } from "@/src/components/layout/Navbar";
import { PageWrapper } from "@/src/components/layout/PageWrapper";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-border-warm/60 dark:bg-[#3a2e24]/60 ${className ?? ""}`}
    />
  );
}

export default function PlaceDetailLoading() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="bg-sand dark:bg-[#13100d] flex-1">
          <div className="max-w-6xl mx-auto px-4 pt-5 pb-10 grid lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* ── Main column ──────────────────────────────────────────── */}
            <div className="flex flex-col min-w-0 overflow-hidden">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-3">
                <Bone className="h-3 w-12" />
                <Bone className="h-3 w-2" />
                <Bone className="h-3 w-20" />
                <Bone className="h-3 w-2" />
                <Bone className="h-3 w-32" />
              </div>

              {/* Hero */}
              <Bone className="w-full h-64 sm:h-80 rounded-2xl" />

              {/* Thumbnail strip */}
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <Bone key={i} className="h-16 flex-1 rounded-lg" />
                ))}
              </div>

              <div className="mt-8 space-y-5">
                {/* Title */}
                <Bone className="h-8 w-3/4" />
                <Bone className="h-4 w-1/2" />

                {/* Mobile actions placeholder */}
                <Bone className="h-32 w-full lg:hidden rounded-xl" />

                {/* Description */}
                <div className="space-y-2 pt-2">
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-5/6" />
                  <Bone className="h-4 w-full" />
                  <Bone className="h-4 w-4/5" />
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Bone key={i} className="h-20 rounded-xl" />
                  ))}
                </div>

                {/* Amenities */}
                <div className="pt-6 space-y-3">
                  <Bone className="h-6 w-40" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Bone key={i} className="h-8 w-24 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <div className="hidden lg:flex flex-col gap-4">
              {/* Actions card */}
              <Bone className="h-52 w-full rounded-xl" />
              {/* Map card */}
              <Bone className="h-72 w-full rounded-xl" />
              {/* Hours card */}
              <Bone className="h-36 w-full rounded-xl" />
            </div>

          </div>
        </div>
      </PageWrapper>
    </>
  );
}
