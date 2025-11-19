'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../_lib/_api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../hooks/use-Auth';
// 引入 Font Awesome 6 圖標
import { FaPenToSquare, FaTrashCan, FaXmark } from 'react-icons/fa6';

// ---------------------------
// 調整後的類型定義 (保持不變)
// ---------------------------

interface RoomTypeDetail {
  name: string;
  basePrice: number;
  maxCapacity: number;
  bedType: string;
}

interface BookingItem {
  id: number;
  quantity: number;
  unitPrice: string;
  RoomType: RoomTypeDetail;
}

interface UserDetail {
  id: number;
  fullName: string;
  email: string;
}

interface AccommodationDetail {
  id: number;
  name: string;
  address: string;
}

interface BookingData {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | string;
  guestName: string;
  guestContact: string;
  bookingDate: string;
  updatedAt: string;
  cancellationDate: string | null;

  User: UserDetail;
  Accommodation: AccommodationDetail;
  Review: any | null;

  Items: BookingItem[];
}

// ---------------------------
// 輔助函式 (保持不變)
// ---------------------------

// 格式化 ISO 日期為 YYYY/MM/DD
const formatDate = (isoDate: string) => {
  try {
    return format(new Date(isoDate), 'yyyy/MM/dd');
  } catch {
    return isoDate ? isoDate.split('T')[0] : 'N/A';
  }
};

