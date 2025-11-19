import {
  FaEnvelope,
  FaFacebook,
  FaGlobe,
  FaLine,
  FaPhone,
  FaStar,
} from 'react-icons/fa6';
import BookingInventoryForm from '../client/BookingInventoryForm';
import ScrollLink from '../client/ScrollLink';

interface Amenity {
  id: number;
  name: string;
  type: string;
}

interface Contact {
  id: number;
  type: string;
  value: string;
}

interface InfoAreaProps {
  id: number;
  name: string;
  address: string;
  amenities: Amenity[];
  averageRating: number | null;
  reviewCount: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  contacts: Contact[];
}

export default function InfoArea({
  id,
  name,
  address,
  amenities,
  averageRating,
  reviewCount,
  checkInTime,
  checkOutTime,
  contacts,
}: InfoAreaProps) {
  // 動態分組
  const groupedAmenities = amenities.reduce<Record<string, Amenity[]>>(
    (acc, a) => {
      const key = a.type || '其他';
      if (!acc[key]) acc[key] = [];
      acc[key].push(a);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col lg:flex-row gap-24 w-full px-32 relative">
      {/* 左側資訊區 */}
      <div className="flex-1 flex flex-col gap-10">
        {/* 上半區塊：三欄 */}
        <div className="grid grid-cols-5 gap-8">
          {/* 名稱 / 地址 / 入退房 → 佔 2 欄 */}
          <div className="col-span-2 flex flex-col gap-2 text-left">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-gray-600">{address}</p>
            <div className="flex flex-col text-sm text-gray-500">
              <span>入住時間：{checkInTime ?? '—'}</span>
              <span>退房時間：{checkOutTime ?? '—'}</span>
            </div>
          </div>

          {/* 聯絡資訊 → 佔 1 欄 */}
          <div className="col-span-2 flex flex-col gap-2 text-sm text-left">
            {contacts.map((c) => {
              const baseClass =
                'flex items-center gap-2 px-3 py-1 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100';
              switch (c.type) {
                case 'Phone':
                  return (
                    <a key={c.id} href={`tel:${c.value}`} className={baseClass}>
                      <FaPhone className="text-blue-500" /> {c.value}
                    </a>
                  );
                case 'Email':
                  return (
                    <a
                      key={c.id}
                      href={`mailto:${c.value}`}
                      className={baseClass}
                    >
                      <FaEnvelope className="text-blue-500" /> {c.value}
                    </a>
                  );
                case 'Website':
                  return (
                    <a
                      key={c.id}
                      href={c.value}
                      target="_blank"
                      className={baseClass}
                    >
                      <FaGlobe className="text-blue-500" /> 網站
                    </a>
                  );
                case 'Line':
                  return (
                    <span key={c.id} className={baseClass}>
                      <FaLine className="text-green-500" /> {c.value}
                    </span>
                  );
                case 'Facebook':
                  return (
                    <a
                      key={c.id}
                      href={c.value}
                      target="_blank"
                      className={baseClass}
                    >
                      <FaFacebook className="text-blue-700" /> Facebook
                    </a>
                  );
                default:
                  return (
                    <span key={c.id} className={baseClass}>
                      {c.type}: {c.value}
                    </span>
                  );
              }
            })}
          </div>

          {/* 評分與評論 → 佔 1 欄 */}
          <div className="col-span-1 flex flex-col gap-2 text-left items-end">
            <div className="text-xl font-semibold flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span className="text-gray-900">
                {averageRating !== null ? averageRating.toFixed(1) : '尚無評分'}
              </span>
            </div>
            <ScrollLink reviewCount={reviewCount} targetId="reviewArea" />
          </div>
        </div>
        <hr className="w-full text-cgray" />
        {/* 設施分組 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {Object.entries(groupedAmenities).map(([type, list]) => (
            <div key={type} className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
              <div className="flex flex-wrap gap-3">
                {list.map((a) => (
                  <span
                    key={a.id}
                    className="px-4 py-1.5 rounded-full text-sm font-medium select-none border bg-blue-50 text-blue-700"
                  >
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右側 BookingForm */}
      <div className="w-[320px] lg:sticky lg:top-24 self-start">
        <div className="h-full flex flex-col gap-4">
          <BookingInventoryForm accommodationId={id} />
        </div>
      </div>
    </div>
  );
}
