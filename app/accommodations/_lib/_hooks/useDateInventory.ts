import useSWR from 'swr';
// ... (imports) ...
import { DateInventoryResponse, FetchError } from '../../_types'; // 假設 DateInventoryResponse 結構正確
import { apiFetch } from '../_api';

/**
 * 根據房型 ID 查詢該房型未來一週有庫存的日期
 * @param roomTypeId 房型 ID (這是唯一的必備查詢參數)
 */
// 💡 注意：因為 API 結構只依賴 roomTypeId，我們不再需要 accommodationId 作為查詢條件。
export function useDateInventory(roomTypeId: number | null) {
  // 1. 定義 API 請求條件
  const shouldFetch = !!roomTypeId && roomTypeId > 0;

  // 2. 🌟 修正 URL 建構：使用 roomTypeId 作為路徑參數
  // 假設基礎路徑是 /api/m3 (apiFetch 會處理)
  const url = shouldFetch
    ? `/m3/room-type/${roomTypeId}/weekly-inventories`
    : null; // 如果條件不滿足，不發起請求

  const { data, error, isLoading } = useSWR<DateInventoryResponse, FetchError>(
    url, // 使用修正後的 URL 變數
    (endpoint: string) => apiFetch<DateInventoryResponse>(endpoint)
  );

  // 3. 提取數據邏輯 (與您提供的 JSON 吻合)
  const availableDates: string[] =
    data?.availability
      .filter((d) => d.availableCount > 0)
      // 確保只取 YYYY-MM-DD 格式
      .map((d) => d.date.split('T')[0]) ?? [];

  return {
    inventoryData: data,
    availableDates,
    isLoadingDates: isLoading,
    dateError: error,
  };
}
