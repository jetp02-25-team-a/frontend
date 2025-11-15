'use client';

interface Props {
  days: string[];
  activeDay: number;
  onChange: (i: number) => void;
}

export default function DayTabs({ days, activeDay, onChange }: Props) {
  return (
    <div className="flex space-x-3 mb-5">
      {days.map((d, i) => (
        <button
          key={d}
          onClick={() => onChange(i)}
          className={`px-4 py-2 rounded-lg border ${
            activeDay === i ? 'bg-yellow-400 text-white' : 'bg-white'
          }`}
        >
          第{i + 1}天
        </button>
      ))}
    </div>
  );
}
