// 'use client';
// import { useState } from 'react';

// export default function MessageBoard() {
//   const [messages, setMessages] = useState<string[]>([]);
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (input.trim()) {
//       setMessages([...messages, input]);
//       setInput('');
//     }
//   };

//   return (
//     <div className="mt-12 border-t pt-6">
//       <h2 className="text-xl font-semibold mb-4">💬 Message Board</h2>
//       <div className="space-y-3 mb-4">
//         {messages.map((msg, idx) => (
//           <div key={idx} className="bg-gray-100 px-4 py-2 rounded shadow-sm">
//             {msg}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-3">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Write a message..."
//           className="flex-1 border border-gray-300 rounded px-4 py-2"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import toast from 'react-hot-toast';
// import { API_SERVER } from '@/app/config/api-path';
// import { useAuth } from '@/hooks/use-Auth';

// interface CommentItem {
//   id: number;
//   userId: number;
//   username: string;
//   content: string;
//   createdAt: string;
// }

// interface Props {
//   articleId?: string | number | null;
// }

// export default function MessageBoard({ articleId }: Props) {
//   const { user, getAuthHeader } = useAuth();
//   const isLoggedIn = !!user?.id;

//   const [comments, setComments] = useState<CommentItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [content, setContent] = useState('');
//   const [editingId, setEditingId] = useState<number | null>(null);

//   /* ==========================================================
//    * GET semua komentar
//    * ========================================================== */
//   const fetchComments = useCallback(async () => {
//     if (!articleId) return;

//     try {
//       const res = await fetch(`${API_SERVER}/article/${articleId}/comments`);

//       if (!res.ok) {
//         toast.error('評論加載失敗');
//         return;
//       }

//       const data = await res.json();
//       setComments(data.comments || []);
//     } catch (error) {
//       console.error('Fetch comments error:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [articleId]);

//   useEffect(() => {
//     fetchComments();
//   }, [fetchComments]);

//   /* ==========================================================
//    * POST komentar baru
//    * ========================================================== */
//   const submitComment = async () => {
//     if (!isLoggedIn) return toast.error('Anda harus login untuk komentar');
//     if (!content.trim()) return toast.error('Komentar tidak boleh kosong');

//     try {
//       const res = await fetch(`${API_SERVER}/article/${articleId}/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...getAuthHeader(),
//         },
//         body: JSON.stringify({ content }),
//       });

//       const data = await res.json();

//       if (!res.ok) return toast.error(data.message || '新增評論失敗');

//       setComments((prev) => [data.comment, ...prev]);
//       setContent('');
//       toast.success('Komentar ditambahkan');
//     } catch (error) {
//       console.error('提交評論錯誤:', error);
//       toast.error('評論加載失敗');
//     }
//   };

//   /* ==========================================================
//    * EDIT komentar
//    * ========================================================== */
//   const saveEdit = async (commentId: number) => {
//     if (!content.trim()) return toast.error('評論不能為空');

//     try {
//       const res = await fetch(
//         `${API_SERVER}/article/${articleId}/comments/${commentId}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             ...getAuthHeader(),
//           },
//           body: JSON.stringify({ content }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) return toast.error(data.message);

//       setComments((prev) =>
//         prev.map((c) => (c.id === commentId ? { ...c, content } : c))
//       );

//       setEditingId(null);
//       setContent('');
//       toast.success('評論編輯成功');
//     } catch (error) {
//       console.error('編輯錯誤:', error);
//       toast.error('編輯評論失敗');
//     }
//   };

//   /* ==========================================================
//    * DELETE komentar
//    * ========================================================== */
//   const deleteComment = async (id: number) => {
//     try {
//       const res = await fetch(
//         `${API_SERVER}/article/${articleId}/comments/${id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             ...getAuthHeader(),
//           },
//         }
//       );

//       if (!res.ok) {
//         const data = await res.json();
//         return toast.error(data.message || '刪除評論失敗');
//       }

//       setComments((prev) => prev.filter((c) => c.id !== id));
//       toast.success('評論已刪除');
//     } catch (error) {
//       console.error('編輯錯誤:', error);
//       toast.error('刪除評論失敗');
//     }
//   };

//   /* ==========================================================
//    * UI
//    * ========================================================== */
//   if (!articleId) return <p>❌ 未找到貼文 ID</p>;
//   if (loading) return <p>評論正在加載...</p>;

//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-4">💬 Message Board</h2>

//       {/* INPUT KOMENTAR */}
//       {isLoggedIn ? (
//         <div className="mb-6">
//           <textarea
//             className="w-full border p-3 rounded-lg"
//             placeholder="編寫評論..."
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />

//           {editingId ? (
//             <button
//               onClick={() => saveEdit(editingId)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-2"
//             >
//               💾 儲存變更
//             </button>
//           ) : (
//             <button
//               onClick={submitComment}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg mt-2"
//             >
//               ➕ 增加評論
//             </button>
//           )}
//         </div>
//       ) : (
//         <p className="text-gray-500">請登入再發表評論.</p>
//       )}

//       {/* LIST KOMENTAR */}
//       <div className="space-y-4">
//         {comments.length === 0 && (
//           <p className="text-gray-600">尚未有評論</p>
//         )}

//         {comments.map((c) => (
//           <div key={c.id} className="border p-4 rounded-lg shadow-sm">
//             <div className="flex justify-between">
//               <strong>{c.username}</strong>
//               <small className="text-gray-500">
//                 {new Date(c.createdAt).toLocaleString()}
//               </small>
//             </div>

//             <p className="mt-2">{c.content}</p>

//             {user?.id === c.userId && (
//               <div className="flex gap-3 mt-3 text-sm">
//                 <button
//                   onClick={() => {
//                     setEditingId(c.id);
//                     setContent(c.content);
//                   }}
//                   className="text-blue-600"
//                 >
//                   ✏️ Edit
//                 </button>

//                 <button
//                   onClick={() => deleteComment(c.id)}
//                   className="text-red-600"
//                 >
//                   🗑️ Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { API_SERVER } from '@/app/config/api-path';
import { useAuth } from '@/hooks/use-Auth';

interface CommentItem {
  id: number;
  userId: number;
  username: string;
  content: string;
  createdAt: string;
}

interface Props {
  articleId?: string | number | null;
}

export default function MessageBoard({ articleId }: Props) {
  const { user, getAuthHeader } = useAuth();
  const isLoggedIn = !!user?.id;

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  /** ======================================================
   * FETCH COMMENTS
   * ====================================================== */
  const fetchComments = useCallback(async () => {
    if (!articleId) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_SERVER}/article/${articleId}/comments`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Load comments failed');

      setComments(data.comments || []);
    } catch (error: any) {
      console.error('Fetch comments error:', error);
      toast.error(error?.message || '傳送留言失敗');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /** ======================================================
   * SUBMIT COMMENT
   * ====================================================== */
  const submitComment = async () => {
    if (!isLoggedIn) return toast.error('請登入後才留言');
    if (!content.trim()) return toast.error('留言不能空白');

    try {
      const res = await fetch(`${API_SERVER}/article/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (!res.ok)
        return toast.error(data.message || 'Gagal menambahkan komentar');

      setComments((prev) => [data.comment, ...prev]);
      setContent('');
      toast.success('留言已成功加上');
    } catch (error: any) {
      console.error('Submit comment error:', error);
      toast.error(error?.message || '載入留言失敗');
    }
  };

  /** ======================================================
   * EDIT COMMENT
   * ====================================================== */
  const saveEdit = async (commentId: number) => {
    if (!content.trim()) return toast.error('留言不能空白');

    try {
      const res = await fetch(
        `${API_SERVER}/article/${articleId}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        return toast.error(data.message || 'Gagal mengedit komentar');

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content } : c))
      );
      setEditingId(null);
      setContent('');
      toast.success('留言已成功修改');
    } catch (error: any) {
      console.error('Edit comment error:', error);
      toast.error(error?.message || '修改留言失敗');
    }
  };

  /** ======================================================
   * DELETE COMMENT
   * ====================================================== */
  const deleteComment = async (commentId: number) => {
    try {
      const res = await fetch(
        `${API_SERVER}/article/${articleId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: getAuthHeader() as HeadersInit,
        }
      );

      const data = await res.json();
      if (!res.ok)
        return toast.error(data.message || 'Gagal menghapus komentar');

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success('留言成功刪除');
    } catch (error: any) {
      console.error('Delete comment error:', error);
      toast.error(error?.message || '刪除留言失敗');
    }
  };

  /** ======================================================
   * UI RENDER
   * ====================================================== */
  if (loading) return <p>Memuat komentar...</p>;
  if (!articleId) return <p>❌ Tidak ada ID artikel</p>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">💬 留言版</h2>

      {isLoggedIn ? (
        <div className="mb-6">
          <textarea
            className="w-full border p-3 rounded-lg"
            placeholder="編寫留言..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {editingId ? (
            <button
              onClick={() => saveEdit(editingId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-2"
            >
              💾 儲存變更
            </button>
          ) : (
            <button
              onClick={submitComment}
              className="px-4 py-2 bg-green-600 text-white rounded-lg mt-2"
            >
              ➕ 新增留言
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500">登入後發送留言.</p>
      )}

      <div className="space-y-4">
        {comments.length === 0 && <p className="text-gray-600">尚未有留言</p>}
        {comments.map((c) => (
          <div key={c.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <strong>{c.username}</strong>
              <small className="text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
            <p className="mt-2">{c.content}</p>
            {user?.id === c.userId && (
              <div className="flex gap-3 mt-2 text-sm">
                <button
                  onClick={() => {
                    setEditingId(c.id);
                    setContent(c.content);
                  }}
                  className="text-blue-600"
                >
                  ✏️ 修改
                </button>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="text-red-600"
                >
                  🗑️ 刪除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
