// app/article/_components/PostCard1.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Interface Props ---
export interface PostCardProps {
  postId: string;
  title: string;
  image?: string;
  likes?: number;
  destination?: string;
}

// Path default yang konsisten (asumsi ada di /public/images/default.jpg)
const DEFAULT_IMAGE_PATH = '/images/default.jpg'; 

/**
 * Memvalidasi dan menentukan path gambar yang aman untuk digunakan di komponen Image Next.js.
 * * Catatan: Logika ini sekarang lebih toleran terhadap path yang mungkin dikirim dari
 * backend, tetapi tetap mengutamakan path yang valid ('/' atau 'http').
 */
const getValidatedImagePath = (imageProp: string | undefined): string => {
  if (!imageProp || imageProp.trim() === '') {
    return DEFAULT_IMAGE_PATH;
  }

  const cleanedImage = imageProp.trim();
  
  // Jika sudah valid (sudah dimulai dengan '/' atau 'http'), gunakan langsung
  if (cleanedImage.startsWith('/') || cleanedImage.startsWith('http')) {
    return cleanedImage;
  }

  // Jika tidak, logika di `rankingpage/page.tsx` bertanggung jawab
  // menambahkan prefix yang benar sebelum prop ini diberikan.
  // Jika masih hanya nama file di sini, kita gunakan default untuk mencegah error runtime.
  if (process.env.NODE_ENV === 'development') {
    console.warn(`PostCard: Path gambar ambigu ditemukan: ${cleanedImage}. Menggunakan gambar default.`);
  }
  
  return DEFAULT_IMAGE_PATH;
};

// --- Komponen PostCard ---
const PostCard: React.FC<PostCardProps> = ({
  postId,
  title,
  image,
  likes = 0,
  destination = 'Lokasi Tidak Diketahui',
}) => {
  // Panggil fungsi validasi untuk mendapatkan path gambar yang aman.
  const displayImageSrc = getValidatedImagePath(image);

  return (
    <Link 
        href={`/article/detail/${postId}`} 
        className="block" 
    >
      <div className="border border-gray-200 rounded-xl shadow-md overflow-hidden 
                      hover:shadow-lg hover:border-blue-400 transition-all duration-300 
                      cursor-pointer bg-white h-full flex flex-col">
        
        {/* Kontainer Gambar: menggunakan relative dan fill untuk responsif */}
        <div className="relative w-full h-48 flex-shrink-0">
             <Image
                src={displayImageSrc}
                alt={title}
                fill 
                className="object-cover" 
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false} // Atur sesuai kebutuhan
            />
        </div>

        {/* Konten Teks */}
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{title}</h2>
            <p className="text-blue-600 text-sm mb-2 font-medium">{destination}</p>
          </div>
          <div className="flex items-center text-gray-700 mt-2">
            <span role="img" aria-label="likes" className="mr-1">❤️</span>
            <span className="font-semibold">{likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;

// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { ARTICLE_PHOTOS_PATH } from '@/config/image-path';
// import Link from 'next/link';

// interface PostCardProps {
//   postId: string; // Sesuai backend, ID dikirim sebagai string
//   title: string;
//   image?: string;
//   likes?: number;
//   destination?: string;
//   // id: number;
//   // image?: string;
//   // title: string;
//   // description?: string;
// }

// const isValidUrl = (url?: string) => {
//   if (!url) return false;
//   return true;
// };

// export interface PostCardProps {
//   postId: string; // Sesuai backend, ID dikirim sebagai string
//   title: string;
//   image?: string;
//   likes?: number;
//   destination?: string;
// }

// const PostCard: React.FC<PostCardProps> = ({
//   postId,
//   title,
//   image = '/default.jpg',
//   likes = 0,
//   destination = 'Unknown',
// }) => {
//   return (
//     <div className="border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//       <img src={image} alt={title} className="w-full h-48 object-cover" />
//       <div className="p-4">
//         <h2 className="text-xl font-semibold mb-2">{title}</h2>
//         <p className="text-gray-500 text-sm mb-2">{destination}</p>
//         <p className="text-gray-700 font-medium">❤️ {likes}</p>
//       </div>
//     </div>
//   );
// };

// export default PostCard;
