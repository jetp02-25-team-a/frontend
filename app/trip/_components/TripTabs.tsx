'use client';

import { useState } from 'react';

type TripTab = 'private' | 'group';

export default function TripTabs() {
  const [tab, setTab] = useState<TripTab>('private');

  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-white shadow-sm rounded-full px-1.5 py-1.5 border border-neutral-200">
        <button
          onClick={() => setTab('private')}
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
          onClick={() => setTab('group')}
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
