import MapArea from '../_components/client/MapArea';
import ReviewArea from '../_components/client/ReviewArea';
import DescriptionArea from '../_components/server/DescriptionArea';
import GalleryArea from '../_components/server/GalleryArea';
import RoomTypesArea from '../_components/server/RoomTypesArea';
import Section from '../_components/server/Section';
import InfoArea from '../_components/server/InfoArea';
import { apiFetch } from '../_lib/_api';
import { AccommodationDTO } from '../_types';
import { buildImageUrl } from '../_lib/_utils';

interface AIDProps {
  params: { AID: string };
}

export default async function AIDPage({ params }: AIDProps) {
  const { AID } = await Promise.resolve(params);
  const id = parseInt(AID, 10); // 確保轉換為整數

  // 檢查是否為 NaN (如 'abc') 或 是否小於等於 0 (如 0 或 -5)
  if (isNaN(id) || id <= 0) {
    // 在 Next.js 或 React 框架中，在服務端組件拋出錯誤會觸發 error.js 或 not-found.js
    throw new Error('Invalid Accommodation ID: Must be a positive integer.');
  }
  const data = await apiFetch<AccommodationDTO>(`/m3/accommodations/${id}`);

  return (
    <>
      <Section>
        <GalleryArea
          images={data.images.map((img) => ({
            ...img,
            url: buildImageUrl(img.url),
          }))}
          title={data.name}
          accommodationId={id}
        />
        <hr className="w-full text-cg" />
      </Section>

      <Section className="bg-lgray">
        <InfoArea
          id={id}
          name={data.name}
          address={data.address}
          amenities={data.amenities}
          averageRating={
            data.reviewSummary.averageRating !== null
              ? Number(data.reviewSummary.averageRating.toFixed(1))
              : null
          }
          reviewCount={data.reviewSummary.reviewCount}
          checkInTime={data.checkInTime}
          checkOutTime={data.checkOutTime}
          contacts={data.contacts}
        />
        <hr className="w-full text-cg" />
      </Section>

      <Section>
        <DescriptionArea description={data.description ?? ''} />
        <hr className="w-full text-cg" />
      </Section>

      <Section className="bg-lgray">
        <RoomTypesArea roomTypes={data.roomTypes} />
        <hr className="w-full text-cg" />
      </Section>

      <Section>
        <MapArea
          id={data.id}
          latitude={data.latitude}
          longitude={data.longitude}
          name={data.name}
          city={data.city}
        />
        <hr className="w-full text-cg" />
      </Section>

      <Section className="bg-lgray">
        <div id="reviewArea" className="scroll-mt-24"></div>
        <ReviewArea
          accommodationId={id}
          initialReviews={data.reviews}
          reviewCount={data.reviewSummary.reviewCount}
        />
        {/* 只有在有評論時才顯示分隔線，或者讓 ReviewArea 自己處理內部樣式 */} 
        {data.reviewSummary.reviewCount > 0 && (
          <hr className="w-full text-cg" />
        )}
      </Section>
    </>
  );
}
