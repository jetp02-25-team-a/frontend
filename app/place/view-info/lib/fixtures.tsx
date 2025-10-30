// lib/fixtures.ts
export const spot = {
  id: "s_202",
  name: "澎湖 雙心石滬",
  description:
    "位於澎湖北海吉貝嶼東北角，以石滬形成的雙心圖樣聞名。退潮時適合散步觀景、拍照。",
  heroPhoto: "https://picsum.photos/id/1011/1200/600",
  photos: [
    "https://picsum.photos/id/1015/400/240",
    "https://picsum.photos/id/1016/400/240",
    "https://picsum.photos/id/1020/400/240",
    "https://picsum.photos/id/1025/400/240",
  ],
  tags: ["觀景", "海景", "步道"],
  address: "澎湖縣白沙鄉",
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
    { icon: <span>📍</span>, text: "883澎湖縣七美鄉" },
    { icon: <span>🟢</span>, text: "883澎湖縣七美鄉", href: "#" },
    { icon: <span>📘</span>, text: "883澎湖縣七美鄉", href: "#" },
    { icon: <span>📸</span>, text: "883澎湖縣七美鄉", href: "#" },
    { icon: <span>✖️</span>, text: "883澎湖縣七美鄉" },
  ],
  hours: [
    "星期日：11:00–21:30",
    "星期一：11:00–21:30",
    "星期二：11:00–21:30",
    "星期三：11:00–21:30",
    "星期四：11:00–21:30",
    "星期五：11:00–21:30",
    "星期六：11:00–21:30",
  ],
};

export const reviews = [
  {
    id: "r1",
    user: { name: "Sophie Carter", avatar: "https://i.pravatar.cc/40?img=3" },
    rating: 5,
    content: "夕陽超美！退潮時能走到石滬旁邊，海風很舒服，適合拍照散步。",
    createdAt: "2025-08-02",
  },
  {
    id: "r2",
    user: { name: "Ethan Bennett", avatar: "https://i.pravatar.cc/40?img=5" },
    rating: 5,
    content: "現場比照片更壯觀，晚上星空也很清楚。路線好找，停車方便。",
    createdAt: "2025-07-18",
  },
  {
    id: "r3",
    user: { name: "Olivia Taylor", avatar: "https://i.pravatar.cc/40?img=8" },
    rating: 4,
    content: "白天人較多，建議卡退潮時段。沿岸木棧道很好走。",
    createdAt: "2025-06-01",
  },
];

// export default function Page() {
//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <RatingAndInfo
//         avg={4.8}
//         reviewCount={125}
//         dist={dist as any}
//         contacts={contacts}
//         hours={hours}
//       />
//     </div>
//   );
// }
