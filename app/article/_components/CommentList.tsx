"use client";

import { useEffect, useState } from "react";
import { useMessageBoard } from "../_lib/messageboard-api";

export default function CommentList({ postId }: { postId: number }) {
  const { getComments } = useMessageBoard();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments(postId).then((data) => setComments(data));
  }, [postId]);

  return (
    <div className="space-y-4 mt-4">
      {comments.map((c: any) => (
        <div key={c.id} className="bg-gray-100 p-3 rounded">
          <p className="font-bold">{c.username}</p>
          <p>{c.content}</p>
          <p className="text-xs text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
