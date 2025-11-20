// app/trip/_components/TripSideNav.tsx
'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/config/api-path';

type DetailTab = 'info' | 'packing' | 'expense';

interface Props {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
  tripId?: number;
}

export default function TripSideNav({ active, onChange, tripId }: Props) {
  const [packingCount, setPackingCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);

  // 載入行李清單數量
  useEffect(() => {
    if (tripId) {
      fetch(`${API_URL}/api/m2/packing/${tripId}`)
        .then(r => r.json())
        .then(data => {
          const checked = data.filter((item: any) => item.isChecked).length;
          setPackingCount(checked);
        })
        .catch(() => {});
    }
  }, [tripId]);

  // 載入記帳數量
  useEffect(() => {
    if (tripId) {
      fetch(`${API_URL}/api/m2/expense/trip/${tripId}`)
        .then(r => r.json())
        .then(data => setExpenseCount(data.length || 0))
        .catch(() => {});
    }
  }, [tripId]);

  const navItems = [
    {
      key: 'packing' as DetailTab,
      label: '行李清單',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      count: `${packingCount}/24`,
    },
    {
      key: 'expense' as DetailTab,
      label: '記帳',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: expenseCount.toString(),
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-4">
      {/* 行李清單 */}
      <button
        type="button"
        onClick={() => onChange('packing')}
        className={`flex items-center justify-between p-4 rounded-xl transition-all ${
          active === 'packing'
            ? 'bg-amber-50 border-2 border-amber-400'
            : 'bg-white border-2 border-transparent hover:bg-neutral-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`${active === 'packing' ? 'text-amber-600' : 'text-neutral-700'}`}>
            {navItems[0].icon}
          </div>
          <span className={`font-medium ${active === 'packing' ? 'text-amber-700' : 'text-neutral-700'}`}>
            {navItems[0].label}
          </span>
        </div>
        <span className={`text-sm ${active === 'packing' ? 'text-amber-600' : 'text-neutral-500'}`}>
          {navItems[0].count}
        </span>
      </button>

      {/* 下載PDF */}
      <button
        type="button"
        className="flex items-center gap-3 p-4 rounded-xl bg-white border-2 border-transparent hover:bg-neutral-50 transition-all"
      >
        <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="font-medium text-neutral-700">下載PDF</span>
      </button>

      {/* 記帳 */}
      <button
        type="button"
        onClick={() => onChange('expense')}
        className={`flex items-center justify-between p-4 rounded-xl transition-all ${
          active === 'expense'
            ? 'bg-amber-50 border-2 border-amber-400'
            : 'bg-white border-2 border-transparent hover:bg-neutral-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`${active === 'expense' ? 'text-amber-600' : 'text-neutral-700'}`}>
            {navItems[1].icon}
          </div>
          <span className={`font-medium ${active === 'expense' ? 'text-amber-700' : 'text-neutral-700'}`}>
            {navItems[1].label}
          </span>
        </div>
        <span className={`text-sm ${active === 'expense' ? 'text-amber-600' : 'text-neutral-500'}`}>
          {navItems[1].count}
        </span>
      </button>
    </div>
  );
}
