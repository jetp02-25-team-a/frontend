'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/config/api-path';
import { addPlaceToTrip } from '../lib/addPlaceToTrip';
import { useAuth } from '@/hooks/use-Auth';

interface Place {
  id: number;
  name: string;
  nameZh?: string;
  address?: string;
  addrFull?: string;
  image?: string;
  heroPhoto?: string;
}

interface AddPlaceToDetailModalProps {
  tripId: number;
  selectedDate: string; // YYYY-MM-DD
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddPlaceToDetailModal({
  tripId,
  selectedDate,
  onClose,
  onSuccess,
}: AddPlaceToDetailModalProps) {
  const { user } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // 搜尋景點
  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    
    setLoading(true);
    try {
      // 使用 M1 的景點搜尋 API
      const res = await fetch(
        `${API_URL}/api/place?q=${encodeURIComponent(searchKeyword.trim())}&type=spot&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('BackpackUserInfo') ? JSON.parse(localStorage.getItem('BackpackUserInfo') || '{}').token : ''}`,
          },
        }
      );
      
      if (!res.ok) throw new Error('搜尋失敗');
      
      const data = await res.json();
      // API 回傳格式：{ success: true, data: [...] }
      const placesData = data.success ? data.data : (Array.isArray(data) ? data : []);
      setPlaces(placesData);
    } catch (err) {
      console.error('搜尋景點失敗:', err);
      alert('搜尋景點失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 選擇景點並加入行程
  const handleSelectPlace = async (place: Place) => {
    if (adding) return;
    
    setAdding(true);
    try {
      // 1. 先加入 TripPlanPlace
      const tripPlanPlace = await addPlaceToTrip(tripId, place.id);
      
      // 2. 建立 TripPlanDetail
      const userInfo = localStorage.getItem('BackpackUserInfo');
      const token = userInfo ? JSON.parse(userInfo).token : '';
      
      // 計算時間（預設：開始時間為當天 09:00，結束時間為 12:00）
      const startDateTime = new Date(`${selectedDate}T09:00:00`);
      const endDateTime = new Date(`${selectedDate}T12:00:00`);
      
      // 取得當天最後一個項目的 order
      const lastOrder = 0; // 可以從 props 傳入或從 API 取得
      
      const detailRes = await fetch(`${API_URL}/api/m2/plan/${tripId}/detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'spot',
          referenceId: tripPlanPlace.id, // TripPlanPlace 的 id
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          stayHour: 3,
          stayMin: 0,
          order: lastOrder,
        }),
      });

      if (!detailRes.ok) {
        const errorText = await detailRes.text();
        throw new Error(errorText || '建立行程明細失敗');
      }

      alert('已成功加入行程！');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('加入行程失敗:', err);
      alert('加入行程失敗：' + (err.message || '未知錯誤'));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-2xl shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">新增景點到行程</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* 搜尋欄 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="搜尋景點名稱..."
            className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchKeyword.trim()}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '搜尋中...' : '搜尋'}
          </button>
        </div>

        {/* 景點列表 */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {places.length === 0 && !loading && (
            <p className="text-sm text-neutral-500 text-center py-8">
              {searchKeyword ? '找不到相關景點，請嘗試其他關鍵字' : '請輸入關鍵字搜尋景點'}
            </p>
          )}

          {places.map((place) => (
            <button
              key={place.id}
              onClick={() => handleSelectPlace(place)}
              disabled={adding}
              className="w-full text-left border border-neutral-200 p-4 rounded-lg hover:bg-neutral-50 hover:border-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium text-neutral-900">
                {place.nameZh || place.name}
              </div>
              {(place.addrFull || place.address) && (
                <div className="text-xs text-neutral-500 mt-1">
                  {place.addrFull || place.address}
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full border border-neutral-300 p-2 rounded-lg text-sm hover:bg-neutral-50"
        >
          取消
        </button>
      </div>
    </div>
  );
}

