'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config/api-path';
import Toast from '@/app/place/_components/Toast';

interface City {
  id: number;
  name: string;
  imageUrl?: string | null;
}

type TripTypeOption = 'solo' | 'couple' | 'friends' | 'family';

const TRIP_TYPE_OPTIONS: {
  value: TripTypeOption;
  label: string;
  icon: string;
}[] = [
  { value: 'solo', label: '獨旅', icon: '🚶' },
  { value: 'couple', label: '情侶', icon: '💑' },
  { value: 'friends', label: '朋友', icon: '👥' },
  { value: 'family', label: '家族', icon: '👨‍👩‍👧‍👦' },
];

export default function TripCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tripType, setTripType] = useState<TripTypeOption>('solo');
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  // 載入城市列表
  useEffect(() => {
    async function loadCities() {
      try {
        const r = await fetch(`${API_URL}/api/m2/destinations`, {
          cache: 'no-store',
        });
        const text = await r.text();
        const data = text ? JSON.parse(text) : [];
        setCities(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('載入城市列表失敗:', err);
      } finally {
        setLoadingCities(false);
      }
    }
    loadCities();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setToast({ message: '請輸入行程名稱', type: 'error' });
      return;
    }

    if (!destinationId) {
      setToast({ message: '請選擇目的地', type: 'error' });
      return;
    }

    if (!startDate || !endDate) {
      setToast({ message: '請選擇活動時間', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/m2/trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          type: tripType, // 傳送行程類型
          destinationId: destinationId,
          startDate,
          endDate,
        }),
      });

      const text = await r.text();
      const j = text ? JSON.parse(text) : null;

      if (!r.ok) throw new Error(j?.message || '建立行程失敗');

      const newId = j.data?.id || j.id;
      if (!newId) throw new Error('無法取得行程ID');

      router.push(`/trip/${newId}`);
    } catch (err: any) {
      setToast({ message: err.message || '建立行程失敗', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value ? parseInt(e.target.value) : null;
    setDestinationId(selectedId);
  };

  const selectedCity = cities.find((c) => c.id === destinationId);

  return (
    <main className="min-h-screen bg-white">
      {/* 頁面標題 */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-neutral-900 text-center">
            行程頁面
          </h1>
        </div>
      </div>

      {/* 主要內容 */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 表單卡片 */}
        <div className="bg-white shadow-lg rounded-2xl border border-neutral-100 p-8 md:p-10">
          {/* 表單標題 */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              開始設定您的活動名稱
            </h2>
            <p className="text-sm text-neutral-500">
              編輯你想去的景點和規劃你的行程
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 制定行程名稱 */}
            <div>
              <label className="block text-base font-semibold text-neutral-900 mb-3">
                制定行程名稱
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-neutral-200 rounded-xl px-5 py-3.5 text-base outline-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all"
                placeholder="為您的行程取個名字"
                required
                maxLength={50}
              />
            </div>

            {/* 行程類型 */}
            <div>
              <label className="block text-base font-semibold text-neutral-900 mb-4">
                行程類型
              </label>
              <div className="grid grid-cols-2 gap-4">
                {TRIP_TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTripType(option.value)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md
                      ${
                        tripType === option.value
                          ? 'border-[#F6C453] bg-[#F6C453]/10 shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-[#F6C453]/50'
                      }`}
                  >
                    <div className="text-3xl mb-2">{option.icon}</div>
                    <div
                      className={`text-base font-medium ${
                        tripType === option.value
                          ? 'text-[#F6C453]'
                          : 'text-neutral-700'
                      }`}
                    >
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 目的地 */}
            <div>
              <label className="block text-base font-semibold text-neutral-900 mb-3">
                目的地
              </label>
              {loadingCities ? (
                <div className="w-full border-2 border-neutral-200 rounded-xl px-5 py-3.5 text-neutral-400 text-center">
                  載入中...
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={destinationId || ''}
                    onChange={handleCityChange}
                    className="w-full border-2 border-neutral-200 rounded-xl px-5 py-3.5 text-base outline-none appearance-none bg-white focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all cursor-pointer"
                    required
                  >
                    <option value="">請選擇</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {/* 下拉箭頭 */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}
              {/* 顯示選中的城市圖片 */}
              {selectedCity?.imageUrl && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={selectedCity.imageUrl}
                    alt={selectedCity.name}
                    className="w-24 h-24 object-cover rounded-xl border-2 border-neutral-200"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* 活動時間 */}
            <div>
              <label className="block text-base font-semibold text-neutral-900 mb-4">
                活動時間
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border-2 border-neutral-200 rounded-xl px-5 py-3.5 text-base outline-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all"
                      placeholder="年/月/日"
                      required
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || undefined}
                      className="w-full border-2 border-neutral-200 rounded-xl px-5 py-3.5 text-base outline-none focus:border-[#F6C453] focus:ring-2 focus:ring-[#F6C453]/20 transition-all"
                      placeholder="年/月/日"
                      required
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按鈕 */}
            <div className="flex gap-4 pt-6 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-[#F6C453] text-[#F6C453] font-medium text-base hover:bg-[#F6C453]/5 transition-all duration-200"
              >
                回上一步
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#F6C453] text-white py-3.5 px-6 rounded-xl font-medium text-base shadow-sm hover:shadow-md hover:bg-[#E5B442] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '建立中...' : '下一步'}
              </button>
            </div>
          </form>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={2000}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </main>
  );
}
