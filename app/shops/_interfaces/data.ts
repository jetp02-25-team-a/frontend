// 定義產品圖片的介面
export interface ProductPic {
  picId: number;
  src: string;
  productId: number;
}

// 定義產品變體的介面
export interface ProductVariant {
  id: number;
  productId: number;
  variantName: string;
  price: number; // 假設價格是整數
  stock: number; // 假設庫存是整數
}

// 定義單個產品資料的介面
export interface Product {
  id: number;
  productName: string;
  keyword: string; // 假設這是一個逗號分隔的字串
  description: string;
  ProductVariants: ProductVariant[]; // 包含多個產品變體
  ProductPics: ProductPic[]; // 包含多個產品圖片
}

// 定義整個成功響應數據部分的介面
export interface ProductData {
  data: Product[]; // 包含一個產品陣列
}

// 定義整個頂層 JSON 結構的介面
export interface ApiResponse {
  success: boolean;
  data: Product[]; // 這是 ProductData 介面中的 `data` 陣列
}
