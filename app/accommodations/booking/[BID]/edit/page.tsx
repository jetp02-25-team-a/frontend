'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/hooks/use-Auth';
import toast from 'react-hot-toast';
import { apiFetch } from '../../../_lib/_api';
import { useRoomTypeInventory } from '../../../_lib/_hooks';

// ---------------------------
// 類型定義
// ---------------------------

interface BookingItem {
  roomTypeId: number;
  quantity: number;
}

// 修正類型定義以符合 API 常見的巢狀結構
interface BookingDetailToEdit {
  id: number;
  // accommodationId: number; // ❌ 刪除，改從 Accommodation 提取
  checkInDate: string; // ISO 格式
  checkOutDate: string; // ISO 格式
  guestName: string;
  guestContact: string; // "email / phone" 格式
  Items: BookingItem[]; // 預訂的房型項目列表
  Accommodation: {
    id: number; // ✅ 住宿 ID 應該在這裡
    name: string;
  };
}

// ---------------------------
// 常數
// ---------------------------

const DEFAULT_NIGHTS = 1;
const DEFAULT_PRICE_FALLBACK = 0;

// ---------------------------
// 輔助函式
// ---------------------------

// 將 ISO 日期轉換為 YYYY-MM-DD (適用於 input type="date")
const toDateInputValue = (isoDate: string) =>
  isoDate ? isoDate.split('T')[0] : '';

// ---------------------------
// 主要元件
// ---------------------------

