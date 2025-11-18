'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
// ⚠️ 請確保這些相對路徑在您的專案中是正確的
import { useAuth } from '../../../../hooks/use-Auth';
import { useRoomTypeInventory } from '../../_lib/_hooks';
import { apiFetch } from '../../_lib/_api';
import toast from 'react-hot-toast';

// 預設入住天數和價格假設
const DEFAULT_NIGHTS = 1;
const DEFAULT_PRICE_FALLBACK = 0;

export default function BookingPage() {
  const router = useRouter();

  // 1. 從 URL 參數獲取 accommodationId
  const params = useParams();
  const accommodationIdString = params.AID as string;
  const accommodationId = Number(accommodationIdString);

  // 2. 表單選擇的狀態：日期和房型 ID
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(
    null
  );

  // 3. 預訂人資訊狀態
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { getAuthHeader } = useAuth();

  // 4. 🌟 使用 Hook 查詢可用的房型列表 (依賴 accommodationId 和 checkInDate)
  const { availableRoomTypes, isLoadingRoomTypes, roomTypeError } =
    useRoomTypeInventory(accommodationId, checkInDate);

  // --- 移除 useMemo: 5. 提取已選房型的詳細資訊 (直接計算) ---
  let selectedRoomTypeDetail = null;
  if (selectedRoomTypeId && checkInDate) {
    const roomType = availableRoomTypes.find(
      (rt) => rt.roomTypeId === selectedRoomTypeId
    );
    if (roomType) {
      // 找到該房型在選定日期當天的庫存
      const inventory = roomType.availability.find((a) =>
        a.date.startsWith(checkInDate)
      );
      // 假設房型物件中包含了 price，如果沒有，使用 DEFAULT_PRICE_FALLBACK
      const roomPrice = roomType.basePrice || DEFAULT_PRICE_FALLBACK;

      selectedRoomTypeDetail = {
        name: roomType.name,
        price: roomPrice,
        maxQuantity: inventory?.availableCount ?? 0,
      };
    }
  }

  // 設置 UI 顯示的變數
  const roomName = selectedRoomTypeDetail?.name ?? '請選擇房型';
  const roomPrice = selectedRoomTypeDetail?.price ?? 0;
  const maxQuantity = selectedRoomTypeDetail?.maxQuantity ?? 0;

  // 6. 處理數量狀態：確保數量不超過最大庫存 (useEffect 保留以處理副作用)
  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    } else if (quantity < 1 && maxQuantity >= 1) {
      setQuantity(1);
    }
  }, [maxQuantity, quantity]);

  // --- 移除 useMemo: 7. 計算退房日期和總價 (直接計算) ---
  let checkOutDate = '';
  if (checkInDate) {
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + DEFAULT_NIGHTS);
    checkOutDate = checkIn.toISOString().split('T')[0];
  }

  const totalPrice = roomPrice * quantity * DEFAULT_NIGHTS;

  // 8. 提交處理函數
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !selectedRoomTypeDetail ||
      quantity <= 0 ||
      quantity > maxQuantity ||
      !guestName ||
      !guestEmail
    ) {
      toast('請檢查預訂資訊或庫存是否足夠。');
      setLoading(false);
      return;
    }

    const apiCheckOutDate = new Date(
      new Date(checkInDate).getTime() + DEFAULT_NIGHTS * 24 * 60 * 60 * 1000
    ).toISOString();

    const payload = {
      accommodationId,
      checkInDate,
      checkOutDate: apiCheckOutDate,
      guestName,
      guestContact: `${guestEmail} / ${guestPhone}`,
      items: [{ roomTypeId: selectedRoomTypeId!, quantity }],
    };

    try {
      await apiFetch(`/m3/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        } as HeadersInit,
        body: JSON.stringify(payload),
      });
      toast.success('訂單已建立成功！');
      router.push(`/bookings/success`);
    } catch (err) {
      toast.error('建立訂單失敗');
    } finally {
      setLoading(false);
    }
  };

  // 9. 渲染 UI
  if (!accommodationId || isNaN(accommodationId)) {
    return (
      <div className="text-center text-red-500 p-8">
        ⚠️ 住宿 ID 參數錯誤或缺失。
      </div>
    );
  }

  // --- 移除 useMemo: 決定步驟 2 的顯示內容 (直接計算) ---
  let roomTypeStatusMessage = null;
  if (isLoadingRoomTypes) {
    roomTypeStatusMessage = (
      <p className="text-sm text-blue-500 font-semibold">
        🔍 正在查詢該日期可選房型庫存...
      </p>
    );
  } else if (roomTypeError) {
    roomTypeStatusMessage = (
      <p className="text-sm text-red-500 font-semibold">
        ❌ 載入錯誤：無法查詢庫存，請稍後再試。
      </p>
    );
  } else if (availableRoomTypes.length === 0 && checkInDate) {
    // 確保只有在選了日期後才顯示 "已售罄"
    roomTypeStatusMessage = (
      <p className="text-sm text-yellow-600 font-semibold">
        ⚠️ 該日所有房型皆已售罄，請選擇其他日期。
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl flex flex-col gap-8 my-8"
    >
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3">
        預訂流程
      </h1>

      {/* 🌟 步驟 1: 選擇日期 */}
      <div className="p-5 border-2 border-orange-200 rounded-xl bg-orange-50/50">
        <label
          htmlFor="checkIn"
          className="block text-lg font-bold text-orange-700 mb-3"
        >
          步驟 1: 📅 選擇入住日期
        </label>
        <input
          id="checkIn"
          type="date"
          value={checkInDate}
          onChange={(e) => {
            setCheckInDate(e.target.value);
            setSelectedRoomTypeId(null); // 日期改變，房型選擇重置
          }}
          // 確保使用者只能選今天或之後的日期
          min={new Date().toISOString().split('T')[0]}
          className="w-full border-orange-400 border-2 rounded-lg px-4 py-2 text-gray-900 text-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
          required
        />
        <p className="mt-3 text-sm text-gray-600">
          預計退房日期: {checkOutDate || '待定'}
        </p>
      </div>

      {/* 🌟 步驟 2: 選擇房型 (只有日期選定後才出現) */}
      {checkInDate && (
        <div
          className={`p-5 border-2 rounded-xl transition duration-300 ${roomTypeStatusMessage ? 'border-gray-200' : 'border-green-400 bg-green-50/50'}`}
        >
          <label
            htmlFor="roomType"
            className="block text-lg font-bold text-green-700 mb-3"
          >
            步驟 2: 選擇房型與數量
          </label>

          {roomTypeStatusMessage}

          {/* 只有在沒有狀態訊息（即有可選房型）時才顯示下拉選單 */}
          {!roomTypeStatusMessage && (
            <select
              id="roomType"
              value={selectedRoomTypeId ?? ''}
              onChange={(e) => setSelectedRoomTypeId(Number(e.target.value))}
              className="w-full border-green-500 border-2 rounded-lg px-4 py-2 text-gray-900 text-lg focus:ring-green-600 focus:border-green-600 transition duration-150"
              disabled={isLoadingRoomTypes || availableRoomTypes.length === 0}
              required
            >
              <option value="" disabled>
                請選擇房型...
              </option>
              {availableRoomTypes.map((rt) => (
                <option key={rt.roomTypeId} value={rt.roomTypeId}>
                  {rt.name} (庫存:{' '}
                  {rt.availability.find((a) => a.date.startsWith(checkInDate))
                    ?.availableCount ?? 0}{' '}
                  間)
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* 🌟 步驟 3 & 4: 確認與填寫個人資訊 (只有房型選定後才出現) */}
      {selectedRoomTypeDetail && (
        <>
          <div className="p-5 border-2 border-blue-400 rounded-xl bg-blue-50/50">
            <h2 className="text-lg font-bold text-blue-700 mb-4">
              步驟 3: 訂單確認與數量
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <p className="col-span-2 text-xl font-semibold border-b pb-2">
                房型: {roomName}
              </p>
              <p className="text-green-700 font-bold">
                單晚價格: NT$ {roomPrice.toLocaleString()}
              </p>
            </div>

            {/* 房間數量控制 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                預訂數量 (1 - {maxQuantity})
              </label>
              <input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {quantity > maxQuantity && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ 超過最大可預訂數量 ({maxQuantity})
                </p>
              )}
            </div>
          </div>

          <div className="p-5 border-2 border-purple-400 rounded-xl bg-purple-50/50">
            <h2 className="text-lg font-bold text-purple-700 mb-4">
              步驟 4: 入住者資訊
            </h2>

            {/* 入住者資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  姓名 *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  聯絡電話 (選填)
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 總金額與按鈕 */}
          <div className="text-right pt-4">
            <p className="text-3xl font-extrabold text-gray-900 mb-6">
              總金額：NT$ {totalPrice.toLocaleString()}
            </p>

            <button
              type="submit"
              disabled={
                loading ||
                quantity <= 0 ||
                quantity > maxQuantity ||
                !guestName ||
                !guestEmail
              }
              className="w-full px-8 py-4 rounded-xl bg-brand text-white text-xl font-bold hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? '🚀 訂單處理中...' : '✅ 確認並立即預訂'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
