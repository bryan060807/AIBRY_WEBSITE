"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client"; // ✅ correct import

export default function ClientRealtimePosts({ initialPosts, topic }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [likedPosts, setLikedPosts] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("likedPosts") || "[]");
    }
    return [];
  });

  // 🔁 Realtime listener for likes (resubscribes if topic changes)
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`realtime-likes-${topic}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          if (payload.new.topic === topic) {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === payload.new.id
                  ? { ...post, likes: payload.new.likes }
                  : post
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topic]);

  // 💾 Persist liked posts locally
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
    }
  }, [likedPosts]);

  // ❤️ Like handler
  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // prevent Link navigation
    e.preventDefault();

    const alreadyLiked = likedPosts.includes(postId);

    // Optimistic UI
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: alreadyLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

    setLikedPosts((prev) =>
      alreadyLiked ? prev.filter((id) => id !== postId) : [...prev, postId]
    );

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from("posts")
        .update({
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
        })
        .eq("id", postId);

      if (error) console.error("Supabase like update failed:", error.message);
    } catch (err) {
      console.error("Unexpected Supabase error:", err);
    }
  };

  // 🖼️ Render posts
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/forum/${topic}/${post.id}`} // ✅ click to open post
          className="block p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-md transition-all hover:border-[#83c0cc]/70 hover:shadow-[0_0_15px_rgba(131,192,204,0.3)]"
        >
          <h3 className="text-xl font-semibold text-white mb-2 hover:text-[#83c0cc] transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-400 mb-4 line-clamp-3">{post.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={(e) => handleLike(e, post.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                likedPosts.includes(post.id)
                  ? "bg-[#83c0cc] text-black shadow-[0_0_15px_rgba(131,192,204,0.5)] hover:shadow-[0_0_25px_rgba(131,192,204,0.7)]"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              ❤️ {post.likes || 0}
            </button>

            <span className="text-gray-500 text-sm">
              Posted by {post.author || "Anonymous"}
            </span>
          </div>
        </Link>
      ))}

      {posts.length === 0 && (
        <p className="text-gray-400 text-center italic">
          No posts yet. Be the first to start the conversation.
        </p>
      )}
    </div>
  );
}
