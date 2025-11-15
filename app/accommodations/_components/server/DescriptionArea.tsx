interface DescriptionAreaProps {
  description: string;
  checkInTime: string;
  checkOutTime: string;
}

export default function DescriptionArea({
  description,
  checkInTime,
  checkOutTime,
}: DescriptionAreaProps) {
  return (
    <div className="w-full flex flex-col gap-10 px-32">
      {/* 簡介 */}
      <div className="w-full flex flex-col gap-10">
        <h2 className="text-2xl font-semibold mb-2">住宿簡介</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      <hr className="w-full text-cgray" />
      {/* 入住/退房時間 */}
      <div className="flex gap-12 text-gray-600 text-sm">
        <div>
          <span className="font-medium">入住時間：</span>
          {checkInTime}
        </div>
        <div>
          <span className="font-medium">退房時間：</span>
          {checkOutTime}
        </div>
      </div>
    </div>
  );
}
