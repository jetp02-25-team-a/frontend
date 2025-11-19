export type InventoryItem = {
  date: string;
  availableCount: number;
};

export type RoomTypeInventory = {
  roomTypeId: number;
  name: string;
  basePrice: number;
  // 該房型在一個日期範圍內的庫存細節
  availability: InventoryItem[];
};

// 依據日期查庫存的回傳結構 (與 JSON 2 吻合)
export type RoomTypeInventoryResponse = {
  accommodationId: number;
  checkInDate: string;
  checkOutDate: string;
  roomTypes: RoomTypeInventory[];
};

// 🌟 修正：依據房型查日期的回傳結構 (與 JSON 1 吻合)
export type DateInventoryResponse = {
  roomTypeId: number;
  checkInDate: string;
  checkOutDate: string;
  // 該房型在指定日期範圍內的庫存細節
  availability: InventoryItem[];
};
