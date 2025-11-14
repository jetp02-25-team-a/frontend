import { API_SERVER } from '@/config/api-path';

type SortType = 'popular' | 'highRated';

export async function fetchAccommodations(sort?: SortType) {
  try {
    const res = await fetch(`${API_SERVER}/m3/accommodations?sort=${sort}`);
    if (!res.ok) {
      throw new Error(
        sort === 'popular' ? '熱門住宿取得失敗' : '高評住宿取得失敗'
      );
    }
    return res.json();
  } catch (err) {
    throw new Error('伺服器連線失敗，請稍後再試');
  }
}
