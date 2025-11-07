'use client';

interface TripItemCardProps {
  name: string;
  address: string;
  image?: string;
  time: string;
}

export default function TripItemCard({
  name,
  address,
  image = '/covers/default.jpg',
  time,
}: TripItemCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-500">{address}</p>
        <p className="text-xs text-yellow-600 mt-1">{time}</p>
      </div>
    </div>
  );
}
