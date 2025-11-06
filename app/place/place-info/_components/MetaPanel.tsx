// components/spot/MetaPanel.tsx
export default function MetaPanel({ spot }: { spot: any }) {
  const contact = spot.contact;
  const address = spot.address;

  const weekdayName = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const twTime = new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });
  const fmt = (iso?: string | null) =>
    iso ? twTime.format(new Date(iso)) : '';

  const toStrings = (hours: any): string[] => {
    if (!Array.isArray(hours)) return [];
    // 1) 已是 string[]：直接回傳
    if (typeof hours[0] === 'string') return hours as string[];
    // 2) 是原始 openingHour 物件陣列：轉字串
    return [...hours]
      .sort((a, b) => a.weekday - b.weekday)
      .map((h) => {
        const { weekday, openTime, closeTime } = h ?? {};
        if (!openTime || !closeTime) return `${weekdayName[weekday]}：休息`;
        const o = fmt(openTime);
        const c = fmt(closeTime);
        // 以 UTC 分鐘數比較，避免日期不同日造成誤判
        const toHM = (iso: string) => {
          const d = new Date(iso);
          return d.getUTCHours() * 60 + d.getUTCMinutes();
        };
        const cross = toHM(closeTime) <= toHM(openTime);
        return `${weekdayName[weekday]}：${o}–${c}${cross ? '（跨日）' : ''}`;
      });
  };

  const hours: string[] = toStrings(spot.hours);

  function PinIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
      </svg>
    );
  }

  function ClockIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 11h5v-2h-4V6h-2v7Z" />
      </svg>
    );
  }

  function PhoneIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.7 3.9 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.1-.2 1 .5 2.1.8 3.3.8.6 0 1 .4 1 1v3.4c0 .6-.4 1-1 1C10.5 21.2 2.8 13.5 2.8 3.2c0-.6.4-1 1-1H7c.6 0 1 .4 1 1 0 1.2.3 2.3.8 3.3.2.3.2.8-.2 1.1L6.6 10.8z" />
      </svg>
    );
  }

  return (
    <section className="flex rounded-2xl border p-4 space-y-3">
      {/* 中：聯絡/地址 */}
      <div className="flex-1">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <PinIcon />
            <span className="mt-0.5 text-amber-700">{address}</span>
          </li>
          <li className="flex items-center gap-2">
            <PhoneIcon />
            <span className="mt-0.5 text-amber-700">{contact}</span>
          </li>
        </ul>
      </div>

      {/* 右：營業時間 */}
      <div className="flex-1">
        <ul className="space-y-1.5 text-sm">
          <ClockIcon />
          {hours.map((h, i) => (
            <li key={i} className="flex gap-3 mt-0.5 text-[16px]">
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
