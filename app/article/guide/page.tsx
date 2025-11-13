'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/use-Auth';

export default function ArticleForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { user, getAuthHeader } = useAuth();

  // router
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    //fake userId
    // formData.append('userId', user.id);

    formData.append('title', title);
    formData.append('locationId', location);
    formData.append('content', content);
    if (file) formData.append('photo', file);

    const res = await fetch('http://localhost:3005/api/article', {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    const data = await res.json();
    console.log('✅ Article saved:', data);
    alert('Article submitted successfully!');
    console.log(data.post.id);
    //redirect to frontend path
    router.push(`http://localhost:3000/article/detail?id=${data.post.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="text"
        name="title"
        value={title}
        placeholder="文章標題"
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2"
      />
      <select
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2"
      >
        <option value="">選擇地點</option>
        <option value="1">台北</option>
        <option value="2">桃園</option>
        <option value="3">新竹</option>
        <option value="4">苗栗</option>
        <option value="5">台中</option>
        <option value="6">彰化</option>
        <option value="7">嘉義</option>
        <option value="8">台南</option>
        <option value="9">高雄</option>
        <option value="10">屏東</option>
        <option value="11">金門</option>
        <option value="12">澎湖</option>
        <option value="13">南投</option>
        <option value="14">雲林</option>
        <option value="15">台東</option>
        <option value="16">花蓮</option>
      </select>
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="寫下你的旅遊筆記..."
        className="border p-2 h-32"
      />
      {/* <input
        type="file"
        name="image"
        onChange={(e) => setFile(e.target.files?.[0] || null)} */}
      {/* 圖片上傳 */}
      <input
        type="file" // Asumsi ada type="file" di baris sebelumnya
        name="photo"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />{' '}
      {/* 圖片上傳 - Pindahkan komentar ke luar tag input */}
      <label className="block text-sm font-medium text-gray-700 pt-4">
        Upload Foto (限制上傳2張)
      </label>
      {/* <label className="block text-sm font-medium text-gray-700 pt-4">
           Upload Foto (最多上傳5張 - 主圖 + 4張副圖)
        </label>
        <input
        type="file"
        multiple
                  accept="image/*"
        onChange={handleImageChange}
           className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
         /> */}
      {/* /> */}
      <button
        type="submit"
        className="bg-amber-700 text-white py-2 px-4 rounded hover:bg-orange-600"
      >
        Send Article 送出文章
      </button>
    </form>
  );
}

// 'use client';

// import React, { useState } from 'react';
// import SidebarActions from '../_components/SidebarActions';
// import LocationDropdown from '@/app/components/Location';
// import { Location } from '@/app/components/Location/types';

// export default function GuidePage() {
//   // ✅ Hook harus berada di dalam komponen (di sini)
//   const [location, setLocation] = useState<Location | undefined>();
//   const [articleData, setArticleData] = useState({
//     author_name: '',
//     title: '',
//     content: '',
//     main_image: null as File | null,
//     other_images: [] as File[],
//   });

//   // ✅ Handler input teks
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setArticleData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // ✅ Handler upload gambar
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setArticleData((prevData) => ({
//         ...prevData,
//         main_image: files.length > 0 ? files[0] : null,
//         other_images: files.slice(1),
//       }));
//     }
//   };

//   // ✅ Handler submit
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('待發送資料 Data to be sent:', { ...articleData, location });
//     alert('表單成功送出 Form submitted successfully (cek console log).');
//   };

//   // ✅ UI Layout
//   return (
//     <div className="flex justify-center gap-8 my-10">
//       {/* Sidebar di kiri */}
//       <SidebarActions />

//       {/* Form di kanan */}
//       <form
//         onSubmit={handleSubmit}
//         className="space-y-4 p-6 bg-white shadow-lg rounded-lg max-w-2xl w-full"
//       >
//         <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
//           🇹🇼 旅遊文章發佈表單
//         </h2>

//         {/* 發文者名稱 */}
//         <input
//           type="text"
//           name="author_name"
//           value={articleData.author_name}
//           onChange={handleChange}
//           placeholder="author_name - 發文者"
//           className="border p-2 w-full rounded focus:ring-amber-500 focus:border-amber-500"
//           required
//         />

//         {/* 旅遊標題 */}
//         <input
//           type="text"
//           name="title"
//           value={articleData.title}
//           onChange={handleChange}
//           placeholder="Travel title - 旅遊標題"
//           className="border p-2 w-full rounded focus:ring-amber-500 focus:border-amber-500"
//           required
//         />

//         {/* 地區選擇下拉選單 */}
//         <LocationDropdown selected={location} onChange={setLocation} />

//         {/* 旅遊內容 */}
//         <textarea
//           name="content"
//           value={articleData.content}
//           onChange={handleChange}
//           placeholder="content - 旅遊分享內容"
//           className="border p-2 w-full h-48 rounded focus:ring-amber-500 focus:border-amber-500"
//           required
//         />

//         {/* 圖片上傳 */}
//         <label className="block text-sm font-medium text-gray-700 pt-4">
//           Upload Foto (最多上傳5張 - 主圖 + 4張副圖)
//         </label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//           className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
//         />
//         <p className="text-xs text-gray-500">
//           已選取檔案數量: {articleData.main_image ? 1 + articleData.other_images.length : articleData.other_images.length} 個
//         </p>

//         {/* 送出按鈕 */}
//         <button
//           type="submit"
//           className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-lg transition duration-150 ease-in-out w-full"
//         >
//           Send Article 送出文章
//         </button>
//       </form>
//     </div>
//   );
// }

//  'use client';

// import React, { useState } from 'react';
// import SidebarActions from '../_components/SidebarActions';
// import LocationDropdown from '@/app/components/Location'; // 假設這是您的地區選擇器組件
// import { Location } from '@/app/components/Location/types'; // 假設這是您的 Location 類型

// // 頁面主組件
// export default function GuidePage() {
//   // 設置 State
//   const [location, setLocation] = useState<Location | undefined>();
//   const [articleData, setArticleData] = useState({
//     author_name: '',
//     title: '',
//     content: '',
//     main_image: null as File | null,
//     other_images: [] as File[],
//   });

//   // 處理文字輸入變化
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setArticleData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // 處理圖片上傳變化
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setArticleData((prevData) => ({
//         ...prevData,
//         // 假設第一張是 main_image，其餘為 other_images
//         main_image: files.length > 0 ? files[0] : null,
//         other_images: files.slice(1),
//       }));
//     }
//   };

//   // 處理表單提交
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('待發送資料Data to be sent:', { ...articleData, location });
//     // 這裡可以加入 API 呼叫邏輯
//     alert('表單成功送出Form submitted successfully (cek console log).');
//   };
//   <div className="flex">
//             <SidebarActions/>

//           </div>

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto my-10"
//     >
//       <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
//         🇹🇼 旅遊文章發佈表單
//       </h2>

//       {/* 發文者名稱 */}
//       <input
//         type="text"
//         name="author_name"
//         value={articleData.author_name}
//         onChange={handleChange}
//         placeholder="author_name - 發文者"
//         className="border p-2 w-full rounded focus:ring-amber-500 focus:border-amber-500"
//         required
//       />

//       {/* 旅遊標題 */}
//       <input
//         type="text"
//         name="title"
//         value={articleData.title}
//         onChange={handleChange}
//         placeholder="Travel title - 旅遊標題"
//         className="border p-2 w-full rounded focus:ring-amber-500 focus:border-amber-500"
//         required
//       />

//       {/* 地區選擇下拉選單 */}
//       <LocationDropdown selected={location} onChange={(loc) => setLocation(loc)} />

//       {/* 旅遊內容 */}
//       <textarea
//         name="content"
//         value={articleData.content}
//         onChange={handleChange}
//         placeholder="content - 旅遊分享內容"
//         className="border p-2 w-full h-48 rounded focus:ring-amber-500 focus:border-amber-500"
//         required
//       />

//       {/* 圖片上傳 */}
//       <label className="block text-sm font-medium text-gray-700 pt-4">
//         Upload Foto (最多上傳5張 - 主圖 + 4張副圖)
//       </label>
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleImageChange}
//         className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
//       />
//       <p className="text-xs text-gray-500">
//         已選取檔案數量: {articleData.main_image ? 1 + articleData.other_images.length : articleData.other_images.length} 個
//       </p>

//       {/* 送出按鈕 */}
//       <button
//         type="submit"
//         className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-lg transition duration-150 ease-in-out w-full"
//       >
//         Send Article 送出文章
//       </button>
//     </form>
//   );
// }
//   // 設置 State
//   const [location, setLocation] = useState<Location | undefined>();
//   const [articleData, setArticleData] = useState({
//     author_name: '',
//     title: '',
//     content: '',
//     main_image: null as File | null,
//     other_images: [] as File[],
//   });

//   // 處理文字輸入變化
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setArticleData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // 處理圖片上傳變化
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setArticleData((prevData) => ({
//         ...prevData,
//         // 假設第一張是 main_image，其餘為 other_images
//         main_image: files.length > 0 ? files[0] : null,
//         other_images: files.slice(1),
//       }));
//     }
//   };

//   // 處理表單提交
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('待發送資料Data to be sent:', { ...articleData, location });
//     // 這裡可以加入 API 呼叫邏輯
//     alert('表單成功送出Form submitted successfully (cek console log).');
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto my-10"
//     >
//       <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
//         🇹🇼 旅遊文章發佈表單
//       </h2>

//       {/* 發文者名稱 */}
//       <input
//         type="text"
//         name="author_name"
//         value={articleData.author_name}
//         onChange={handleChange}
//         placeholder="author_name - 發文者"
//         className="border p-2 w-full rounded focus:ring-amber-500 focus:border-amber-500"
//         required
//       />

//       {/* 旅遊標題 */}
//       <input
//         type="text"
//         name="title"
//         value={articleData.title}
//         onChange={handleChange}
//         placeholder="Travel title - 旅遊標題"
//         className="border p-2 w-full rounded focus:ring-amber-500 focus:border-amber-500"
//         required
//       />

//       {/* 地區選擇下拉選單 */}
//       <LocationDropdown selected={location} onChange={(loc) => setLocation(loc)} />

//       {/* 旅遊內容 */}
//       <textarea
//         name="content"
//         value={articleData.content}
//         onChange={handleChange}
//         placeholder="content - 旅遊分享內容"
//         className="border p-2 w-full h-48 rounded focus:ring-amber-500 focus:border-amber-500"
//         required
//       />

//       {/* 圖片上傳 */}
//       <label className="block text-sm font-medium text-gray-700 pt-4">
//         Upload Foto (最多上傳5張 - 主圖 + 4張副圖)
//       </label>
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleImageChange}
//         className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
//       />
//       <p className="text-xs text-gray-500">
//         已選取檔案數量: {articleData.main_image ? 1 + articleData.other_images.length : articleData.other_images.length} 個
//       </p>

//       {/* 送出按鈕 */}
//       <button
//         type="submit"
//         className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-lg transition duration-150 ease-in-out w-full"
//       >
//         Send Article 送出文章
//       </button>
//     </form>
//   );

// 'use client';

// import React, { useState } from 'react';
// import LocationDropdown from '@/app/components/Location';
// import { Location } from '@/app/components/Location/types';
// import LocationSelect from '../_components/LocationSelect';

// export default function GuidePage() {
//   const [location, setLocation] = useState<Location | undefined>();
//   const [articleData, setArticleData] = useState({
//     author_name: '',
//     title: '',
//     content: '',
//     main_image: null as File | null,
//     other_images: [] as File[],
//   });

//   const App: React.FC = () => {
//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>React 地區選擇器範例</h1>
//       <LocationSelect />
//       {/* 其他應用程式內容... */}
//     </div>
//   );
// };

// export default App;

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setArticleData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setArticleData((prevData) => ({
//         ...prevData,
//         main_image: files.length > 0 ? files[0] : null,
//         other_images: files.slice(1),
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('待發送資料Data to be sent:', { ...articleData, location });
//     alert('表單成功送出Form submitted successfully (cek console log).');
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 p-6 bg-white shadow-lg rounded-lg"
//     >
//       <input
//         type="text"
//         name="author_name"
//         value={articleData.author_name}
//         onChange={handleChange}
//         placeholder="author_name - 發文者"
//         className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
//       />

//       <input
//         type="text"
//         name="title"
//         value={articleData.title}
//         onChange={handleChange}
//         placeholder="Travel title - 旅遊標題"
//         className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
//       />

//       <LocationDropdown selected={location} onChange={(loc) => setLocation(loc)} />

//       <textarea
//         name="content"
//         value={articleData.content}
//         onChange={handleChange}
//         placeholder="content - 旅遊分享內容"
//         className="border p-2 w-full h-48 rounded focus:ring-blue-500 focus:border-blue-500"
//       />

//       <label className="block text-sm font-medium text-gray-700 pt-4">
//         Upload Foto (最多上傳5張)
//       </label>
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleImageChange}
//         className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-blue-700 hover:file:bg-violet-100"
//       />

//       <button
//         type="submit"
//         className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-lg transition duration-150 ease-in-out w-full"
//       >
//         Send Article 送出文章
//       </button>
//     </form>
//   );
// }

// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import LocationDropdown from "@/app/components/Location";
// // import { Location } from '@/app/components/Location/types';
// // import Location from '@/app/components/Location/index';
// export default function GuidePage() {
//   const [location, setLocation] = useState<string | undefined>();
//   <LocationDropdown
//   selected={location}
//   onChange={(loc) => setLocation(loc)}
// />
//   const [articleData, setArticleData] = useState({
//     author_name: '',
//     title: '',
//     content: '',
//     main_image: null as File | null, // Tambahkan tipe File
//     other_images: [] as File[] // Tambahkan tipe Array File
//   });
//   // 1. Fungsi untuk input teks (Nama Penulis, Title, Content)
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setArticleData(prevData => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//   // 2. Fungsi untuk input file (Upload Foto)
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       c
// }onst files = Array.from(e.target.files);
//       // Asumsi: Foto pertama adalah main_image, sisanya other_images
//       setArticleData(prevData => ({
//         ...prevData,
//         main_image: files.length > 0 ? files[0] : null,
//         other_images: files.slice(1),
//       }));
//     }
//   };
//   // 3. Fungsi untuk mengirim formulir
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Data yang akan dikirim:', articleData);

//     // --- LOGIKA PENGIRIMAN DATA API DI SINI ---
//     // 1. Unggah Foto: Kirim main_image dan other_images ke endpoint unggah.
//     // 2. Dapatkan URL: Ambil URL foto yang telah diunggah.
//     // 3. Kirim Data Artikel: Kirim articleData (dengan URL) ke POST /api/articles.
//     alert('Formulir berhasil disubmit (cek console log). Logika API perlu ditambahkan.');
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-lg rounded-lg">
//         {/* Input Nama Penulis */}
//         <input
//           type="text"
//           name="author_name"
//           value={articleData.author_name}
//           onChange={handleChange}
//           placeholder="author_name-發文者"
//           className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
//         />
//         {/* Input Title */}
//         <input
//           type="text"
//           name="title"
//           value={articleData.title}
//           onChange={handleChange}
//           placeholder="Travel title-旅遊標題"
//           className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
//         />
//         {/* Input Location Dropdown (Pastikan komponen ini menerima props yang benar) */}
//         {/* <LocationDropdown setLocation={setLocation} /> */}

//         {/* Textarea Content */}
//         <textarea
//           name="content"
//           value={articleData.content}
//           onChange={handleChange}
//           placeholder="content-旅遊分享內容"
//           className="border p-2 w-full h-48 rounded focus:ring-blue-500 focus:border-blue-500"
//         />
//         {/* Input File Upload */}
//         <label className="block text-sm font-medium text-gray-700 pt-4">Upload Foto (Utama & Pendukung)</label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//           className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-blue-700 hover:file:bg-violet-100"
//         />
//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="bg-amber-600 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-lg transition duration-150 ease-in-out w-full"
//         >
//           send Article送出文章
//         </button>
//       </form>
//     </>
//   );

// 'use client';
// import React, {useState, useEffect, useReft} from 'react';
// // import { useState, useEffect, useRef } from 'react';
// import LocationDropdown from "@/app/components/Location";
// export default function GuidePage() {
//   const [location, setLocation] = useState<string | undefined>();
//   const [articleData, setArticleData] = useState({
//     author_name: '',
//     title: '',
//     content: '',
//     main_image: null, // save object temporary
//     other_images: []
//   });
//   return (
//     <>
//     <form onSubmit={handleSubmit} className="space-y-4">
//   <input
//     type="text"
//     name="author_name"
//     value={articleData.author_name}
//     onChange={handleChange}
//     placeholder="Author Name"
//     className="border p-2 w-full"
//   />
//   <input
//     type="text"
//     name="title"
//     value={articleData.title}
//     onChange={handleChange}
//     placeholder="Title"
//     className="border p-2 w-full"
//   />
//   <textarea
//     name="content"
//     value={articleData.content}
//     onChange={handleChange}
//     placeholder="Content"
//     className="border p-2 w-full"
//   />
//   <input
//     type="file"
//     multiple
//     accept="image/*"
//     onChange={handleImageChange}
//     className="border p-2 w-full"
//   />
//   <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//     Submit Article
//   </button>
// </form>
//     </>
// }
