'use client';
import DestinationCard from './DestinationCard';
import destinations from './destination';

export default function DestinationGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {destinations.map((dest, idx) => (
        <DestinationCard
          key={idx}
          image={dest.image}
          title={dest.title}
          description={dest.description}
        />
      ))}
    </div>
  );
}