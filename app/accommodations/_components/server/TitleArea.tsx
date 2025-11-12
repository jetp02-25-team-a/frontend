export interface TitleAreaProps {
  name: string;
  address: string;
  amenities: any[];
  averageRating: number;
  reviewCount: number;
}

export default async function TitleArea({
  name,
  address,
  amenities,
  averageRating,
  reviewCount,
}: TitleAreaProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p>{address}</p>
      <p>
        ⭐ {averageRating} / {reviewCount} 則評論
      </p>
      <div className="flex gap-2">
        {amenities.map((a) => (
          <span key={a.id} className="px-2 py-1 bg-gray-100 rounded">
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}
