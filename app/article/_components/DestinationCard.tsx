'use client';
import Image from 'next/image';
import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';
import Link from 'next/link';

interface DestinationCardProps {
  id: number;
  image?: string;
  title: string;
  description?: string;
}

const isValidUrl = (url?: string) => {
  if (!url) return false;
  return true;
};

export default function DestinationCard({
  id,
  image,
  title,
  description,
}: DestinationCardProps) {
  const url = isValidUrl(image) ? `${ARTICLE_PHOTOS_PATH}${image}` : '';
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
      {isValidUrl(image) ? (
        <Image
          src={image}
          alt={title}
          width={50}
          height={100}
          className="object-cover w-full h-64"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          No image available
        </div>
      )}

      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>
        <Link
          href={`/article/detail?id=${id}`}
          className="mt-4 text-blue-600 hover:underline self-start"
        >
          查看
        </Link>
      </div>
    </div>
  );
}

// // 'use client';
// // import Image from 'next/image';

// // export default function DestinationCard({ image, title, description }: {
// //   image: string;
// //   title: string;
// //   description: string;
// // }) {
// //   return (
// //     <div className="bg-white shadow rounded overflow-hidden">
// //       <Image
// //         src={isValidUrl(image) ? image : "/public/istockphoto-1209191587-612x612.jpg"}

// //         alt={title}
// //         width={30}
// //         height={30}
// //         className="object-cover w-full"
// //       />
// //       <div className="p-4">
// //         <h3 className="text-lg font-semibold">{title}</h3>
// //         <p className="text-sm text-gray-600 mt-2">{description}</p>
// //         <button className="mt-4 text-blue-600 hover:underline">查看</button>
// //       </div>
// //     </div>
// //   );
// // }
