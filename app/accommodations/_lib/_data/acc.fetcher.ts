import { API_SERVER } from '@/config/api-path';

type SortType = 'popular' | 'highRated';
export async function fetchAccommodations(sort?: SortType) {
  const res = await fetch(`${API_SERVER}/m3/accommodations?sort=${sort}`);
  if (!res.ok) {
    const errorMessage =
      sort === 'popular' ? '熱門住宿取得失敗' : '高評住宿取得失敗';
    throw new Error(errorMessage);
  }
  return res.json();
}
