import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import RealtimeComments from "./realtime-comments";

export async function generateMetadata({ params }: { params: { topic: string; post_id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, topic")
    .eq("id", params.post_id)
    .single();

  return {
    title: post ? `${post.title} | AIBRY Forum` : "Post | AIBRY Forum",
    description: post
      ? `Discussion under ${post.topic}`
      : "A forum discussion on AIBRY.",
  };
}

export default async function PostPage({ params }: { params: { topic: string; post_id: string } }) {
  const supabase = createSupabaseServerClient();
  const { post_id } = params;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", post_id)
    .single();

  if (!post || error) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-100">
      <article className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
        <p className="text-gray-300 mb-8 whitespace-pre-line">{post.content}</p>
        <div className="text-sm text-gray-500">
          Posted by{" "}
          <span className="text-gray-300 font-medium">{post.author}</span>{" "}
          ·{" "}
          {new Date(post.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      </article>

      {/* Comments Section */}
      <section className="mt-10" aria-label="Post comments">
        <h2 className="text-2xl font-semibold mb-4 text-white">Comments</h2>
        <RealtimeComments postId={post_id} />
      </section>
    </main>
  );
}
