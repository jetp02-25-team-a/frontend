import { apiFetch } from './apiFetch';
import type { AccommodationDetail, Review, RoomTypeDetail } from '../../_types';

export async function getAccommodationDetail(
  id: number
): Promise<AccommodationDetail> {
  // 🌟 假設住宿詳情 API 路徑為 /accommodations/{id}
  const endpoint = `/accommodations/${id}`;

  // Server Component 的快取配置：讓 Next.js 重新驗證數據
  const options: RequestInit = {
    // 建議為詳細頁面設置較短或適中的重新驗證時間，例如 1 小時 (3600 秒)
    next: { revalidate: 3600 },
  };

  // 使用通用 apiFetch 函式獲取並解析數據
  // apiFetch 會處理所有的錯誤和 JSON 結構驗證
  const data = await apiFetch<AccommodationDetail>(endpoint, options);

  // 由於您的數據結構中沒有 'address' 欄位，但 city 提供了位置資訊
  // 在 fetcher 中我們可以選擇不處理，讓 Component 決定如何顯示地址

  return data;
}
