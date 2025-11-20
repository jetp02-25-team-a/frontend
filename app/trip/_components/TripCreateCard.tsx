'use client';

import { useRouter } from 'next/navigation';

export default function TripCreateCard() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.push('/trip/create')}
      className="bg-white border-2 border-dashed border-neutral-300 rounded-2xl shadow-sm hover:shadow-md hover:border-[#F6C453] transition-all duration-200 w-full aspect-[16/9] flex flex-col justify-center items-center group"
    >
      <div className="text-5xl text-[#F6C453] mb-3 group-hover:scale-110 transition-transform duration-200">
        ＋
      </div>
      <div className="text-base font-medium text-neutral-600 group-hover:text-[#F6C453] transition-colors">
        建立新行程
      </div>
    </button>
  );
}
