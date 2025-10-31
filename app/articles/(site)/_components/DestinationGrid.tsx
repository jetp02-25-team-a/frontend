'use client';
import React, { useEffect, useState } from 'react';

interface Destination {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
}

export default function DestinationGrid() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/destinations')
      .then((res) => res.json())
      .then(setDestinations);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {destinations.map((d) => (
        <div key={d.id} className="border rounded-lg shadow-md overflow-hidden">
          <img src={d.imageUrl} alt={d.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-bold">{d.title}</h3>
            <p className="text-sm text-gray-500">{d.location}</p>
            <p className="mt-2 text-gray-700">{d.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}











// 'use client';
// import DestinationCard from './DestinationCard';
// import destinations from '../data/destination';

// export default function DestinationGrid() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {destinations.map((dest, idx) => (
//         <DestinationCard
//           key={idx}
//           image={dest.image}
//           title={dest.title}
//           description={dest.description}
//         />
//       ))}
//     </div>
//   );
// }
