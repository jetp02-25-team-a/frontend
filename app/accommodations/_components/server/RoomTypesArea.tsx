export interface RoomType {
  id: number;
  name: string;
  price: number;
  maxGuests: number;
  amenities: { id: number; name: string; type: string }[];
}

export interface RoomTypesAreaProps {
  roomTypes: RoomType[];
}

function RoomCard({ room }: { room: RoomType }) {
  return (
    <div className="w-full h-full border rounded-lg shadow bg-white p-6 flex flex-col gap-10">
      {/* 房型名稱 */}
      <h3 className="text-xl font-bold">{room.name}</h3>

      {/* 價格 + 人數 */}
      <div className="flex justify-between text-gray-700">
        <span>NT$ {room.price}</span>
        <span>最多 {room.maxGuests} 人</span>
      </div>

      <hr className="w-full text-cgray" />

      {/* 房型設施 */}
      <div className="flex flex-wrap gap-4">
        {room.amenities.map((a) => (
          <span
            key={a.id}
            className="px-5 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700"
          >
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function RoomTypesArea({ roomTypes }: RoomTypesAreaProps) {
  return (
    <div className="w-full px-32 flex flex-col gap-8">
      <h2 className="text-2xl font-semibold">房型總覽</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {roomTypes.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
