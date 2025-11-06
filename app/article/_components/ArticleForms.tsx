'use client';

export default function ArticleForm() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* <h1 className="text-2xl font-bold mb-6">Write Travel Article</h1> */}

      {/* Konten akan ditambahkan di sini */}
      {/* <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <p className="text-gray-500">
            Halaman ini masih kosong. Silakan tambahkan komponen form atau
            konten lainnya.
    //       </p>
    //     </div> */}
    </div>
    // </div>
  );
}

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
