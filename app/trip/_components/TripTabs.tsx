'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TripTab = 'private' | 'group';

export default function TripTabs() {
  const router = useRouter();
  const [tab, setTab] = useState<TripTab>('private');

  const handleTabChange = (newTab: TripTab) => {
    setTab(newTab);
    if (newTab === 'group') {
      // 導向 M5 模組（揪團行程）- 不修改 M5 程式碼，僅導航
      router.push('/grabgroup/team-up');
    } else if (newTab === 'private') {
      // 導向私人行程（M2 模組）
      router.push('/trip');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-white shadow-sm rounded-full px-1.5 py-1.5 border border-neutral-200">
        <button
          onClick={() => handleTabChange('private')}
          className={`px-8 py-2.5 rounded-full transition-all duration-200 text-sm font-medium min-w-[120px]
            ${
              tab === 'private'
                ? 'bg-[#F6C453] text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
        >
          私人行程
        </button>

        <button
          onClick={() => handleTabChange('group')}
          className={`px-8 py-2.5 rounded-full transition-all duration-200 text-sm font-medium min-w-[120px]
            ${
              tab === 'group'
                ? 'bg-[#F6C453] text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
        >
          揪團行程
        </button>
      </div>
    </div>
  );
}
