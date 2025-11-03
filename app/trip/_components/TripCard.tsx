import { Trip } from '../types/trip';

export default function TripCard({ title, area, date, image }: Trip) {
  return (
    <div className="w-[303px] rounded-2xl customize_shadow bg-white overflow-hidden group">
      {/* ✅ 圖片區塊：固定高度 + hover 放大 */}
      <div className="w-full h-[259px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
      </div>

      {/* ✅ 文字區塊：保持原本排版 */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm customize_text_gray">{location}</p>
        <p className="text-sm customize_text_gray">{date}</p>
        <button className="yellow-orange text-white px-3 py-2 rounded-lg text-sm hover:opacity-90 transition mt-2">
          查看詳情
        </button>
      </div>
    </div>
  );
}
