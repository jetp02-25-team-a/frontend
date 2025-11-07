'use client';

import React from 'react';

interface DetailFormProps {
  article: {
    title?: string;
    location?: string;
    content?: string;
    photos?: string | string[];
  };
}

export default function DetailForm({ article }: DetailFormProps) {
  const photoUrl = Array.isArray(article.photos)
    ? article.photos[0]
    : article.photos;

  return (
    <div className="relative bg-white shadow-lg rounded-2xl p-6 overflow-hidden">
      {/* 🔸 Gambar di kanan atas */}
      {/* {http://localhost:3005/api/9840962b-43fb-4690-bf35-b3dbfefa12ed.jpg} && ( */}
      <div className="absolute top-4 right-4 w-32 h-32">
        <img
          src={
            'http://localhost:3005/api/9840962b-43fb-4690-bf35-b3dbfefa12ed.jpg'
          }
          alt={article.title || 'Article Photo'}
          className="w-full h-full object-cover rounded-lg shadow-md border"
        />
      </div>

      {/* 🔹 Konten artikel */}
      <div className="pr-40">
        {' '}
        {/* beri ruang untuk gambar kanan */}
        <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
        <p className="text-gray-500 mb-4">📍 {article.location}</p>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </p>
      </div>
    </div>
  );
}

// 'use client';

// export default function DetailForms() {
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1>
//       <div className="grid grid-cols-12 gap-6">
//         <div className="col-span-12">
//           <p className="text-gray-500">
//             Halaman ini masih kosong. Silakan tambahkan komponen form atau
//             konten lainnya.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// export default function ArticleForm() {
//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       {/* <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1>

//       {/* Konten akan ditambahkan di sini */}
//       <div className="grid grid-cols-12 gap-6">
//         <div className="col-span-12">
//           <p className="text-gray-500">
//             Halaman ini masih kosong. Silakan tambahkan komponen form atau
//             konten lainnya.
//            </p>
//     /    </div>
//     </div>
//      </div>
//   );
// }

// 'use client';
// import { useState } from 'react';

// export default function ArticleForm() {
//   const [form, setForm] = useState({
//     userId: '',
//     title: '',
//     location: '',
//     content: '',
//     photo: null as File | null,
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setForm({ ...form, photo: e.target.files[0] });
//     }
//   };

//   const handleSubmit = () => {
//     console.log('Submitted:', form);
//   };

//   return (
//     <form className="grid grid-cols-12 gap-6">
//       <div className="col-span-12 md:col-span-6">
//         <label className="block mb-2 font-medium">User ID</label>
//         <input
//           type="text"
//           name="userId"
//           value={form.userId}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-4 py-2"
//         />
//       </div>

//       <div className="col-span-12 md:col-span-6">
//         <label className="block mb-2 font-medium">Title</label>
//         <input
//           type="text"
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-4 py-2"
//         />
//       </div>

//       <div className="col-span-12 md:col-span-6">
//         <label className="block mb-2 font-medium">Location</label>
//         <input
//           type="text"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-4 py-2"
//         />
//       </div>

//       <div className="col-span-12">
//         <label className="block mb-2 font-medium">Content</label>
//         <textarea
//           name="content"
//           value={form.content}
//           onChange={handleChange}
//           rows={6}
//           className="w-full border border-gray-300 rounded px-4 py-2 resize-none"
//         />
//       </div>

//       {/* <div className="col-span-12">
//         <label className="block mb-2 font-medium">Upload Photo</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handlePhotoUpload}
//           className="w-full border border-gray-300 rounded px-4 py-2"
//         />
//       </div> */}

//       {/* <div className="col-span-12 text-right">
//         <button
//           type="button"
//           onClick={handleSubmit}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Submit Article
//         </button>
//       </div> */}
//     </form>
//   );
// }
