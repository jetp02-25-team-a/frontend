// trip/trip.ts
import type { Trip } from './types/trip';

export const fetchTrips = async (userId: number): Promise<Trip[]> => {
  const res = await fetch(`/api/trips?userId=${userId}`);
  const json = await res.json();
  return json.success ? json.data : [];
};

export const createTrip = async (tripData: Partial<Trip>) => {
  const res = await fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  return await res.json();
};
