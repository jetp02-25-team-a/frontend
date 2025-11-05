// component product card

'use client';
import React from 'react';
import Image from 'next/image';

type Props = {
  rank: number;
  title: string;
  description: string;
  image: string;
};

export default function ProductCard({
  rank,
  title,
  description,
  image,
}: Props) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-white">
      <div className="text-2xl font-bold text-blue-600">{rank}</div>
      <Image
        src={image}
        alt={title}
        width={80}
        height={80}
        className="rounded-md"
      />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
