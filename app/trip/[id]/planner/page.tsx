// app/trip/[id]/planner/page.tsx
import PlannerClient from './PlannerClient';

export default function Page({ params }: { params: { id: string } }) {
  return <PlannerClient tripId={Number(params.id)} />;
}
