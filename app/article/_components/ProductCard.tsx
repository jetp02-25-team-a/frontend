'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';

interface DestinationCardProps {
  id: number;
  photos?: { url: string }[]; // array of photo objects from backend
  title: string;
  description?: string;
}

export default function DestinationCard({
  id,
  photos,
  title,
  description,
}: DestinationCardProps) {
  // Ambil foto pertama jika tersedia
  const imageUrl = photos?.[0]?.url
    ? `${ARTICLE_PHOTOS_PATH}${photos[0].url}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={600}
          height={400}
          className="object-cover w-full h-64"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          No image available
        </div>
      )}

      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}
        </div>

        <Link
          href={`/article/detail/${id}`}
          className="mt-4 text-blue-600 hover:underline self-start"
        >
          查看
        </Link>
      </div>
    </div>
  );
}


































// // component product card

// 'use client';
// import React from 'react';
// import Image from 'next/image';

// // 'use client';
// import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';
// import Link from 'next/link';


// /// interface DestinationCardProps {
// //   id: number;
// //   image?: string;
// //   title: string;
// //   description?: string;
// // }

// // const isValidUrl = (url?: string) => {
// //   if (!url) return false;
// //   return true;
// // };

// // export default function DestinationCard({
// //   id,
// //   image,
// //   title,
// //   description,
// // }: DestinationCardProps) {
// //   const url = isValidUrl(image) ? `${ARTICLE_PHOTOS_PATH}${image}` : '';
// //   return (
// //     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
// //       {isValidUrl(image) ? (
// //         <Image
// //           src={url}
// //           alt={title}
// //           width={70}
// //           height={140}
// //           className="object-cover w-full h-64"
// //         />
// //       ) : (
// //         <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
// //           No image available
// //         </div>
// //       )}

// //       <div className="p-4 flex flex-col justify-between">
// //         <div>
// //           <h3 className="">{title}</h3>
// //           {description && (
// //             <p className="text-sm text-gray-600 mt-2">{description}</p>
// //           )}
// //         </div>
// //         <Link
// //           href={`/article/detail?id=${id}`}
// //           className="mt-4 text-blue-600 hover:underline self-start"
// //         >
// //           查看
// //         </Link>
// //       </div>
// //     </div>
// //   );
// /// }
// // interface DestinationCardProps {
// //   id: number;
// //   image?: string;
// //   title: string;
// //   description?: string;
// // }

// // const isValidUrl = (url?: string) => {
// //   if (!url) return false;
// //   return true;
// // };

// // export default function DestinationCard({
// //   id,
// //   image,
// //   title,
// //   description,
// // }: DestinationCardProps) {
// //   const url = isValidUrl(image) ? `${ARTICLE_PHOTOS_PATH}${image}` : '';
// //   return (
// //     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
// //       {isValidUrl(image) ? (
// //         <Image
// //           src={url}
// //           alt={title}
// //           width={200}
// //           height={150}
// //           className="object-cover w-full h-64"
// //         />
// //       ) : (
// //         <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
// //           No image available
// //         </div>
// //       )}

// //       <div className="p-4 flex flex-col justify-between">
// //         <div>
// //           <h3 className="">{title}</h3>
// //           {description && (
// //             <p className="text-sm text-gray-600 mt-2">{description}</p>
// //           )}
// //         </div>
// //         <Link
// //           href={`/article/detail?id=${id}`}
// //           className="mt-4 text-blue-600 hover:underline self-start"
// //         >
// //           查看
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }
// // 'use client'

// // interface DestinationCardProps {
// //   id: number;
// //   image?: string;
// //   title: string;
// //   description?: string;
// // }

// // export default function DestinationCard({ id, image, title, description }: DestinationCardProps) {
// //   const url = image ? `${ARTICLE_PHOTOS_PATH}${image}` : null;

// //   return (
// //     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
// //       {url ? (
// //         <Image
// //           src={url}
// //           alt={title}
// //           width={600}
// //           height={400}
// //           className="object-cover w-full h-64"
// //         />
// //       ) : (
// //         <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
// //           No image available
// //         </div>
// //       )}

// //       <div className="p-4 flex flex-col justify-between">
// //         <div>
// //           <h3 className="font-semibold">{title}</h3>
// //           {description && (
// //             <p className="text-sm text-gray-600 mt-2">{description}</p>
// //           )}
// //         </div>


// //         export default function DetailPage({ params }) {
// //          const id = params.id

// //          return <div>Detail article {id}</div>
// // }
// //         <Link
// //           href={`/article/detail/${id}`}  // ← gunakan dynamic route
// //           className="mt-4 text-blue-600 hover:underline self-start"
// //         >
// //           查看
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // }
// // 'use client';

// // import Image from "next/image";
// // import Link from "next/link";
// // import { ARTICLE_PHOTOS_PATH } from "@/config/image-path";

// interface DestinationCardProps {
//   id: number;
//   image?: string;
//   title: string;
//   description?: string;
// }

// export default function DestinationCard({ id, image, title, description }: DestinationCardProps) {
//   const url = image ? `${ARTICLE_PHOTOS_PATH}${image}` : null;

//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
//       {url ? (
//         <Image
//           src={url}
//           alt={title}
//           width={600}
//           height={400}
//           className="object-cover w-full h-64"
//         />
//       ) : (
//         <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
//           No image available
//         </div>
//       )}

//       <div className="p-4 flex flex-col justify-between">
//         <div>
//           <h3 className="font-semibold">{title}</h3>
//           {description && (
//             <p className="text-sm text-gray-600 mt-2">{description}</p>
//           )}
//         </div>

//         <Link
//           href={`/article/detail/${id}`}
//           className="mt-4 text-blue-600 hover:underline self-start"
//         >
//           查看
//         </Link>
//       </div>
//     </div>
//   );
// }




















// type Props = {
//   rank: number;
//   title: string;
//   description: string;
//   image: string;
// };

// export default function ProductCard({
//   rank,
//   title,
//   description,
//   image,
// }: Props) {
//   return (
//     <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-white">
//       <div className="text-2xl font-bold text-blue-600">{rank}</div>
//       <Image
//         src={image}
//         alt={title}
//         width={80}
//         height={80}
//         className="rounded-md"
//       />
//       <div>
//         <h3 className="text-lg font-semibold">{title}</h3>
//         <p className="text-sm text-gray-600">{description}</p>
//       </div>
//     </div>
//   );
// }

// type Props = {
//   rank: number;
//   title: string;
//   description: string;
//   image: string;
// };

// export default function ProductCard({
//   rank,
//   title,
//   description,
//   image,
// }: Props) {
//   return (
//     <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-white">
//       <div className="text-2xl font-bold text-blue-600">{rank}</div>
//       <Image
//         src={image}
//         alt={title}
//         width={50}
//         height={50}
//         className="rounded-md"
//       />
//       <div>
//         <h3 className="text-lg font-semibold">{title}</h3>
//         <p className="text-sm text-gray-600">{description}</p>
//       </div>
//     </div>
//   );
// }
