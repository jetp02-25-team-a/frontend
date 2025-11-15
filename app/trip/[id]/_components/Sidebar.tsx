'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Briefcase, DollarSign, FileText } from 'lucide-react';

interface SidePanelProps {
  tripId: number;
  activeTab: 'info' | 'packing' | 'expense';
  onTabChange: (tab: 'info' | 'packing' | 'expense') => void;
}

export default function SidePanel({
  tripId,
  activeTab,
  onTabChange,
}: SidePanelProps) {
  const [trip, setTrip] = useState<any>(null);

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadTrip() {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
    const API = `${BASE}/api/m2`;

    const res = await fetch(`${API}/trip/${tripId}`, {
      credentials: 'include',
    });
    const json = await res.json();

    if (json.success) setTrip(json.data);
  }

  if (!trip) return <div className="p-4 text-gray-500">載入中...</div>;

  return (
    <div className="space-y-4 w-full">
      {/* 🔶 使用者資訊卡片 */}
      <div className="p-4 bg-white rounded-2xl shadow-md flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/120?img=5"
          className="w-16 h-16 rounded-full object-cover"
          alt="avatar"
        />
        <div>
          <div className="text-xl font-semibold leading-tight">
            {trip.userName || '使用者'}
          </div>
          <div className="text-sm text-gray-500">{trip.title}</div>
        </div>
      </div>

      {/* 🔸 分隔線 */}
      <Separator />

      {/* 🔶 按鈕區塊（整合 Sidebar 的操作） */}
      <PanelButton
        icon={<Briefcase size={18} />}
        label={`行李清單 (${trip.PackingItem?.length ?? 0}/24)`}
        active={activeTab === 'packing'}
        onClick={() => onTabChange('packing')}
      />

      <PanelButton
        icon={<DollarSign size={18} />}
        label={`記帳 (${trip.Expense?.length ?? 0})`}
        active={activeTab === 'expense'}
        onClick={() => onTabChange('expense')}
      />

      {/* 🔸 分隔線 */}
      <Separator />

      {/* 🔶 PDF 下載 */}
      <div
        className="p-4 bg-white rounded-2xl shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => alert('下載 PDF')}
      >
        <div className="flex items-center gap-3 text-gray-800">
          <FileText size={18} />
          <span className="font-medium">下載 PDF</span>
        </div>
      </div>
    </div>
  );
}

/* 小元件 */

function PanelButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl shadow-md flex items-center gap-3 cursor-pointer transition
      ${active ? 'bg-yellow-100 text-yellow-700' : 'bg-white hover:bg-gray-50'}
    `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function Separator() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-24 h-1 bg-pink-300 rounded-full" />
    </div>
  );
}
