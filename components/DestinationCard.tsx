'use client';
import Image from 'next/image';

export default function DestinationCard({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <Image
        src={image}
        alt={title}
        width={30}
        height={30}
        className="object-cover w-full"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <button className="mt-4 text-blue-600 hover:underline">查看</button>
      </div>
    </div>
  );
}
