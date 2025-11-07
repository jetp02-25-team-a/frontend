import { NextResponse } from 'next/server';
import { mockTrips } from '@/app/trip/[id]/data/mockTrips';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const trip = mockTrips.find((t) => String(t.id) === params.id);

  if (!trip) {
    return NextResponse.json(
      { success: false, message: '找不到行程' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: trip });
}
