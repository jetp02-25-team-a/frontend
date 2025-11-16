// app/article/lib/api.ts
export interface PostRanking {
  id: string; // ID sebagai string sesuai backend
  title: string;
  location: string;
  imgUrl: string;
  likesCount: number;
}

export interface RankingResponse {
  page: number;
  limit: number;
  totalPosts: number;
  totalPages: number;
  data: PostRanking[];
}

/**
 * Fetch ranking posts dari backend
 * @param page halaman saat ini, default 1
 * @param limit jumlah per halaman, default 10
 */
export async function getRanking(
  page = 1,
  limit = 10
): Promise<RankingResponse> {
  const API_URL = 'http://localhost:3005'; // default ke localhost:3005

  const res = await fetch(
    `${API_URL}/posts/ranking?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // agar selalu fetch terbaru
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ranking posts: ${res.status}`);
  }

  const json: RankingResponse = await res.json();
  return json;
}
