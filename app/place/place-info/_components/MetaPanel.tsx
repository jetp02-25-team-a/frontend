// components/spot/MetaPanel.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

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
  function isoToHHmm(iso?: string | null): string {
    if (!iso || typeof iso !== 'string') return '';
    // 先嘗試抓 T 後面的 HH:mm
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (m) return `${m[1]}:${m[2]}`;

    // 若不是標準 ISO（保險一點）
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return '';
    const h = d.getUTCHours();
    const mm = d.getUTCMinutes();
    return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }

  function minutesFromIso(iso?: string | null): number {
    if (!iso || typeof iso !== 'string') return 0;
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (m) {
      const h = Number(m[1]);
      const mm = Number(m[2]);
      return h * 60 + mm;
    }
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return 0;
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }

  const toStrings = (hours: any): string[] => {
    if (!Array.isArray(hours)) return [];
    // 1) 已是 string[]：直接回傳
    if (typeof hours[0] === 'string') return hours as string[];

    // 2) 是 OpeningHour 物件陣列：轉成字串
    return [...hours]
      .sort((a, b) => a.weekday - b.weekday)
      .map((h) => {
        const { weekday, openTime, closeTime, isClosed } = h ?? {};

        // 公休或沒時間 → 顯示公休
        if (isClosed || !openTime || !closeTime) {
          return `${weekdayName[weekday]}：公休`;
        }

        const o = isoToHHmm(openTime);
        const c = isoToHHmm(closeTime);

        const cross = minutesFromIso(closeTime) <= minutesFromIso(openTime);

        return `${weekdayName[weekday]}：${o}–${c}${cross ? '（跨日）' : ''}`;
      });
  };

  const hours: string[] = toStrings(spot.hours);

  return (
    <section className="flex rounded-2xl border p-4 space-y-3">
      {/* 中：聯絡/地址 */}
      <div className="flex-1 mr-2">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="text-red-600 text-[20px]"
            />
            <span className="mt-0.5 text-amber-700">{address}</span>
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faPhone}
              className="text-green-400 text-[20px]"
            />
            <span className="mt-0.5 text-amber-700">{contact}</span>
          </li>
        </ul>
      </div>

      {/* 右：營業時間 */}
      <div className="flex-1">
        <ul className="space-y-1.5 text-sm">
          <FontAwesomeIcon
            icon={faClock}
            className="text-blue-400 text-[20px]"
          />
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
