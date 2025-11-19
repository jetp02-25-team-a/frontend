'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/contexts/BookingContext'; // 假設 Context 路徑
import { format } from 'date-fns';
import {
  FaCalendarAlt,
  FaDollarSign,
  FaHotel,
  FaArrowRight,
} from 'react-icons/fa';

// ---------------------------
// 輔助函式
// ---------------------------

// 格式化 ISO 日期為 YYYY/MM/DD
const formatDate = (isoDate: string) => {
  try {
    return format(new Date(isoDate), 'yyyy/MM/dd');
  } catch {
    return 'N/A';
  }
};

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

// ---------------------------
// 主要元件
// ---------------------------

export default function BookingList() {
  const router = useRouter();

  // 從 Context 獲取狀態和數據
  const { bookings, isLoading, error, mutateBookings } = useBooking();

  // --- 渲染邏輯 ---

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xl text-gray-600">
        <p>載入訂單列表中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        <p>⚠️ 載入訂單列表失敗。請確認您已登入並檢查網路連線。</p>
        <button
          onClick={() => mutateBookings()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          重新載入
        </button>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-lg">
        <p>您目前沒有任何預訂訂單。</p>
        <Link
          href="/accommodations"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition"
        >
          前往預訂住宿
        </Link>
      </div>
    );
  }

  // --- 列表渲染 ---
  return (
    <div className="space-y-6">
      {bookings.map((booking) => {
        const statusLabel = getStatusLabel(booking.status);
        const statusClass = getStatusClassName(booking.status);

        // 假設訂單詳情頁面路徑為 /member/bookings/[BID]
        const detailHref = `/accommodations/booking/${booking.id}`;

        return (
          // 使用 Link 元件包裹整個區塊，以實現快速導航
          <Link
            key={booking.id}
            href={detailHref}
            className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.01] border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-indigo-600">
                訂單 #{booking.id}
              </h3>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${statusClass}`}
              >
                {statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              {/* 住宿名稱 */}
              <div className="flex items-center">
                <FaHotel className="text-blue-500 mr-2" />
                <span className="font-semibold mr-2">住宿：</span>
                {booking.Accommodation.name}
              </div>

              {/* 預訂日期 */}
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <span className="font-semibold mr-2">預訂於：</span>
                {formatDate(booking.bookingDate)}
              </div>

              {/* 入住日期 */}
              <div className="flex items-center">
                <FaCalendarAlt className="text-green-500 mr-2" />
                <span className="font-semibold mr-2">入住：</span>
                {formatDate(booking.checkInDate)}
              </div>

              {/* 退房日期 */}
              <div className="flex items-center">
                <FaCalendarAlt className="text-red-500 mr-2" />
                <span className="font-semibold mr-2">退房：</span>
                {formatDate(booking.checkOutDate)}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center pt-4 border-t border-dashed border-gray-200">
              {/* 總金額 */}
              <div className="flex items-center text-2xl font-extrabold text-red-600">
                <FaDollarSign className="mr-2" />
                NT$ {Number(booking.totalAmount).toLocaleString()}
              </div>

              {/* 查看詳情按鈕/連結 */}
              <span className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition">
                查看詳情 <FaArrowRight className="ml-2 h-4 w-4" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
