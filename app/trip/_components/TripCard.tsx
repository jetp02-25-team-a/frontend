interface TripCardProps {
  title: string;
  location: string;
  date: string;
  image: string;
}

export default function TripCard({
  title,
  location,
  date,
  image,
}: TripCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden transition customize_shadow hover:customize_shadow hover:scale-[1.02]">
      <img src={image} alt={title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm customize_text_gray">{location}</p>
        <p className="text-sm customize_text_gray mb-4">{date}</p>
        <button className="yellow-orange text-white px-3 py-2 rounded-lg text-sm hover:opacity-90 transition">
          詳情
        </button>
      </div>
    </div>
  );
}
