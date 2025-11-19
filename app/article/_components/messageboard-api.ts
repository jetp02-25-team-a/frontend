"use client";

import { API_SERVER } from "@/app/config/api-path";
import { useAuth } from "@/hooks/use-Auth";

export function useMessageBoard() {
  const { getAuthHeader } = useAuth();

  async function sendComment(postId: number, content: string) {
    const res = await fetch(`${API_SERVER}/article/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),  // ⬅️ otomatis masukkan JWT
      },
      body: JSON.stringify({ content }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "評論發送失敗");

    return json.comment;
  }

  async function getComments(postId: number) {
    const res = await fetch(`${API_SERVER}/article/${postId}/comments`);
    const json = await res.json();
    return json.comments;
  }

  return { sendComment, getComments };
}
