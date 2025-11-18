// 文件名: components/BookingInventoryForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 🌟 匯入 Hook
import { useRoomTypeInventory } from '../../_lib/_hooks';
// 💡 請根據您的實際路徑調整

export default function BookingInventoryForm({
  accommodationId,
}: {
  accommodationId: number;
}) {
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState('');
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(
    null
  );

  // 1. 🌟 使用 Hook 查詢可用的房型
  const {
    availableRoomTypes,
    isLoadingRoomTypes: isLoading,
    roomTypeError: error,
  } = useRoomTypeInventory(accommodationId, checkInDate);

  // 2. 排序房型：依照最早有庫存的日期排序 (保留在元件中)
  const sortedRoomTypes = availableRoomTypes.sort((a, b) => {
    // 找出最早有庫存的日期
    const aDate = a.availability.find((a) => a.availableCount > 0)?.date;
    const bDate = b.availability.find((b) => b.availableCount > 0)?.date;
    // 使用 new Date(0) 來處理找不到日期的情況
    return new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomTypeId || !checkInDate) return;

    // 導航到預訂頁面，帶上選定的參數
    router.push(
      `/accommodations/booking?accommodationId=${accommodationId}&roomTypeId=${selectedRoomTypeId}&checkInDate=${checkInDate}`
    );
  };

  // 💡 提示: 這裡可以整合 useDateInventory 來禁用日曆中 checkInDate 前後的日期。

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-8 justify-between "
    >
      {/* 日期欄位 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          入住日期
        </label>
        <input
          type="date"
          value={checkInDate}
          // 重設日期時，也清空已選房型
          onChange={(e) => {
            setCheckInDate(e.target.value);
            setSelectedRoomTypeId(null);
          }}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>

      {/* 房型選單 */}
      {isLoading && checkInDate && (
        <p className="text-sm text-gray-500">
          正在查詢 {checkInDate} 的可用房型...
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">查庫存失敗：{error.message}</p>
      )}
      {/* 根據排序後的房型列表渲染選單 */}
      {sortedRoomTypes.length > 0 ? (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            房型
          </label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={selectedRoomTypeId ?? ''}
            onChange={(e) => setSelectedRoomTypeId(Number(e.target.value))}
          >
            <option value="">
              請選擇房型 ({sortedRoomTypes.length} 種可用)
            </option>
            {sortedRoomTypes.map((rt) => (
              <option key={rt.roomTypeId} value={rt.roomTypeId}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        // 只有在日期選定且載入完成後才顯示無庫存訊息
        checkInDate &&
        !isLoading && (
          <p className="text-sm text-amber-500">
            在 {checkInDate} 沒有可預訂的房型。
          </p>
        )
      )}

      {/* Order Now 按鈕 */}
      <button
        type="submit"
        disabled={!selectedRoomTypeId || !checkInDate || isLoading}
        className={`mt-4 w-full text-white font-semibold py-2 rounded transition-colors ${
          !selectedRoomTypeId || !checkInDate || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-brand hover:bg-brand-dark cursor-pointer'
        }`}
      >
        Order Now
      </button>
    </form>
  );
}
