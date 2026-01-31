import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const ClientRealtimePosts = dynamic(() => import("./realtime-client"), {
  ssr: false,
  loading: () => <p className="text-gray-500">Loading posts...</p>,
});

export async function generateMetadata({ params }: { params: { topic: string } }) {
  const topicName = decodeURIComponent(params.topic);
  return {
    title: `${topicName} Forum | AIBRY`,
    description: `Join the ${topicName} discussion. Share stories, questions, and insights with others.`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const supabase = createSupabaseServerClient();
  const { topic } = params;
  const decodedTopic = decodeURIComponent(topic);

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("id, title, content, author, created_at, topic, likes")
      .eq("topic", decodedTopic)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <nav className="mb-8 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/forum" className="hover:underline">
            Forum
          </Link>{" "}
          / <span className="text-gray-200">{decodedTopic}</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-white capitalize">
          {decodedTopic} Forum
        </h1>
        <p className="mb-10 text-gray-400">
          Discussions and shared experiences within {decodedTopic}.
        </p>

        <Link
          href={`/forum/${topic}/new`}
          className="inline-block mb-6 bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          + New Post
        </Link>

        {posts?.length ? (
          <section aria-label="Forum posts">
            <ClientRealtimePosts initialPosts={posts} topic={decodedTopic} />
          </section>
        ) : (
          <p className="text-gray-400 italic">No posts yet. Be the first to start the conversation.</p>
        )}
      </main>
    );
  } catch (err) {
    console.error("Error fetching posts:", err);
    return notFound();
  }
}
