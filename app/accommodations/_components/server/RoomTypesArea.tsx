export interface RoomTypesAreaProps {
  roomTypes: any[];
}

export default async function RoomTypesArea({ roomTypes }: RoomTypesAreaProps) {
  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-semibold">房型總覽</h2>
        {roomTypes.map((rt) => (
          <div key={rt.id} className="border p-2 my-2">
            <h3>{rt.name}</h3>
            <p>價格：{rt.basePrice}</p>
            <p>容量：{rt.maxCapacity}</p>
            <div className="flex gap-2">
              {rt.amenities.map((a: any) => (
                <span key={a.id} className="px-2 py-1 bg-gray-100 rounded">
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
