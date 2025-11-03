export interface Trip {
  id: number;
  title: string;
  area: string;
  startDate: string;
  endDate: string;
  url: string;
  type?: string;

  // 前端顯示用（非後端資料庫欄位）
  date?: string;
  image?: string;
}
