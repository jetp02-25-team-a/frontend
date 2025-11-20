'use client';

import { useState } from 'react';
import { useMessageBoard } from '../_lib/messageboard-api';
import { useAuth } from '@/hooks/use-Auth';

export default function CommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const { sendComment } = useMessageBoard();
  const { isAuthenticated } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('您必須登入才能發表評論。');
      return;
    }

    setLoading(true);
    try {
      await sendComment(postId, content);
      setContent(''); // reset input
      alert('傳送留言!');
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        className="border w-full p-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="編寫留言..."
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '正在傳送...' : '傳送'}
      </button>
    </form>
  );
}

// 'use client';

// import { useState } from 'react';

// export default function CommentForm({ postId }: { postId: number }) {
//   const [username, setUsername] = useState('');
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await fetch(`http://localhost:4000/api/messageboard`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ postId, username, content }),
//       });
//       setUsername('');
//       setContent('');
//       alert('留言已送出！');
//     } catch (err) {
//       console.error(err);
//       alert('留言失敗');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl shadow-sm">
//       <h3 className="font-semibold mb-2">發表留言</h3>
//       <input
//         type="text"
//         placeholder="你的名字"
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//       />
//       <textarea
//         placeholder="寫下你的想法..."
//         className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         required
//       />
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
//       >
//         {loading ? '送出中...' : '送出留言'}
//       </button>
//     </form>
//   );
// }
