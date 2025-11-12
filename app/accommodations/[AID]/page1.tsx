import Section from '../_components/server/Section';
import GalleryRatio from '../_components/client/Gallery';
import Detailbar from '../_components/client/Detailbar';

interface AIDProps {
  params: { AID: string };
}

const MOCK_USER_ID = 999;

// 引入所有需要的資料 Fetcher
import {
  accDetail_fetcher,
  accGallery_fetcher,
  accReview_fetcher,
  accFavorite_fetcher,
} from '../_lib/data';

// 引入介面
import {
  AccommodationCoreDetails,
  GalleryImage,
  AccommodationReviewsData,
} from '../_types';

export default async function AIDPage({ params }: AIDProps) {
  const { AID } = await params;
  const id = +AID || 0;
  // 1. 發送所有請求的 Promise
  const corePromise = accDetail_fetcher(id);
  const galleryPromise = accGallery_fetcher(id);
  const reviewPromise = accReview_fetcher(id);
  const favoritePromise = accFavorite_fetcher(id, MOCK_USER_ID); // 👈 收藏請求並行

  // 2. 使用 Promise.all() 並行等待所有請求完成
  const [coreData, images, reviewsData, isFavorited] = await Promise.all([
    // 👈 解構 isFavorited
    corePromise,
    galleryPromise,
    reviewPromise,
    favoritePromise, // 👈 收藏 Promise
  ]);

  if (!coreData) {
    return (
      <Section>
        <div className="text-center py-20">
          抱歉，找不到 ID 為 {id} 的住宿點。
        </div>
      </Section>
    );
  }

  // 類型斷言 (如果需要，但由於 Promise.all 結構固定，通常可以直接結構賦值)
  const castedReviewsData = reviewsData as AccommodationReviewsData;
  const castedImages = images as GalleryImage[];
  return (
    <>
      <Section>
        <div className="w-full px-8 flex justify-center">
          <GalleryRatio className="w-full aspect-5/2" />
        </div>
        <Detailbar
          title={coreData.name}
          isFavorited={isFavorited}
          accommodationId={id}
        />
        <hr className="w-full text-cg" />
      </Section>
    </>
  );
}
