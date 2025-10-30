export interface Spot {
  name: string;
  photos: string;
  ratingAvg: number;
  address: string;
  description: string;
}

export const heroImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1559732842-0a4b49c002be?auto=format&fit=crop&w=1200&q=80',
    caption: '在旅途中相遇，讓故事交織。',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1549893075-7c29c97c3c4c?auto=format&fit=crop&w=1200&q=80',
    caption: '開始書寫屬於你的故事吧。',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1560448070-4328a1e1d8f3?auto=format&fit=crop&w=1200&q=80',
    caption: '旅行，讓回憶發光。',
  },
];

export const spot = {
  id: 's_202',
  name: '澎湖 雙心石滬',
  description:
    '位於澎湖北海吉貝嶼東北角，以石滬形成的雙心圖樣聞名。退潮時適合散步觀景、拍照。',
  heroPhoto: 'https://picsum.photos/id/1011/1200/600',
  photos: [
    'https://picsum.photos/id/1015/400/240',
    'https://picsum.photos/id/1016/400/240',
    'https://picsum.photos/id/1020/400/240',
    'https://picsum.photos/id/1025/400/240',
  ],
  tags: ['觀景', '海景', '步道'],
  address: '澎湖縣白沙鄉',
  ratingAvg: 4.8,
  ratingDist: [
    { star: 5, pct: 72 },
    { star: 4, pct: 20 },
    { star: 3, pct: 6 },
    { star: 2, pct: 1 },
    { star: 1, pct: 1 },
  ],
  reviewCount: 125,
  geo: { lat: 23.7, lng: 119.6 },
  contacts: [
    { icon: <span>📍</span>, text: '883澎湖縣七美鄉' },
    { icon: <span>🟢</span>, text: '883澎湖縣七美鄉', href: '#' },
    { icon: <span>📘</span>, text: '883澎湖縣七美鄉', href: '#' },
    { icon: <span>📸</span>, text: '883澎湖縣七美鄉', href: '#' },
    { icon: <span>✖️</span>, text: '883澎湖縣七美鄉' },
  ],
  hours: [
    '星期日：11:00–21:30',
    '星期一：11:00–21:30',
    '星期二：11:00–21:30',
    '星期三：11:00–21:30',
    '星期四：11:00–21:30',
    '星期五：11:00–21:30',
    '星期六：11:00–21:30',
  ],
};
