export interface DescriptionAreaProps {
  description?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export default async function DescriptionArea({
  description,
  checkInTime,
  checkOutTime,
}: DescriptionAreaProps) {
  return (
    <>
      <div className="p-4">
        <p>{description}</p>
        <p>入住時間：{checkInTime}</p>
        <p>退房時間：{checkOutTime}</p>
      </div>
    </>
  );
}
