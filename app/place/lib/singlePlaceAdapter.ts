type OpeningHour = {
  weekday: number;
  openTime: string | null;
  closeTime: string | null;
};
type ApiPlace = {
  id: number;
  type: string;
  name: string;
  introduce?: string | null;
  contact?: string | null;
  region?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  Photos?: { url: string }[];
  rating?: { avg?: string | null; count?: number };
  openingHour?: OpeningHour[];
  commentCount?: number;
  comments?: any[];
};

export async function getSpotDetail(placeId: number) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${base}/api/place/${placeId}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  const p: ApiPlace = json.data;

  // ✅ 轉換成前端元件能直接使用的格式
  const spot = {
    id: p.id,
    type: p.type,
    name: p.name,
    description: p.introduce ?? '',
    contact: p.contact ?? '',
    region: p.region ?? '',
    address: p.address ?? '',
    lat: p.latitude ?? null,
    lng: p.longitude ?? null,
    photos: (p.Photos ?? []).map((ph: any) => ph.url),
    ratingAvg: parseFloat(p.rating?.avg ?? '0'),
    reviewCount: p.commentCount ?? 0,
    hours: p.openingHour,
  };

  const reviews = (p.comments ?? []).map((c: any) => ({
    id: c.id,
    name: c.fullName,
    avatar: c.avatar,
    date: c.createdAt,
    score: c.score,
    content: c.content ?? '',
  }));

  const hours = (p.openingHour ?? []).map((h: any) => ({
    weekday: h.weekday,
    openTime: h.openTime,
    closeTime: h.closeTime,
  }));

  return { spot, reviews, hours };
}
