import { FaStar } from 'react-icons/fa6';
import BookingForm from '../client/BookingForm';
import Link from 'next/link';
import ScrollLink from '../client/ScrollLink';

interface Amenity {
  id: number;
  name: string;
  type: 'General' | 'Food' | 'Room' | string;
}

interface InfoAreaProps {
  name: string;
  address: string;
  amenities: Amenity[];
  averageRating: number;
  reviewCount: number;
}

export default function InfoArea({
  name,
  address,
  amenities,
  averageRating,
  reviewCount,
}: InfoAreaProps) {
  // 動態分組
  const groupedAmenities = amenities.reduce<Record<string, Amenity[]>>(
    (acc, a) => {
      if (!acc[a.type]) acc[a.type] = [];
      acc[a.type].push(a);
      return acc;
    },
    {}
  );

  // 樣式 map + fallback
  const typeStyleMap: Record<string, { label: string; color: string }> = {
    General: { label: '一般設施', color: 'bg-blue-100 text-blue-800' },
    Food: { label: '餐飲', color: 'bg-green-100 text-green-800' },
    Room: { label: '房內設施', color: 'bg-purple-100 text-purple-800' },
  };
  const defaultStyle = { color: 'bg-white text-gray-800' };

  return (
    <div className="flex flex-col lg:flex-row gap-24 w-full px-16 relative">
      {/* 左側資訊區 */}
      <div className="flex-1 flex flex-col gap-10">
        {/* 名稱 + 評分 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{name}</h1>
            <p className="text-gray-700 mt-1">{address}</p>
          </div>
          <div className="text-right flex flex-col gap-2">
            <div className="text-lg font-semibold flex justify-center items-center gap-4">
              <FaStar className="text-yellow-400" />
              <span className="text-black">{averageRating}</span>
            </div>
            <ScrollLink reviewCount={reviewCount} targetId="reviewArea" />
          </div>
        </div>
        <hr className="w-full text-cg" />
        {/* 設施分組 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {Object.entries(groupedAmenities).map(([type, list]) =>
            list.length > 0 ? (
              <div key={type} className="flex flex-col gap-8">
                <h3 className="text-xl font-semibold">
                  {typeStyleMap[type]?.label || type}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {list.map((a) => (
                    <span
                      key={a.id}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium select-none ${
                        typeStyleMap[type]?.color || defaultStyle.color
                      }`}
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* 右側 BookingForm 暫位 */}
      <div className="w-full lg:w-[320px] h-[400px] lg:sticky lg:top-24 self-start">
        <div className="h-full border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold mb-2">Booking</h2>
          <div className="text-gray-500 text-sm">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
