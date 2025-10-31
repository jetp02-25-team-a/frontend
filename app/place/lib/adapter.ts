// 將 DB 假資料 => 轉成前端元件可直接使用的 shape
import { places, comments, ranks } from './fixtures';

// ---- 前端元件期望的型別（照你現有元件欄位）----
export type FrontSpot = {
  id: number;
  name: string;
  description: string;
  photos: string[];
  heroPhoto: string;
  ratingAvg: number;
  ratingDist: { star: number; pct: number }[];
  reviewCount: number;
  contacts: { icon?: string; text: string; href?: string }[];
  hours: string[];
  address?: string;
  geo?: { lat?: number; lng?: number };
};

// 假的使用者名單（僅供 ReviewList 展示）
const mockUsers: Record<number, { name: string; avatar: string }> = {
  1: { name: 'Andy', avatar: 'https://i.pravatar.cc/64?img=1' },
  2: { name: 'Lena', avatar: 'https://i.pravatar.cc/64?img=2' },
  3: { name: 'Hank', avatar: 'https://i.pravatar.cc/64?img=3' },
  4: { name: 'Mina', avatar: 'https://i.pravatar.cc/64?img=4' },
};

// 依 ranks 計算平均 & 分布
function buildRating(placeId: number) {
  const rs = ranks.filter((r) => r.place_id === placeId);
  const count = rs.length || 1;
  const avg =
    Math.round((rs.reduce((s, r) => s + r.score, 0) / count) * 10) / 10 || 4.6;

  const distBase = [5, 4, 3, 2, 1].map((star) => ({
    star,
    cnt: rs.filter((r) => r.score === star).length,
  }));
  const total = distBase.reduce((s, d) => s + d.cnt, 0) || 1;
  const ratingDist = distBase
    .map((d) => ({ star: d.star, pct: Math.round((d.cnt / total) * 100) }))
    .sort((a, b) => b.star - a.star);

  return { avg, ratingDist, reviewCount: total };
}

// 產生 contacts / hours（DB 沒這欄，所以用 place 的欄位組合）
function buildContacts(place: any) {
  const list: { icon?: string; text: string; href?: string }[] = [];
  if (place.address) list.push({ icon: '📍', text: place.address });
  if (place.contact) list.push({ icon: '☎️', text: place.contact });
  if (place.region) list.push({ icon: '🗺️', text: place.region });
  return list.length ? list : [{ icon: 'ℹ️', text: '暫無聯絡資訊（展示用）' }];
}

const defaultHours = [
  '星期日：11:00–21:30',
  '星期一：11:00–21:30',
  '星期二：11:00–21:30',
  '星期三：11:00–21:30',
  '星期四：11:00–21:30',
  '星期五：11:00–21:30',
  '星期六：11:00–21:30',
];

// 把單一 place 轉成前端 Spot
export function toFrontSpot(place: any): FrontSpot {
  const photos =
    (place.Photos || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((p: any) => p.url) ?? [];

  const { avg, ratingDist, reviewCount } = buildRating(place.place_id);

  return {
    id: place.place_id,
    name: place.name,
    description: place.introduce ?? '',
    photos,
    heroPhoto: photos[0] ?? 'https://picsum.photos/seed/hero/1200/600',
    ratingAvg: avg,
    ratingDist,
    reviewCount,
    contacts: buildContacts(place),
    hours: defaultHours,
    address: place.address,
    geo: { lat: place.latitude, lng: place.longitude },
  };
}

// 組 ReviewList 需要的 reviews：合併 comments + ranks
export function buildReviews(placeId: number) {
  const cs = comments.filter((c) => c.place_id === placeId);
  const rs = ranks.filter((r) => r.place_id === placeId);

  // 用 user_id 合併分數；沒有就給 5
  const scoreByUser = new Map(rs.map((r) => [r.user_id, r.score]));

  return cs.map((c, i) => {
    const user = mockUsers[c.user_id] ?? {
      name: `User${c.user_id}`,
      avatar: 'https://i.pravatar.cc/64',
    };
    return {
      id: c.comment_id ?? i,
      user,
      createdAt: c.created_at?.slice(0, 10) ?? '2025-10-01',
      rating: scoreByUser.get(c.user_id) ?? 5,
      content: c.content ?? '',
    };
  });
}

// 依 id 取得頁面需要的資料（spot + reviews）
export function getSpotDetail(placeId: number) {
  const place = places.find((p) => p.place_id === placeId);
  if (!place) return null;
  return {
    spot: toFrontSpot(place),
    reviews: buildReviews(placeId),
  };
}
