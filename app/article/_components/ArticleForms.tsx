'use client';
import { useState } from 'react';

export default function ArticleForm() {
  const [form, setForm] = useState({
    userId: '',
    title: '',
    location: '',
    content: '',
    photo: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, photo: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    console.log('Submitted:', form);
  };

  return (
    <form className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-6">
        <label className="block mb-2 font-medium">User ID</label>
        <input
          type="text"
          name="userId"
          value={form.userId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>

      <div className="col-span-12 md:col-span-6">
        <label className="block mb-2 font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div>

      <div className="col-span-12">
        <label className="block mb-2 font-medium">Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={6}
          className="w-full border border-gray-300 rounded px-4 py-2 resize-none"
        />
      </div>

      {/* <div className="col-span-12">
        <label className="block mb-2 font-medium">Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
      </div> */}

      {/* <div className="col-span-12 text-right">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Article
        </button>
      </div> */}
    </form>
  );
}

// 'use client';
// import { useState } from 'react';
// import { Input, TextArea, ImageUpload, Button } from '../_components/ui';

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

//   const handlePhotoUpload = (file: File) => {
//     setForm({ ...form, photo: file });
//   };

//   const handleSubmit = async () => {
//     // TODO: Integrasi backend
//     console.log('Submit:', form);
//   };

//   return (
//     <div className="grid grid-cols-12 gap-4 p-6">
//       <div className="col-span-12 md:col-span-6">
//         <Input
//           label="User ID"
//           name="userId"
//           value={form.userId}
//           onChange={handleChange}
//         />
//         <Input
//           label="Title"
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//         />
//         <Input
//           label="Location"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="col-span-12">
//         <TextArea
//           label="Content"
//           name="content"
//           value={form.content}
//           onChange={handleChange}
//         />
//       </div>
//       <div className="col-span-12">
//         <ImageUpload onUpload={handlePhotoUpload} />
//       </div>
//       <div className="col-span-12">
//         <Button onClick={handleSubmit}>Submit Article</Button>
//       </div>
//     </div>
//   );
// }
