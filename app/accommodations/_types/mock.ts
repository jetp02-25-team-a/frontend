/**
 * 核心詳細資料 (accDetail_fetcher 返回的結構)
 * 供 AIDPage (page.tsx) 使用
 */
export interface AccommodationCoreDetails {
  id: number;
  name: string;
  address: string;
  description: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  // 在實際應用中，可以加上 cityId, typeId 等外鍵，或直接包含 City, AccommodationType 的名稱
}

/**
 * 圖片集資料中的單張圖片結構 (accGallery_fetcher 返回的元素結構)
 */
export interface GalleryImage {
  url: string;
  caption: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

/**
 * 評論統計資料 (accReview_fetcher 返回的 stats 部分)
 */
export interface ReviewStats {
  count: number; // 評論總數
  average: number; // 平均分數 (例如：4.5)
}

/**
 * 首頁評論列表中的單條評論結構 (accReview_fetcher 返回的 initialReviews 元素結構)
 */
export interface InitialReview {
  id: number;
  ratingScore: number;
  comment: string | null;
  reviewDate: string; // 這裡使用 string，因為 mock data 是 string 格式
  // 如果是從 Prisma 獲取，這裡可能是 Date
}

/**
 * 完整的評論獲取結果 (accReview_fetcher 返回的結構)
 * 供 ReviewSection (SC) 使用
 */
export interface AccommodationReviewsData {
  stats: ReviewStats;
  initialReviews: InitialReview[];
}
