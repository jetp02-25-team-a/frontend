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
  const id = +AID || 0;

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
        {data.reviewSummary.reviewCount > 0 ? (
          // 情況一：有評論，渲染 ReviewArea Client Component
          <>
            <div id="reviewArea" className="scroll-mt-24"></div>
            <ReviewArea
              accommodationId={id}
              initialReviews={data.reviews}
              reviewCount={data.reviewSummary.reviewCount}
            />
            <hr className="w-full text-cg" />
          </>
        ) : (
          // 情況二：無評論，渲染靜態提示
          <p className="p-8 text-gray-500">
            尚無用戶評論。成為第一個分享您入住體驗的人吧！
          </p>
        )}
      </Section>
    </>
  );
}
