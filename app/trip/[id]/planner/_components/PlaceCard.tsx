'use client';

import Image from 'next/image';

interface PlaceCardProps {
  name: string;
  image: string;
  rating?: number;
  category?: '行程' | '住宿';
}

export default function PlaceCard({
  name,
  image,
  rating = 4.5,
  category = '行程',
}: PlaceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer">
      <div className="relative w-full h-48">
        <Image
          src={image || '/covers/default.jpg'}
          alt={name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
          {category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">{name}</h3>
          <div className="flex items-center gap-1 text-yellow-500">
            ⭐
            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
