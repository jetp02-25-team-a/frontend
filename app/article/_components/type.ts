// src/types.ts

/**
 * Interface untuk data artikel yang dikembalikan dari endpoint /ranking.
 * Properti rank, score, dan _count (Likes, MessageBoard, Photos) adalah hasil perhitungan.
 */
export interface ArticleRankingItem {
  id: string;
  title: string;
  createdAt: string; // ISO Date String
  location: string;
  imgUrl: string;
  likesCount: number;
  commentsCount: number;
  photosCount: number;
  score: number;
  rank: number; // Tambahan dari backend setelah sorting dan pagination
}

/**
 * Interface untuk struktur response dari API /ranking.
 */
export interface RankingAPIResponse {
  success: boolean;
  message: string;
  page: number;
  limit: number;
  total: number;
  data: ArticleRankingItem[];
}