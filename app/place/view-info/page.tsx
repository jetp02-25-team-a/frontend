// app/spots/[id]/page.tsx
import Hero from "./_components/Hero";
import MetaPanel from "./_components/MetaPanel";
import RatingSummary from "./_components/RatingSummary";
import MapSection from "./_components/MapSection";
import ReviewList from "./_components/ReviewList";
import ReviewComposer from "./_components/ReviewComposer";
import { spot, reviews } from "./lib/fixtures";

export default async function SpotPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
      <Hero spot={spot} photos={spot.photos ?? []} />
      <div className="grid grid-cols-12 gap-6">
        <main className="col-span-12 space-y-6 flex flex-col items-center">
          <div className="flex items-start gap-4 w-full">
            <div className="flex-1">
              <RatingSummary
                avg={spot.ratingAvg}
                dist={spot.ratingDist}
                count={spot.reviewCount}
              />
            </div>
            <div className="flex-1">
              <MetaPanel spot={spot} />
            </div>
          </div>
          <MapSection />

          <ReviewList reviews={reviews} />
          <ReviewComposer />
        </main>
        {/* <aside className="col-span-12 lg:col-span-4"></aside> */}
      </div>
    </div>
  );
}
