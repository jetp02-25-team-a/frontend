// app/trip/_components/TripHomeClient.tsx
'use client';

import TripUserCard from './TripUserCard';
import TripTabs from './TripTabs';
import TripFilterBar from './TripFilterBar';
import TripCreateCard from './TripCreateCard';
import TripCard from './TripCard';
import type { TripSummary } from './types';

export default function TripHomeClient({
  initialTrips,
}: {
  initialTrips: TripSummary[];
}) {
  return (
    <div className="max-w-6xl mx-auto pt-10 space-y-10">
      <TripUserCard />

      <TripTabs />

      <TripFilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
        <TripCreateCard />

        {initialTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
