import React from 'react';
import Card from './Card';

export default function Grid({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {data.map((p) => (
        <Card
          key={p.id}
          spot={p}
          photo={p.photos?.[0] || 'https://picsum.photos/seed/default/400/300'}
        />
      ))}
    </div>
  );
}
