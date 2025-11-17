'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../_lib/_api';
import { FetchError } from '../../_types/api';

type RoomTypeInventory = {
  roomTypeId: number;
  name: string;
  availability: { date: string; availableCount: number }[];
};

type AccommodationInventoryResponse = {
  accommodationId: number;
  checkInDate: string;
  checkOutDate: string;
  roomTypes: RoomTypeInventory[];
};

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

  const { data, error, isLoading } = useSWR<
    AccommodationInventoryResponse,
    FetchError
  >(
    checkInDate
      ? `/m3/accommodations/${accommodationId}/weekly-inventories?checkInDate=${checkInDate}`
      : null,
    (endpoint: string) => apiFetch<AccommodationInventoryResponse>(endpoint)
  );

  // 整理出一週內有庫存的房型，依照最早有庫存的日期排序
  const sortedRoomTypes =
    data?.roomTypes
      .filter((rt) => rt.availability.some((a) => a.availableCount > 0))
      .sort((a, b) => {
        const aDate = a.availability.find((a) => a.availableCount > 0)?.date;
        const bDate = b.availability.find((b) => b.availableCount > 0)?.date;
        return new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime();
      }) ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomTypeId || !checkInDate) return;

    router.push(
      `/bookings?accommodationId=${accommodationId}&roomTypeId=${selectedRoomTypeId}&checkInDate=${checkInDate}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-8 justify-between "
    >
      {/* 日期欄位 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">日期</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>

      {/* 房型選單 */}
      {isLoading && <p className="text-sm text-gray-500">載入中...</p>}
      {error && (
        <p className="text-sm text-red-500">查庫存失敗：{error.message}</p>
      )}
      {sortedRoomTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            房型
          </label>
          <select
            className="mt-1 w-full border rounded px-2 py-1"
            value={selectedRoomTypeId ?? ''}
            onChange={(e) => setSelectedRoomTypeId(Number(e.target.value))}
          >
            <option value="">請選擇</option>
            {sortedRoomTypes.map((rt) => (
              <option key={rt.roomTypeId} value={rt.roomTypeId}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Order Now 按鈕 */}
      <button
        type="submit"
        disabled={!selectedRoomTypeId || !checkInDate}
        className="mt-4 w-full bg-brand cursor-pointer text-white font-semibold py-2 rounded"
      >
        Order Now
      </button>
    </form>
  );
}
