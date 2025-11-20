// app/trip/[id]/TripDetailShell.tsx
'use client';

import { useState } from 'react';
import PackingPanel from '../_components/PackingPanel';
import ExpensePanel from '../_components/ExpensePanel';

type TripMeta = {
  id: number;
  title: string;
  destination?: string | null;
  startDate: string;
  endDate: string;
  type: 'personal' | 'group' | string;
};

type Props = {
  trip: TripMeta;
};

type TabKey = 'plan' | 'packing' | 'expense';

export default function TripDetailShell({ trip }: Props) {
  const [tab, setTab] = useState<TabKey>('plan');

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const dateText = `${start.toLocaleDateString('zh-TW')} - ${end.toLocaleDateString(
    'zh-TW'
  )}`;

  return (
    <main className="min-h-screen bg-[#FFFDF7]">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-[220px,1fr] gap-8">
        {/* 左側 sidebar */}
        <aside className="rounded-3xl bg-white shadow-sm border border-neutral-100 px-5 py-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-200 flex items-center justify-center text-sm">
              🙂
            </div>
            <div>
              <div className="text-sm font-semibold">我的旅程</div>
              <div className="text-xs text-neutral-500 truncate max-w-[120px]">
                {trip.title}
              </div>
            </div>
          </div>

          <nav className="pt-3 space-y-2 text-sm">
            <button
              onClick={() => setTab('plan')}
              className={`w-full text-left rounded-full px-4 py-2 ${
                tab === 'plan'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              行程資訊
            </button>
            <button
              onClick={() => setTab('packing')}
              className={`w-full text-left rounded-full px-4 py-2 ${
                tab === 'packing'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              行李清單
            </button>
            <button
              onClick={() => setTab('expense')}
              className={`w-full text-left rounded-full px-4 py-2 ${
                tab === 'expense'
                  ? 'bg-amber-100 text-amber-700'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              記帳
            </button>
          </nav>
        </aside>

        {/* 右側 main 區塊 */}
        <section className="space-y-6">
          {/* 上方行程 hero */}
          <section className="rounded-3xl bg-white px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex justify-between gap-6">
            <div>
              <p className="text-xs text-neutral-500 mb-1">行程名稱</p>
              <h1 className="text-2xl font-semibold text-neutral-800">
                {trip.title}
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                目的地：{trip.destination || '未指定'}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{dateText}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <span className="rounded-full bg-amber-100 px-4 py-1 text-xs text-amber-700">
                {trip.type === 'group' ? '揪團行程' : '私人行程'}
              </span>
              <div className="flex gap-2">
                <a
                  href={`/trip/${trip.id}/map`}
                  className="rounded-full border border-amber-300 px-4 py-1.5 text-xs text-amber-600 hover:bg-amber-50"
                >
                  查看地圖
                </a>
                <a
                  href={`/trip/${trip.id}/edit`}
                  className="rounded-full bg-amber-400 px-4 py-1.5 text-xs text-white hover:bg-amber-500"
                >
                  編輯行程
                </a>
              </div>
            </div>
          </section>

          {/* 中間 Tab 內容 */}
          <section className="rounded-3xl bg-white px-6 py-6 shadow-[0_8px_24px_rgba(0,0,0,0.02)]">
            {tab === 'plan' && (
              <div className="text-sm text-neutral-600">
                {/* 這裡你可以放更詳細的行程內容（目前先留空） */}
                <p>這裡可以放行程明細、每日景點、住宿等等。</p>
                <p className="mt-2 text-xs text-neutral-400">
                  （之後可以把你原本 TripDetail 的內容搬進來）
                </p>
              </div>
            )}

            {tab === 'packing' && <PackingPanel tripId={trip.id} />}

            {tab === 'expense' && <ExpensePanel tripId={trip.id} />}
          </section>
        </section>
      </div>
    </main>
  );
}
