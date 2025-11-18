import { API_URL } from '@/config/api-path';
const API = API_URL;

// ⭐ 新增收藏
export async function addFavorite(userId: number, placeId: number) {
  const uidStr = String(userId);
  const res = await fetch(`${API}/api/favorite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uidStr },
    body: JSON.stringify({ userId, placeId }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || '收藏失敗');
  }
  return json.data;
}

// ⭐ 取消收藏
export async function removeFavorite(userId: number, placeId: number) {
  const uidStr = String(userId);
  const res = await fetch(`${API}/api/favorite/${placeId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'x-user-id': uidStr },
    body: JSON.stringify({ userId, placeId }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || '取消收藏失敗');
  }
  return json.data;
}

// ⭐ 取得使用者收藏清單（給「我的收藏」頁用）
export async function getFavoritePlaces(userId: number) {
  const res = await fetch(`${API}/api/favorite?userId=${userId}`, {
    cache: 'no-store',
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || '取得收藏失敗');
  }
  // 這裡的 json.data 會是你後端 format 過的陣列
  const list = json.data as any[];

  // 🔥🔥🔥 用 transformPlace 直接統一格式
  return list.map((p) => {
    // 後端給的是單張 photo，把它包成 photos 陣列
    const photo = p.photo as string | undefined;

    return {
      id: p.id,
      name: p.name,
      type: p.type,
      address: p.address,
      region: p.region ?? '',
      introduce: p.introduce ?? '',
      avgScore: p.avgScore ?? 0,

      // ✅ 這行是重點：讓 Grid / Card 可以用 p.photos[0]
      photos: photo ? [photo] : [],
    };
  });
}

// ✅ 檢查這個 user 對這個 place 是否有收藏
export async function checkFavorite(userId: number, placeId: number) {
  const res = await fetch(
    `${API}/api/favorite/check?userId=${userId}&placeId=${placeId}`,
    { cache: 'no-store' } // 保證每次都是最新的
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || '檢查收藏失敗');
  }

  // 看你的後端是用 favorited / isFavorite 自己改一下
  return Boolean(json?.favorited);
}
