'use client';

interface Props {
  active: string;
  onChange: (v: string) => void;
}

export default function TripTabs({ active, onChange }: Props) {
  return (
    <div className="flex justify-center">
      <div className="bg-white shadow rounded-full px-2 py-2 flex gap-1">
        {[
          { key: 'detail', label: '行程內容' },
          { key: 'packing', label: '行李清單' },
          { key: 'expense', label: '記帳' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-6 py-1.5 rounded-full text-sm transition
              ${
                active === t.key
                  ? 'bg-amber-400 text-white shadow'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
