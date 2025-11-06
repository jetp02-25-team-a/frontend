'use client';

import React, { useState } from 'react';
import { API_SERVER } from '../../../config/api-path';

interface Comment {
  username: string;
  avatarUrl: string;
  content: string;
}

interface CommentSectionProps {
  comments: Comment[];
  postId: number; // ID postingan tujuan komentar
}

export default function CommentSection({
  comments,
  postId,
}: CommentSectionProps) {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  // 🚀 Submit komentar ke backend Express/Prisma
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !content) {
      alert('Nama dan komentar wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_SERVER}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          username,
          avatarUrl: avatarUrl || '/default-avatar.png',
          content,
        }),
      });

      if (!res.ok) throw new Error('Gagal menambahkan komentar');

      const newComment = await res.json();

      // Tambahkan ke tampilan lokal
      setLocalComments([...localComments, newComment]);
      setUsername('');
      setAvatarUrl('');
      setContent('');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim komentar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-20">
      <h2 className="text-xl font-semibold mb-4 border-l-4 border-amber-500 pl-3">
        留言區
      </h2>

      {/* 🗨️ Daftar Komentar */}
      <div className="px-6 py-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Comment留言板</h3>

        {localComments.length > 0 ? (
          localComments.map((comment, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 mb-4 bg-white p-4 rounded-xl shadow-sm"
            >
              <img
                src={comment.avatarUrl}
                alt={comment.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">{comment.username}</p>
                <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Belum ada komentar.</p>
        )}
      </div>

      {/* ✍️ Form Tambah Komentar */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-gray-50 p-6 rounded-xl shadow-sm border"
      >
        <h4 className="text-md font-semibold mb-3">Tulis komentar</h4>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nama Anda"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="URL Foto Profil (opsional)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          />

          <textarea
            placeholder="Tulis komentar Anda di sini..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 h-24 resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </div>
      </form>
    </section>
  );
}

// import React from 'react';

// interface Comment {
//   username: string;
//   avatarUrl: string;
//   content: string;
// }

// interface CommentSectionProps {
//   comments: Comment[];
// }

// export default function CommentSection({ comments }: CommentSectionProps) {
//   return (
//      <section className="mb-20">
//         <h2 className="text-xl font-semibold mb-4 border-l-4 border-amber-500 pl-3">
//           留言區
//         </h2>
//         {/* <div className="space-y-6">
//           {mockData.comments.map((comment, idx) => (
//             <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm">
//               <img
//                 src={comment.avatarUrl}
//                 alt={comment.username}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               <div>
//                 <p className="font-medium text-gray-800">{comment.username}</p>
//                 <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
//               </div>
//             </div>
//           ))}
//         </div> */}

//      <section className="px-6 py-4 border-t">
//        <h2 className="text-xl font-semibold mb-4">Comment留言板</h2>
//       {comments.map((comment, idx) => (
//         <div key={idx} className="flex items-start gap-4 mb-4">
//           <img src={comment.avatarUrl} alt={comment.username} className="w-10 h-10 rounded-full" />
//          <div>
//            <p className="font-medium">{comment.username}</p>
//             <p className="text-gray-700">{comment.content}</p>
//           </div>
//         </div>
//       ))}
//     </section>
//   </section>