export default function BookingEditPage() {
  const router = useRouter();
  const params = useParams();

  // 1. 從 URL 參數獲取 orderId (BID)
  const orderIdString = params.BID as string;
  const orderId = Number(orderIdString);

  // 2. 住宿 ID 必須在載入訂單詳情時取得
  const [accommodationId, setAccommodationId] = useState<number | null>(null);

  // 3. 表單選擇的狀態
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | null>(
    null
  );

  // 4. 預訂人資訊狀態
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { getAuthHeader } = useAuth();

  // 5. 🌟 使用 Hook 查詢可用的房型列表 (依賴 accommodationId 和 checkInDate)
  // 只有當 accommodationId 設置後，Hook 才會開始查詢
  const { availableRoomTypes, isLoadingRoomTypes, roomTypeError } =
    useRoomTypeInventory(accommodationId!, checkInDate);

  // 6. 載入現有訂單資料
  const fetchBookingDetail = useCallback(async () => {
    if (isNaN(orderId) || orderId <= 0) {
      setFetchError('訂單 ID 格式錯誤或缺失。');
      setInitialLoading(false);
      return;
    }

    try {
      // 確保使用修正後的 BookingDetailToEdit 類型
      const detail = await apiFetch<BookingDetailToEdit>(
        `/m3/bookings/${orderId}`,
        {
          headers: getAuthHeader() as HeadersInit,
        }
      );

      // --- 初始化狀態 ---

      // ✅ 修正點: 從 Accommodation 巢狀物件中獲取 ID
      const accommodationIdFromDetail = detail.Accommodation?.id;
      if (!accommodationIdFromDetail) {
        throw new Error('API 響應中缺少 Accommodation ID。');
      }
      setAccommodationId(accommodationIdFromDetail); // <-- 關鍵: 設置 AID

      const initialCheckInDate = toDateInputValue(detail.checkInDate);
      setCheckInDate(initialCheckInDate);

      const initialItem = detail.Items[0]; // 假設只允許編輯單一房型
      setSelectedRoomTypeId(initialItem?.roomTypeId ?? null);
      setQuantity(initialItem?.quantity ?? 1);

      // 解析 guestContact
      const contactParts = detail.guestContact.includes(' / ')
        ? detail.guestContact.split(' / ')
        : ['', detail.guestContact];
      setGuestName(detail.guestName);
      setGuestEmail(contactParts[0].trim());
      setGuestPhone(contactParts[1].trim() || '');

      toast.success('現有訂單資料已載入。');
    } catch (err: any) {
      console.error('載入現有訂單詳情失敗:', err);
      if (err.status === 404) {
        setFetchError('找不到此訂單。');
      } else if (err.message?.includes('Accommodation ID')) {
        // 處理我們自己拋出的錯誤
        setFetchError(err.message);
      } else {
        setFetchError('無法載入現有訂單詳情，請確認權限或網路。');
      }
    } finally {
      setInitialLoading(false);
    }
  }, [orderId, getAuthHeader]);

  useEffect(() => {
    fetchBookingDetail();
    // 依賴項為 [fetchBookingDetail]，確保只執行一次載入
  }, [fetchBookingDetail]);

  // 7. 提取已選房型的詳細資訊 (直接計算)
  let selectedRoomTypeDetail = null;
  if (selectedRoomTypeId && checkInDate) {
    const roomType = availableRoomTypes.find(
      (rt) => rt.roomTypeId === selectedRoomTypeId
    );
    if (roomType) {
      const inventory = roomType.availability.find((a) =>
        a.date.startsWith(checkInDate)
      );
      const roomPrice = roomType.basePrice || DEFAULT_PRICE_FALLBACK;

      selectedRoomTypeDetail = {
        name: roomType.name,
        price: roomPrice,
        // 庫存從 Hook 中獲取
        maxQuantity: inventory?.availableCount ?? 0,
      };
    }
  }

  // 設置 UI 顯示的變數
  const roomName = selectedRoomTypeDetail?.name ?? '請選擇房型';
  const roomPrice = selectedRoomTypeDetail?.price ?? 0;
  const maxQuantity = selectedRoomTypeDetail?.maxQuantity ?? 0;

  // 8. 處理數量狀態：確保數量不超過最大庫存
  useEffect(() => {
    if (quantity > maxQuantity) {
      setQuantity(maxQuantity);
    } else if (quantity < 1 && maxQuantity >= 1) {
      setQuantity(1);
    }
  }, [maxQuantity, quantity]);

  // 9. 計算退房日期和總價
  let checkOutDate = '';
  let apiCheckOutDate = '';
  if (checkInDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = addDays(checkIn, DEFAULT_NIGHTS);
    checkOutDate = format(checkOut, 'yyyy-MM-dd'); // 顯示用
    // 提交 API 用，確保是 ISO 格式，但取前 10 位 YYYY-MM-DD 比較安全，
    // 因為 checkInDate 來自 input type="date"，是 YYYY-MM-DD
    apiCheckOutDate = checkOutDate;
  }

  const totalPrice = roomPrice * quantity * DEFAULT_NIGHTS;

  // 10. 提交處理函數 (使用 PATCH)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedRoomTypeDetail || quantity <= 0 || !guestName || !guestEmail) {
      toast('請檢查所有預訂資訊是否完整。');
      setLoading(false);
      return;
    }

    // 再次檢查庫存是否足夠
    if (quantity > maxQuantity) {
      toast.error(`選定房型最大庫存為 ${maxQuantity} 間，請減少數量。`);
      setLoading(false);
      return;
    }

    // 確保 checkOutDate 有值
    if (!apiCheckOutDate) {
      toast.error('請選擇入住日期。');
      setLoading(false);
      return;
    }

    const payload = {
      // accommodationId 不變，但在 payload 中不需要重複傳遞
      checkInDate,
      checkOutDate: apiCheckOutDate,
      guestName,
      guestContact: `${guestEmail} / ${guestPhone}`,
      items: [{ roomTypeId: selectedRoomTypeId!, quantity }],
    };

    try {
      // 使用 PATCH 方法更新訂單
      await apiFetch(`/m3/bookings/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        } as HeadersInit,
        body: JSON.stringify(payload),
      });
      toast.success(`訂單 #${orderId} 已成功更新！`);
      // 跳轉回訂單詳情頁
      router.push(`/accommodations/booking/${orderId}`);
    } catch (err) {
      console.error('更新訂單失敗:', err);
      toast.error('更新訂單失敗，請檢查資料或稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  // 11. 渲染 UI
  if (initialLoading) {
    return (
      <div className="text-center text-blue-500 p-8 text-xl">
        載入現有訂單資料中...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center text-red-500 p-8 text-xl">
        錯誤: {fetchError}
      </div>
    );
  }

  if (!accommodationId || isNaN(accommodationId)) {
    return (
      <div className="text-center text-red-500 p-8 text-xl">
        ⚠️ 訂單載入異常：未找到關聯的住宿 ID。
      </div>
    );
  }

  // --- 決定步驟 2 的顯示內容 (與建立頁相同) ---
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
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-3 flex justify-between items-center">
        編輯訂單 #{orderId}
        <span className="text-base text-gray-500 font-normal">
          住宿 ID: {accommodationId}
        </span>
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
          min={toDateInputValue(new Date().toISOString())}
          className="w-full border-orange-400 border-2 rounded-lg px-4 py-2 text-gray-900 text-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
          required
        />
        <p className="mt-3 text-sm text-gray-600">
          預計退房日期: {checkOutDate || '待定'}
        </p>
      </div>

      {/* 🌟 步驟 2: 選擇房型 */}
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

          {!roomTypeStatusMessage && (
            <>
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
              {selectedRoomTypeId !== null && maxQuantity === 0 && (
                <p className="text-sm text-red-500 mt-2 font-semibold">
                  **注意：該房型在選定日期已售罄，請選擇其他房型或日期。**
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* 🌟 步驟 3 & 4: 確認與填寫個人資訊 */}
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
              className="w-full px-8 py-4 rounded-xl bg-blue-600 text-white text-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? '🔄 訂單更新中...' : '💾 確認並更新訂單'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
