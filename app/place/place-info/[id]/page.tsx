// app/spots/[id]/page.tsx
import Hero from '../_components/Hero';
import MetaPanel from '../_components/MetaPanel';
import MapSection from '../_components/MapSection';
import RatingSummary from '../_components/RatingSummary';
import SpotReviewsPanel from '../_components/SpotReviewsPanel';
import { getSpotDetail } from '@/app/place/lib/singlePlaceAdapter';

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const placeId = Number(id) || 1;

  const data = await getSpotDetail(placeId); // 與後端串接

  // 防呆
  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <p>找不到這個地點</p>
      </div>
    );
  }

  const { spot, reviews } = data;
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
      <Hero spot={spot} photos={spot.photos ?? []} />
      <div className="grid grid-cols-12 gap-6">
        <main className="col-span-12 space-y-6 flex flex-col items-center">
          <div className="flex items-start gap-4 w-full">
            <div className="flex-1">
              <RatingSummary reviews={reviews} />
            </div>
            <div className="flex-1">
              <MetaPanel spot={spot} />
            </div>
          </div>
          <MapSection placeId={placeId} />
          {/* ✅ 改成由 Client 包裹控制送出/Modal/灰階 */}
          <SpotReviewsPanel
            placeId={placeId}
            reviews={reviews}
            currentUserId={30}
          />
        </main>
      </div>
    </div>
  );
}
