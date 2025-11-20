import { notFound } from 'next/navigation';
import TripDetailClient from '../_components/TripDetailClient';
import { getTripPlanDetail } from '../lib/trip_adapter';

export default async function TripDetailPage({ params }) {
  const tripId = Number(params.id);
  if (!Number.isFinite(tripId)) return notFound();

  const data = await getTripPlanDetail(tripId);
  if (!data) return notFound();

  return <TripDetailClient data={data} />;
}
