import React from 'react';
import Card from './Card';

export default function Grid({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {data.map((p, idx) => {
        const key =
          p?.id ?? p?.place_id ?? `${p?.type ?? 'x'}-${p?.name ?? 'n'}-${idx}`;

        const first =
          Array.isArray(p?.photos) && p.photos.length
            ? (typeof p.photos[0] === 'string'
                ? p.photos[0]
                : p.photos[0]?.url) || ''
            : '';

        const cover = first || 'https://picsum.photos/seed/default/400/300';

        return <Card key={key} spot={p} photo={cover} />;
      })}
    </div>
  );
}
