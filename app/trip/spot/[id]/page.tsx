import Hero from '../../../place/place-info/[id]/page';
import MetaPanel from '../../../place/place-info/_components/MetaPanel';
import MapSection from '../../../place/place-info/_components/MapSection';
import RatingSummary from '../../../place/place-info/_components/RatingSummary';
import SpotReviewsPanel from '../../../place/place-info/_components/SpotReviewsPanel';

import { getSpotDetail } from '@/app/place/lib/singlePlaceAdapter';
import AddToTripButton from './AddToTripButton';

export default async function TripSpotPage({
  params,
}: {
  params: Promise<{ id: string }>;  // 定義為 Promise
}) {
  const { id } = await params;  // await params
  const placeId = Number(id);
  const data = await getSpotDetail(placeId);

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
      {/* Hero + 加入行程按鈕 */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <Hero spot={spot} photos={spot.photos ?? []} />
        </div>

        <div className="shrink-0">
          <AddToTripButton spotId={placeId} />
        </div>
      </div>

      {/* 內容區塊 */}
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

          {/* 地圖 */}
          <MapSection placeId={placeId} />

          {/* 評論面板 */}
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
