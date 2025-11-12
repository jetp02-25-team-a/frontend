'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-Auth';
import { API_SERVER } from '@/app/config/api-path';

interface Article {
  id?: string;
  userId: string;
  title: string;
  location: string;
  content: string;
  photos: string | string[];
  likes?: number;
}

const locationOptions = [
  { label: '台北', value: '1' },
  { label: '桃園', value: '2' },
  { label: '新竹', value: '3' },
  { label: '苗栗', value: '4' },
  { label: '台中', value: '5' },
  { label: '彰化', value: '6' },
  { label: '嘉義', value: '7' },
  { label: '台南', value: '8' },
  { label: '高雄', value: '9' },
  { label: '屏東', value: '10' },
  { label: '金門', value: '11' },
  { label: '澎湖', value: '12' },
];

export default function EditArticlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pid = searchParams.get('id');
  const { user, getAuthHeader } = useAuth();

  const [article, setArticle] = useState<Article>({
    userId: '',
    title: '',
    location: '',
    content: '',
    photos: '',
    likes: 0,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch article by ID
  useEffect(() => {
    if (!pid) {
      setIsLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_SERVER}/article/${pid}`);
        if (!res.ok) throw new Error(`Failed to fetch article: ${res.status}`);
        const data = await res.json();
        setArticle({
          id: data.id,
          userId: data.author,
          title: data.title,
          location:
            locationOptions.find((opt) => opt.label === data.location)?.value ||
            '',
          content: data.content,
          photos: data.photos || '',
          likes: data.likesCount || 0,
        });
      } catch (err) {
        console.error('❌ Error fetching article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [pid]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('title', article.title);
      form.append('locationId', article.location);
      form.append('content', article.content);
      if (photoFile) form.append('photo', photoFile);

      const res = await fetch(`${API_SERVER}/article/${pid}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
        },
        body: form,
      });

      if (!res.ok) throw new Error('Failed to submit data');

      alert('✅ Article submitted successfully!');
      router.push(`/article/review?id=${pid}`);
    } catch (err) {
      console.error('❌ Submit error:', err);
      alert('❌ Failed to submit article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📝 Edit Article 編輯文章
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={article.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter article title"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Location 地點
          </label>
          <select
            name="location"
            value={article.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="">選擇地點</option>
            {locationOptions.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Content 內容
          </label>
          <textarea
            name="content"
            value={article.content}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
            placeholder="Write your article here..."
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Photos</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-gray-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
}
const handleLike = async () => {
  if (!article.id) return;
  if (isLiking) return;

  setIsLiking(true);
  try {
    const res = await fetch(`${API_SERVER}/article/${article.id}/like`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Failed to like article');
    }

    setArticle((prev) => ({
      ...prev,
      likes: (prev.likes || 0) + 1,
    }));
  } catch (err) {
    console.error('Like Error:', err);
  } finally {
    setIsLiking(false);
  }
};

// 'use client';

// import React, { useState, useEffect } from 'react';

// import { useSearchParams, useRouter } from 'next/navigation';
// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import MessageBoard from '../_components/MessageBoard';
// import StatusDisplay from '../_components/StatusDisplay';
// import { useAuth } from '../../../hooks/use-Auth';
// import { API_SERVER } from '@/app/config/api-path';
// import Link from 'next/link';

// interface ArticleFormData {
//   userId: string;
//   title: string;
//   location: string;
//   content: string;
//   photos: File | null;
// }

// interface Article {
//   id?: string;
//   userId: string;
//   title: string;
//   location: string;
//   content: string;
//   photos: string | string[];
//   likes?: number;
// }

// const locationMap = {
//   台北: '1',
//   桃園: '2',
//   新竹: '3',
//   苗栗: '4',
//   台中: '5',
//   彰化: '6',
//   南投: '13',
//   雲林: '14',
//   嘉義: '7',
//   台南: '8',
//   高雄: '9',
//   屏東: '10',
//   台東: '15',
//   花蓮: '16',
//   宜蘭: '15',
//   金門: '11',
//   澎湖: '12',
// };

// export default function ArticleForm() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pid = searchParams.get('id');
//   const { user, getAuthHeader } = useAuth();

//   const [article, setArticle] = useState<Article>({
//     userId: '',
//     title: 'Cannot find Article',
//     location: '',
//     content: '',
//     photos: '',
//     likes: 0,
//   });

//   const [isLoading, setIsLoading] = useState(true);
//   const [isLiking, setIsLiking] = useState(false);

//   // --- 🔹 Fetch Data ---
//   const getArticle = async (articleId: string) => {
//     const URL = `${API_SERVER}/article/${articleId}`;
//     try {
//       const res = await fetch(URL);
//       if (!res.ok) {
//         throw new Error(`Failed to fetch article: ${res.status}`);
//       }

//       const resData = await res.json();
//       if (resData && resData.id) {
//         setArticle(resData);
//       } else {
//         throw new Error('Article data is empty or malformed.');
//       }
//     } catch (error) {
//       console.error('Fetch Error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleArticleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setArticle((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // --- 🔹 Lifecycle Hook ---
//   useEffect(() => {
//     if (pid) {
//       getArticle(pid);
//     } else {
//       setIsLoading(false);
//     }
//   }, [pid]);

//   // const [formData, setFormData] = useState<ArticleFormData>({
//   //   userId: '',
//   //   title: '',
//   //   location: '',
//   //   content: '',
//   //   photos: null,
//   // });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- 🔹 Handle Input Change ---
//   // const handleChange = (
//   //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   // ) => {
//   //   const { name, value } = e.target;
//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [name]: value,
//   //   }));
//   // };

//   // --- 🔹 Handle File Upload ---
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     // setFormData((prev) => ({
//     //   ...prev,
//     //   photos: file,
//     // }));
//   };

//   // --- 🔹 Handle Submit ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const form = new FormData();
//       // form.append('userId', );
//       form.append('user', user.id);
//       form.append('title', article.title);
//       form.append('location', article.location);
//       form.append('content', article.content);

//       // if (article.photos) form.append('photos', article.photos);

//       const res = await fetch(`http://localhost:3005/api/article/${pid}`, {
//         method: 'PUT',
//         headers: {
//           ...getAuthHeader(),
//         },
//         body: form,
//       });

//       if (!res.ok) throw new Error('Failed to submit data'){

//       alert('✅ Article submitted successfully!');
//       // setFormData({
//       //   userId: '',
//       //   title: '',
//       //   location: '',
//       //   content: '',
//       //   photos: null,
//       // });
//     } catch (err) {
//       console.error(err);
//       alert('❌ Failed to submit article');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// }

//   // --- 🔹 UI ---
//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//         📝 Edit Article 編輯文章
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* User name */}
//         {/* <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             User 使用者
//           </label>
//           <input
//             type="text"
//             name="userId"
//             value={formData.userId}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Enter your user ID"
//             required
//           />
//         </div> */}

//         {/* Title */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={article.title}
//             onChange={handleArticleChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Enter article title"
//             required
//           />
//         </div>

//         {/* Location */}

//         <select
//           name="location"
//           value={locationMap[article.location]}
//           onChange={handleArticleChange}
//           className="border p-2"
//         >
//           <option value="">選擇地點</option>
//           <option value="1">台北</option>
//           <option value="2">桃園</option>
//           <option value="3">新竹</option>
//           <option value="4">苗栗</option>
//           <option value="5">台中</option>
//           <option value="6">彰化</option>
//           <option value="7">嘉義</option>
//           <option value="8">台南</option>
//           <option value="9">高雄</option>
//           <option value="10">屏東</option>
//           <option value="11">金門</option>
//           <option value="12">澎湖</option>
//         </select>

//         {/* <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             Location 地點
//           </label>
//           <input
//             type="text"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Enter location"
//             required
//           />
//         </div> */}

//         {/* Content */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">
//             content 內容
//           </label>
//           <textarea
//             name="Content"
//             value={article.content}
//             onChange={handleArticleChange}
//             rows={5}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
//             placeholder="Write your article here..."
//             required
//           />
//         </div>

//         {/* Photos */}
//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Photos</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="block w-full text-gray-700"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-amber-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Article'}
//         </button>
//       </form>
//     </div>
//   );
// }

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { API_SERVER } from '@/app/config/api-path';
// import Link from 'next/link';
// import SidebarAction from '../_components/SidebarActions';
// import DetailForm from '../_components/DetailForms';
// import StatusDisplay from '../_components/StatusDisplay';

// interface Article {
//   id?: string;
//   title: string;
//   location: string;
//   content: string;
//   photos: string | string[] | File | null;
//   likes?: number;
// }

// export default function EditArticlePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pid = searchParams.get('pid');

//   const [article, setArticle] = useState<Article>({
//     title: '',
//     location: '',
//     content: '',
//     photos: null,
//   });

//   // 🔹 載入現有文章資料
//   useEffect(() => {
//     const fetchArticle = async () => {
//       if (!pid) return;
//       try {
//         const res = await fetch(`${API_SERVER}/article/review/${pid}`);
//         const data = await res.json();
//         setArticle({
//           title: data.title || '',
//           location: data.location?.toString() || '',
//           content: data.content || '',
//           photos: data.photos || null,
//         });
//       } catch (err) {
//         console.error('❌ 無法載入文章資料:', err);
//       }
//     };
//     fetchArticle();
//   }, [pid]);

//   // 🔹 處理一般欄位改變
//   const handleArticleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setArticle((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // 🔹 處理上傳圖片
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       setArticle((prev) => ({
//         ...prev,
//         photos: file,
//       }));
//     }
//   };

//   // 🔹 提交更新
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append('title', article.title);
//       formData.append('location', article.location);
//       formData.append('content', article.content);
//       if (article.photos instanceof File) {
//         formData.append('photos', article.photos);
//       }

//       const res = await fetch(`${API_SERVER}/article/edit/${pid}`, {
//         method: 'PUT',
//         body: formData,
//       });

//       if (res.ok) {
//         alert('✅ 文章更新成功！');
//         router.push(`/article/review?pid=${pid}`);
//       } else {
//         alert('❌ 更新失敗，請再試一次。');
//       }
//     } catch (err) {
//       console.error('❌ 提交錯誤:', err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           ✏️ 編輯文章
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* 標題 */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">標題</label>
//             <input
//               type="text"
//               name="title"
//               value={article.title}
//               onChange={handleArticleChange}
//               placeholder="輸入文章標題"
//               className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
//               required
//             />
//           </div>

//           {/* 地點 */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">地點</label>
//             <select
//               name="location"
//               value={article.location}
//               onChange={handleArticleChange}
//               className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
//               required
//             >
//               <option value="">選擇地點</option>
//               <option value="1">台北</option>
//               <option value="2">桃園</option>
//               <option value="3">新竹</option>
//               <option value="4">苗栗</option>
//               <option value="5">台中</option>
//               <option value="6">彰化</option>
//               <option value="7">嘉義</option>
//               <option value="8">台南</option>
//               <option value="9">高雄</option>
//               <option value="10">屏東</option>
//               <option value="11">金門</option>
//               <option value="12">澎湖</option>
//             </select>
//           </div>

//           {/* 內容 */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">內容</label>
//             <textarea
//               name="content"
//               value={article.content}
//               onChange={handleArticleChange}
//               placeholder="輸入旅遊心得..."
//               rows={6}
//               className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
//               required
//             />
//           </div>

//           {/* 圖片 */}
//           <div>
//             <label className="block text-gray-700 mb-2 font-medium">
//               上傳圖片
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="block w-full text-gray-700"
//             />
//             {typeof article.photos === 'string' && (
//               <img
//                 src={article.photos}
//                 alt="文章圖片"
//                 className="mt-3 w-full rounded-lg border object-cover max-h-64"
//               />
//             )}
//           </div>

//           {/* 提交按鈕 */}
//           <button
//             type="submit"
//             className="w-full bg-amber-700 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
//           >
//             💾 儲存變更
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
