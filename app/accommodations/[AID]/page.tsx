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

      {/* <Section className="bg-lgray">
        <InfoArea
          name={data.name}
          address={data.address}
          amenities={data.amenities}
          averageRating={data.reviewSummary.averageRating}
          reviewCount={data.reviewSummary.reviewCount}
        />
        <hr className="w-full text-cg" />
      </Section>

      <Section>
        <DescriptionArea
          description={data.description}
          checkInTime={data.checkInTime}
          checkOutTime={data.checkOutTime}
        />
        <hr className="w-full text-cg" />
      </Section>

      <Section className="bg-lgray">
        <RoomTypesArea roomTypes={data.roomTypes} />
        <hr className="w-full text-cg" />
      </Section>

      <Section>
        <MapArea latitude={data.latitude} longitude={data.longitude} />
        <hr className="w-full text-cg" />
      </Section>

      <Section className="bg-lgray">
        <div id="reviewArea" className="scroll-mt-24"></div>
        <ReviewArea accommodationId={id} />
        <hr className="w-full text-cg" />
      </Section> */}
    </>
  );
}
