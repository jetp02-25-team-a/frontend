// components/Section.tsx
import type { SectionData } from '@/types/section';

export default function Section({ title, bgColor }: SectionData) {
  return (
    <div className={`${bgColor} py-6 px-4`}>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
}
