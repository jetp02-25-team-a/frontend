// types/trip.ts
export interface Trip {
  id: number; // 唯一識別碼
  title: string; // 行程名稱
  location: string; // 目的地
  date: string; // 起訖日期（字串格式）
  image: string; // 封面圖片路徑
  type?: string; // 行程類型（可選）
  departure?: string; // 出發地（可選）
  transport?: string; // 交通方式（可選）
  notes?: string; // 備註（可選）
}
