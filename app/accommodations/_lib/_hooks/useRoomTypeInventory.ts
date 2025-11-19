import useSWR from 'swr';
import {
  FetchError,
  RoomTypeInventory,
  RoomTypeInventoryResponse,
} from '../../_types';
import { apiFetch } from '../_api';

/**
 * 根據住宿 ID 和入住日期查詢該住宿下所有有庫存的房型
 * @param accommodationId 住宿 ID
 * @param checkInDate 入住日期 (YYYY-MM-DD)
 */
export function useRoomTypeInventory(
  accommodationId: number,
  checkInDate: string | null // 這個 Hook 的核心查詢參數
) {
  // 1. 定義 API 請求條件
  const shouldFetch = accommodationId > 0 && !!checkInDate;

  // 2. 建構 URL：匹配您提供的端點結構
  const url = shouldFetch
    ? `/m3/accommodations/${accommodationId}/weekly-inventories?checkInDate=${checkInDate}`
    : null;

  // 3. 使用 useSWR 獲取資料
  const { data, error, isLoading } = useSWR<
    RoomTypeInventoryResponse,
    FetchError
  >(url, (endpoint: string) => apiFetch<RoomTypeInventoryResponse>(endpoint));

  // 4. 數據處理：
  //    - 找出所有房型
  //    - 篩選出在該 checkInDate (或範圍內) 至少有庫存的房型

  const availableRoomTypes: RoomTypeInventory[] =
    data?.roomTypes
      // 遍歷所有房型，檢查它們在指定 checkInDate 當天是否有庫存 (> 0)
      .filter((rt) => {
        // 確保日期格式一致 (YYYY-MM-DD)
        const checkDate: string = checkInDate!;

        // 找到該房型在 checkDate 當天的庫存紀錄
        const inventoryForCheckInDate = rt.availability.find(
          (a) => a.date.startsWith(checkDate) // 匹配 YYYY-MM-DD
        );

        // 如果找到紀錄且 availableCount 大於 0，則視為可用
        return (
          inventoryForCheckInDate && inventoryForCheckInDate.availableCount > 0
        );
      }) ?? [];

  return {
    inventoryData: data,
    availableRoomTypes,
    isLoadingRoomTypes: isLoading,
    roomTypeError: error,
  };
}
