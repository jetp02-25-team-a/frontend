// components/spot/MetaPanel.tsx
export default function MetaPanel({ spot }: { spot: any }) {
  const contacts = spot.contacts;
  const hours = spot.hours;

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

  return (
    <section className="flex rounded-2xl border p-4 space-y-3">
      {/* 中：聯絡/地址 */}
      <div className="flex-1">
        <ul className="space-y-2">
          <p className="text-[12px]">聯絡資訊</p>
          {contacts.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 text-amber-700">
                {c.icon ?? <PinIcon />}
              </span>
              {c.href ? (
                <a href={c.href} className="hover:underline">
                  {c.text}
                </a>
              ) : (
                <span>{c.text}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 右：營業時間 */}
      <div className="flex-1">
        <ul className="space-y-1.5 text-sm">
          <p className="text-[12px]">營業時間</p>
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
