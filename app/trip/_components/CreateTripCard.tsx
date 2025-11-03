'use client';
import { useRouter } from 'next/navigation';

export default function CreateTripCard() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/trip/new-trip')}
      className="cursor-pointer w-[303px] h-[250px] rounded-xl border-2 border-dashed border-yellow-orange flex flex-col items-center justify-center text-gray-500 hover:customize_shadow transition"
    >
      <div className="text-5xl mb-2">＋</div>
      <p className="text-lg font-semibold">建立旅行計畫</p>
    </div>
  );
}
