import { createSupabaseServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 60; // Cache profile data for 1 minute

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', params.id)
    .single();

  return {
    title: profile
      ? `${profile.display_name} | AIBRY Profile`
      : 'User Profile | AIBRY',
    description:
      profile?.display_name
        ? `View ${profile.display_name}'s public profile on the AIBRY community.`
        : 'A member of the AIBRY community.',
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url')
    .eq('id', params.id)
    .single();

  if (!profile || error) return notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-gray-100">
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={`${profile.display_name}'s avatar`}
                width={128}
                height={128}
                className="rounded-full object-cover border border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-800 rounded-full text-gray-500 text-3xl font-bold border border-gray-700">
                {profile.display_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {profile.display_name}
          </h1>

          <p className="text-gray-400 text-center mb-6 whitespace-pre-line">
            {profile.bio || 'This user hasn’t written a bio yet.'}
          </p>

          <Link
            href="/forum"
            className="px-5 py-2 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400 transition"
          >
            Back to Forum
          </Link>
        </div>
      </section>
    </main>
  );
}
