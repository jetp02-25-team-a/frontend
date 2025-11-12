import MapArea from '../_components/client/MapArea';
import ReviewArea from '../_components/client/ReviewArea';
import DescriptionArea from '../_components/server/DescriptionArea';
import GalleryArea from '../_components/server/GalleryArea';
import RoomTypesArea from '../_components/server/RoomTypesArea';
import TitleArea from '../_components/server/TitleArea';
import Section from '../_components/server/Section';
import InfoArea from '../_components/server/InfoArea';

interface AIDProps {
  params: { AID: string };
}

export default async function AIDPage({ params }: AIDProps) {
  const { AID } = params;
  const id = +AID || 0;

  const mockData = {
    images: [
      {
        id: 1,
        url: 'https://picsum.photos/id/684/800/600',
        caption: '自由廣場主圖',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        id: 2,
        url: 'https://picsum.photos/id/613/800/600',
        caption: '現代建築',
        isPrimary: false,
        sortOrder: 2,
      },
      {
        id: 3,
        url: 'https://picsum.photos/id/681/800/600',
        caption: '歷史建築',
        isPrimary: false,
        sortOrder: 3,
      },
      {
        id: 4,
        url: 'https://picsum.photos/id/134/800/600',
        caption: '夜景街道',
        isPrimary: false,
        sortOrder: 4,
      },
      {
        id: 5,
        url: 'https://picsum.photos/id/1025/800/600',
        caption: '房間內部',
        isPrimary: false,
        sortOrder: 5,
      },
      {
        id: 6,
        url: 'https://picsum.photos/id/1035/800/600',
        caption: '早餐區',
        isPrimary: false,
        sortOrder: 6,
      },
    ],
    name: '圓山超極無敵宇宙大飯店',
    address: '106台北市大安區復興南路一段390號2樓',
    amenities: [
      { id: 1, name: '免費 WiFi', type: 'General' },
      { id: 2, name: '健身房', type: 'General' },
      { id: 3, name: '早餐供應', type: 'Food' },
      { id: 4, name: '迷你吧', type: 'Room' },
      { id: 5, name: '空調', type: 'Room' },
      { id: 6, name: '24 小時櫃檯', type: 'General' },
      { id: 7, name: '電梯', type: 'General' },
      { id: 8, name: '浴缸', type: 'Room' },
      { id: 9, name: '咖啡機', type: 'Room' },
      { id: 10, name: '餐廳', type: 'Food' },
    ],
    reviewSummary: {
      averageRating: 4.8,
      reviewCount: 34,
    },
    description:
      '圓山超極無敵宇宙大飯店位於台北市中心，步行 5 分鐘即可抵達捷運站。飯店提供現代化設施與舒適客房，適合商務與休閒旅客。每日供應中西式早餐，並設有健身房與 24 小時櫃檯服務。',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    roomTypes: [
      {
        id: 1,
        name: '標準雙人房',
        price: 3200,
        maxGuests: 2,
        amenities: [
          { id: 2, name: '空調', type: 'Room' },
          { id: 3, name: '迷你吧', type: 'Room' },
        ],
      },
      {
        id: 2,
        name: '豪華家庭房',
        price: 5200,
        maxGuests: 4,
        amenities: [
          { id: 2, name: '空調', type: 'Room' },
          { id: 4, name: '浴缸', type: 'Room' },
          { id: 5, name: '咖啡機', type: 'Room' },
        ],
      },
      {
        id: 3,
        name: '商務套房',
        price: 6800,
        maxGuests: 2,
        amenities: [
          { id: 2, name: '空調', type: 'Room' },
          { id: 3, name: '迷你吧', type: 'Room' },
          { id: 5, name: '咖啡機', type: 'Room' },
        ],
      },
    ],
    latitude: 25.033,
    longitude: 121.543,
  };

  const mockFavorite = {
    isFavorite: true,
  };
  return (
    <>
      <Section>
        <GalleryArea
          images={mockData.images}
          title={mockData.name}
          isFavorited={mockFavorite.isFavorite}
          accommodationId={id}
        />
        <hr className="w-full text-cg" />
      </Section>
      <Section className="bg-lg">
        <InfoArea
          name={mockData.name}
          address={mockData.address}
          amenities={mockData.amenities}
          averageRating={mockData.reviewSummary.averageRating}
          reviewCount={mockData.reviewSummary.reviewCount}
        />
        <hr className="w-full text-cg" />
      </Section>
      <Section>
        <DescriptionArea
          description={mockData.description}
          checkInTime={mockData.checkInTime}
          checkOutTime={mockData.checkOutTime}
        />
        <hr className="w-full text-cg" />
      </Section>
      <Section className="bg-lg">
        <RoomTypesArea roomTypes={mockData.roomTypes} />
        <hr className="w-full text-cg" />
      </Section>
      <Section>
        <MapArea latitude={mockData.latitude} longitude={mockData.longitude} />
        <hr className="w-full text-cg" />
      </Section>
      <Section className="bg-lg">
        <ReviewArea accommodationId={id} />
        <hr className="w-full text-cg" />
      </Section>
    </>
  );
}
