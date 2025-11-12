import BookingForm from '../client/BookingForm';

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
  const groupedAmenities = {
    General: amenities.filter((a) => a.type === 'General'),
    Food: amenities.filter((a) => a.type === 'Food'),
    Room: amenities.filter((a) => a.type === 'Room'),
    Other: amenities.filter(
      (a) => !['General', 'Food', 'Room'].includes(a.type)
    ),
  };

  return (
    <div className="w-full flex flex-col lg:flex-row p-8 gap-8">
      {/* 左側資訊區 */}
      <div className="flex-1 flex flex-col gap-6">
        {/* 名稱 + 評分 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{name}</h1>
          <div className="flex items-center gap-2 text-yellow-500">
            <span className="text-lg">⭐ {averageRating.toFixed(1)}</span>
            <span className="text-gray-600">({reviewCount} 則評論)</span>
          </div>
        </div>

        {/* 地址 */}
        <p className="text-gray-700">{address}</p>

        {/* 設施分組 */}
        <div className="flex flex-col gap-4">
          {Object.entries(groupedAmenities).map(([type, list]) =>
            list.length > 0 ? (
              <div key={type}>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  {type === 'General'
                    ? '一般設施'
                    : type === 'Food'
                      ? '餐飲'
                      : type === 'Room'
                        ? '房內設施'
                        : '其他'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((a) => (
                    <span
                      key={a.id}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800"
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

      {/* 右側下訂區 */}
      <div className="w-full lg:w-[320px]">
        <BookingForm />
      </div>
    </div>
  );
}
