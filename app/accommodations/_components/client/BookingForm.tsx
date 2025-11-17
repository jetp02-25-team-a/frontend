'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { apiFetch } from '../../_lib/_api';
import { FetchError } from '../../_types/api';

type InventoryResponse = {
  roomTypeId: number;
  checkInDate: string;
  checkOutDate: string;
  availability: { date: string; availableCount: number }[];
};

type BookingResponse = {
  id: number;
  status: string;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestContact: string;
  items: { roomTypeId: number; quantity: number; unitPrice: number }[];
  totalAmount: number;
};

interface BookingFormProps {
  accommodationId: number; // 父層傳進來
}
export default function BookingForm({ accommodationId }: BookingFormProps) {
  const [checkInDate, setCheckInDate] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [quantity, setQuantity] = useState(1);

  // 🎯 SWR 查庫存
  const {
    data: inventory,
    error,
    isLoading,
    mutate,
  } = useSWR<InventoryResponse, FetchError>(
    checkInDate && roomTypeId
      ? `/m3/room-type/${roomTypeId}/weekly-inventories`
      : null,
    (endpoint) => apiFetch<InventoryResponse>(endpoint)
  );

  // 🎯 建立訂單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const booking = await apiFetch<BookingResponse>('/m3/bookings', {
        method: 'POST',
        body: {
          accommodationId,
          checkInDate,
          checkOutDate: new Date(
            new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
          guestName,
          guestContact,
          items: [{ roomTypeId: Number(roomTypeId), quantity }],
        },
      });
      alert(`訂單建立成功！ID: ${booking.id}`);
      // 可選：重新整理庫存
      mutate();
    } catch (err) {
      console.error(err);
      alert('建立訂單失敗');
    }
  };

  return (
    <div className="w-full border rounded-lg p-4 bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Booking</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 入住日期 */}
        <div>
          <label className="block text-sm font-medium">入住日期</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>

        {/* 房型 */}
        <div>
          <label className="block text-sm font-medium">房型 ID</label>
          <input
            type="number"
            value={roomTypeId}
            onChange={(e) => setRoomTypeId(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>

        {/* 顯示庫存 */}
        {isLoading && <p className="text-sm text-gray-500">載入庫存中...</p>}
        {error && (
          <p className="text-sm text-red-500">查庫存失敗: {error.message}</p>
        )}
        {inventory && (
          <div className="text-sm text-gray-700">
            <h3 className="font-semibold mb-1">一週內庫存：</h3>
            <ul className="list-disc pl-5">
              {inventory.availability.map((a, idx) => (
                <li key={idx}>
                  {new Date(a.date).toLocaleDateString()}：{a.availableCount} 間
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 訂單資訊 */}
        <div>
          <label className="block text-sm font-medium">入住人姓名</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">聯絡方式</label>
          <input
            type="text"
            value={guestContact}
            onChange={(e) => setGuestContact(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">房間數量</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>

        {/* 提交按鈕 */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          建立訂單
        </button>
      </form>
    </div>
  );
}
