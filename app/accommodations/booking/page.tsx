'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '../_lib/_api';
import { useAuth } from '@/hooks/use-Auth';

export default function BookingConfirmPage() {
  const router = useRouter();
  const params = useSearchParams();

  const accommodationId = Number(params.get('accommodationId'));
  const roomTypeId = Number(params.get('roomTypeId'));
  const checkInDate = params.get('checkInDate') ?? '';

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { getAuthHeader } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch(`/m3/bookings`, {
        method: 'POST',
        headers: getAuthHeader() as HeadersInit,
        body: {
          accommodationId,
          checkInDate,
          checkOutDate: new Date(
            new Date(checkInDate).getTime() + 24 * 60 * 60 * 1000
          ).toISOString(),
          guestName,
          guestContact: `${guestEmail} / ${guestPhone}`,
          items: [{ roomTypeId, quantity }],
        },
      });
      alert('訂單已建立成功！');
      router.push('/bookings/success'); // 或導回首頁
    } catch (err) {
      console.error(err);
      alert('建立訂單失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-gray-900">訂購清單</h2>

      {/* 選擇日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          選擇日期
        </label>
        <div className="mt-1 text-gray-900 font-semibold">{checkInDate}</div>
      </div>

      {/* 選擇房型 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          選擇房型
        </label>
        <div className="mt-1 text-gray-900 font-semibold">
          房型 ID：{roomTypeId}
        </div>
      </div>

      {/* 房間數量 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          房間數量
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 w-full border rounded px-2 py-1"
        />
      </div>

      {/* 入住者資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            姓名
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            聯絡電話
          </label>
          <input
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* 按鈕區 */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600"
        >
          {loading ? '送出中...' : '送出'}
        </button>
      </div>
    </form>
  );
}
