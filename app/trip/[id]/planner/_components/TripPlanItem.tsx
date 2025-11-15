'use client';

export default function TripPlanItem({
  item,
  onCopy,
  onDelete,
}: {
  item: any;
  onCopy: (item: any) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="relative p-4 bg-white rounded-lg shadow border border-gray-200">
      {/* 右上角按鈕 */}
      <div className="absolute right-3 top-3 flex gap-3">
        {/* 複製 */}
        <button
          onClick={() => onCopy(item)}
          className="text-gray-500 hover:text-blue-600 transition"
          title="複製"
        >
          📄
        </button>

        {/* 刪除 */}
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-500 hover:text-red-600 transition"
          title="刪除"
        >
          🗑️
        </button>
      </div>

      {/* 標題 */}
      <div className="text-lg font-semibold pr-16">{item.title}</div>

      {/* 時間 */}
      <div className="text-sm text-gray-500">
        {new Date(item.startDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
        {' - '}
        {new Date(item.endDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* 地點 */}
      <div className="text-sm text-gray-700">{item.address}</div>

      {/* 停留時間 */}
      {(item.stayHour > 0 || item.stayMin > 0) && (
        <div className="text-xs text-yellow-600 mt-1">
          停留 {item.stayHour} 小時 {item.stayMin} 分
        </div>
      )}
    </div>
  );
}
