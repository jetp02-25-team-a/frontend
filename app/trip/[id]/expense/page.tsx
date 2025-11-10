'use client';
import ExpensePanel from './ExpensePanel';
import { useParams } from 'next/navigation';

export default function ExpensePage() {
  const { id } = useParams();
  const tripPlanId = Number(id);
  return (
    <div className="px-10 py-8 bg-[#F7F7F7] min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-10 text-gray-800">
        記帳
      </h1>
      <ExpensePanel tripPlanId={tripPlanId} />
    </div>
  );
}