// ---------------------------
// 主要元件
// ---------------------------

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderIdParam = params.BID as string;
  const orderId = Number(orderIdParam);

  const { getAuthHeader, isAuthenticated, isReady } = useAuth();

  const [bookingDetail, setBookingDetail] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 訂單狀態標籤
  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      Confirmed: '已確認',
      Pending: '待付款',
      Cancelled: '已取消',
    };
    return statusMap[status] || status;
  };

  // 訂單狀態樣式
  const getStatusClassName = (status: string) => {
    return status === 'Confirmed'
      ? 'bg-green-100 text-green-700'
      : status === 'Pending'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700';
  };

  // 1. 數據獲取 (單個 API 呼叫)
  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    const authHeader = getAuthHeader();

    try {
      // --- 獲取訂單詳情 (單次 API 呼叫) ---
      const detail = await apiFetch<BookingData>(`/m3/bookings/${orderId}`, {
        headers: authHeader as HeadersInit,
      });

      setBookingDetail(detail);
    } catch (err: any) {
      console.error('載入訂單詳情失敗:', err);

      const isAuthError =
        err.status === 401 ||
        err.status === 403 ||
        err.message?.includes('401') ||
        err.message?.includes('403') ||
        err.message?.includes('登入憑證無效');

      if (isAuthError) {
        toast.error('登入憑證無效或過期，請重新登入。');
        router.replace('/member/login');
        return;
      }

      toast.error('無法載入訂單詳情。' + (err.message || ''));
      setError('載入訂單失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isNaN(orderId) || orderId <= 0) {
      setError('訂單 ID 格式錯誤或缺失');
      setIsLoading(false);
      return;
    }

    // 修正：先檢查 isReady 狀態，避免在認證初始化完成前就執行跳轉。
    if (!isReady) {
      setIsLoading(true);
      return;
    }

    // 只有在 isReady 為 true 時，才檢查 isAuthenticated
    if (!isAuthenticated) {
      console.log('未登入，導向登入頁面。');
      toast.error('請先登入才能查看訂單詳情。');
      router.replace('/member/login');
      return;
    }

    // isReady 為 true 且 isAuthenticated 為 true，開始載入資料
    fetchAllData();

    // 確保將 isReady 加入依賴項
  }, [orderId, isAuthenticated, isReady, router]);

  // 2. 處理取消訂單
  const confirmCancel = async () => {
    if (!bookingDetail) {
      return;
    } // 關閉 Modal 並設定取消中狀態

    setIsModalOpen(false);
    setIsCancelling(true);

    try {
      await apiFetch(`/m3/bookings/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        } as HeadersInit,
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      toast.success(`訂單 #${orderId} 已成功取消。`); // ------------------------------------------------
      // 🌟 關鍵修改點：成功取消後，跳轉到指定的頁面
      // ------------------------------------------------
      router.replace(`/member/user-info?refresh=bookings`);
      // 或者，如果您有會員訂單列表頁，可以使用：
      // router.replace('/member/bookings');
    } catch (err) {
      console.error('取消訂單失敗:', err);
      toast.error('取消訂單失敗，請稍後再試。'); // 如果取消失敗，我們應該重新載入數據，以確保頁面狀態正確（例如，按鈕變回可點擊）
      await fetchAllData();
    } finally {
      setIsCancelling(false);
    }
  };

  // 處理按鈕點擊，開啟 Modal
  const handleCancel = () => {
    if (!bookingDetail) return;
    setIsModalOpen(true);
  };

  // 3. 渲染邏輯
  if (isLoading) {
    return (
      <div className="text-center p-8 text-xl text-gray-600">
        載入中...
        {isReady ? '(正在獲取訂單詳情)' : '(正在檢查登入狀態)'}
      </div>
    );
  }

  if (error || !bookingDetail) {
    return (
      <div className="text-center p-8 text-red-500 text-xl">
        錯誤: {error || '找不到該訂單。'}
      </div>
    );
  }

  const {
    id,
    checkInDate,
    checkOutDate,
    totalAmount,
    status,
    guestName,
    guestContact,
    bookingDate,
    Items,
    Accommodation,
    User,
  } = bookingDetail;

  // 處理聯繫資訊
  const contactParts = guestContact.includes(' / ')
    ? guestContact.split(' / ')
    : ['', guestContact];
  const guestEmail = contactParts[0].trim() || '無';
  const guestPhone = contactParts[1].trim() || guestContact.trim() || '無';

  const statusLabel = getStatusLabel(status);
  const statusClassName = getStatusClassName(status);

  // 決定按鈕是否顯示和啟用：只有 'Confirmed' 或 'Pending' 狀態的訂單可以被修改/取消
  const canModify = status === 'Confirmed' || status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl my-8">
      {/* 條件式渲染 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-bold text-red-700">確認取消訂單</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                {/* 使用 FaXmark 圖標 */}
                <FaXmark size={24} />
              </button>
            </div>

            <p className="text-lg mb-6 text-gray-700">
              您確定要取消 **訂單 #{id}** 嗎？取消後將無法恢復。
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                保留訂單
              </button>
              <button
                onClick={confirmCancel}
                disabled={isCancelling}
                className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                  isCancelling
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isCancelling ? '取消中...' : '確定取消'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主要內容 */}
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-6 flex justify-between items-center">
        訂單詳情 #{id}
        <span
          className={`text-xl font-semibold px-4 py-1 rounded-full ${statusClassName}`}
        >
          {statusLabel}
        </span>
      </h1>

      {/* 訂單操作按鈕區塊 */}
      {canModify && (
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            // 假設編輯頁面的路徑是 /accommodations/booking/[BID]/edit
            onClick={() =>
              router.push(`/accommodations/booking/${orderId}/edit`)
            }
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            {/* 使用 FaPenToSquare 圖標 */}
            <FaPenToSquare size={20} /> 編輯訂單
          </button>
          <button
            type="button"
            onClick={handleCancel} // 點擊時開啟 Modal
            disabled={isCancelling}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition duration-300 shadow-md ${
              isCancelling
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isCancelling ? (
              '取消中...'
            ) : (
              <>
                {/* 使用 FaTrashCan 圖標 */}
                <FaTrashCan size={20} /> 取消訂單
              </>
            )}
          </button>
        </div>
      )}

      {/* 住宿與日期資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 p-5 border rounded-lg bg-blue-50/50">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">住宿與日期</h2>
          <div className="space-y-3 text-lg">
            <p>
              <span className="font-semibold">住宿名稱:</span>{' '}
              {Accommodation.name}
            </p>
            <p>
              <span className="font-semibold">住宿地址:</span>{' '}
              {Accommodation.address}
            </p>
            <p>
              <span className="font-semibold">預訂日期:</span>{' '}
              {formatDate(bookingDate)}
            </p>
            <p>
              <span className="font-semibold">入住日期:</span>{' '}
              {formatDate(checkInDate)}
            </p>
            <p>
              <span className="font-semibold">退房日期:</span>{' '}
              {formatDate(checkOutDate)}
            </p>
          </div>
        </div>

        {/* 價格資訊 */}
        <div className="bg-green-50 p-5 rounded-lg border border-green-200 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">總金額</h2>
          <div className="space-y-2 text-xl">
            <p className="flex justify-between font-semibold border-t pt-2">
              <span className="text-3xl font-extrabold text-red-600">
                NT$ {Number(totalAmount).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 房型明細 (橫跨三欄) */}
      <div className="border-t pt-6 mb-8">
        <h2 className="text-2xl font-bold text-orange-700 mb-4">
          預訂房型明細 ({Items.length} 種)
        </h2>
        <div className="space-y-4">
          {Items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
            >
              <div className="text-lg">
                <p className="font-bold text-gray-900">{item.RoomType.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  單價: NT$ {Number(item.RoomType.basePrice).toLocaleString()} /
                  晚
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  床型: {item.RoomType.bedType} (容納{' '}
                  {item.RoomType.maxCapacity} 人)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold">
                  數量: {item.quantity} 間
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  小計: NT${' '}
                  {(
                    Number(item.RoomType.basePrice) * item.quantity
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 聯絡人資訊 (實際入住人) */}
      <div className="border-t pt-6 mb-8">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          預訂入住人資訊
        </h2>
        <div className="space-y-2 text-lg">
          <p>
            <span className="font-semibold">姓名:</span> {guestName}
          </p>
          <p>
            <span className="font-semibold">聯絡電話:</span> {guestPhone}
          </p>
          {guestEmail !== '無' && (
            <p>
              <span className="font-semibold">Email:</span> {guestEmail}
            </p>
          )}
        </div>
      </div>

      {/* 訂購帳號資訊 (會員) */}
      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">
          訂購會員資訊
        </h2>
        <div className="space-y-2 text-lg">
          <p>
            <span className="font-semibold">名稱:</span> {User.fullName}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {User.email}
          </p>
        </div>
      </div>
    </div>
  );
}
