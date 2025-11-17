interface DescriptionAreaProps {
  description: string;
}

export default function DescriptionArea({ description }: DescriptionAreaProps) {
  return (
    <div className="w-full flex flex-col gap-10 px-32">
      {/* 簡介 */}
      <div className="w-full flex flex-col gap-10">
        <h2 className="text-2xl font-semibold mb-2">住宿簡介</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
