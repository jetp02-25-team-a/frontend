import React from 'react';
import { spot } from '../lib/fixtures';
import Card from './Card';

export default function Grid() {
  const data = Array.from({ length: 8 }, () => {
    const randomPhoto =
      spot.photos[Math.floor(Math.random() * spot.photos.length)];
    return {
      ...spot,
      randomPhoto,
    };
  });

  return (
    <section className="max-w-6xl mx-auto px-4 mb-12">
      <h3 className="text-lg font-semibold mb-4">🔥 熱門地點</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data.map((p, i) => (
          <Card spot={spot} key={p.id + i} photo={p.randomPhoto} />
        ))}
      </div>
    </section>
  );
}
