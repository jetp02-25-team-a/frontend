export default function TripDetailSection({ details }) {
  if (!details?.length)
    return <p className="text-sm text-neutral-500">尚未新增任何行程內容。</p>;

  return (
    <ol className="space-y-4 border-l border-dashed border-neutral-200 pl-4">
      {details.map((d) => (
        <li key={d.id} className="relative pl-4">
          <span className="absolute left-[-11px] top-2 h-2 w-2 rounded-full bg-amber-400" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-neutral-800">{d.title}</p>
              <span className="rounded-full bg-amber-50 px-3 py-0.5 text-xs text-amber-700">
                {d.type === 'spot'
                  ? '景點'
                  : d.type === 'hotel'
                    ? '住宿'
                    : '其他'}
              </span>
            </div>

            {d.address && (
              <p className="text-xs text-neutral-500">{d.address}</p>
            )}

            <p className="text-xs text-neutral-400">
              {new Date(d.startDate).toLocaleString('zh-TW')} -{' '}
              {new Date(d.endDate).toLocaleString('zh-TW')}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
