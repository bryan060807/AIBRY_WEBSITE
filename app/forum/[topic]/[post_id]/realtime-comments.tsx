"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export default function RealtimeComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🧠 Load session (logged-in user)
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Watch for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });
    };
    getUser();
  }, []);

  // 🧠 Load comments + Realtime updates
  useEffect(() => {
    const loadComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (!error && data) setComments(data);
      setLoading(false);
    };

    loadComments();

    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        (payload) => {
          if (payload.new.post_id === postId) {
            setComments((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  // 💬 Add comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const author =
      user?.user_metadata?.username ||
      user?.email?.split("@")[0] ||
      "Anonymous";

    const comment = {
      post_id: postId,
      content: newComment.trim(),
      author,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI
    setComments((prev) => [...prev, comment]);
    setNewComment("");

    const { error } = await supabase.from("comments").insert(comment);
    if (error) console.error("Failed to post comment:", error.message);
  };

  return (
    <div className="space-y-6">
      {/* New comment form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            user
              ? `Comment as ${user.user_metadata?.username || user.email}`
              : "Comment as Anonymous..."
          }
          className="w-full rounded-lg bg-gray-800 text-gray-100 p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#83c0cc]"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            {user
              ? `Signed in as ${
                  user.user_metadata?.username || user.email
                }`
              : "You are posting as Anonymous"}
          </p>
          <button
            type="submit"
            className="bg-[#83c0cc] hover:bg-[#6eb5c0] text-black font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comment list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading comments...</p>
      ) : comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id || comment.created_at}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <p className="text-gray-300 mb-2">{comment.content}</p>
              <div className="text-sm text-gray-500">
                {comment.author || "Anonymous"} ·{" "}
                {new Date(comment.created_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm italic">
          No comments yet. Be the first to reply.
        </p>
      )}
    </div>
  );
}

