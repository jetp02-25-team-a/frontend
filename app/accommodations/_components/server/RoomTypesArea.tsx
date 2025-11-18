import { RoomTypeDTO } from '../../_types';
import RoomCard from '../client/RoomCard';

export interface RoomTypesAreaProps {
  roomTypes: RoomTypeDTO[];
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
