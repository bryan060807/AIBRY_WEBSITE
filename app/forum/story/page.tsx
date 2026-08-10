import type { Metadata } from 'next';
import ForumTopicPage from '@/components/forum/ForumTopicPage';

export const metadata: Metadata = {
  title: 'General Discussion | AIBRY Forum',
  description:
    'General AIBRY community threads, introductions, ideas, and open conversation.',
};

export default async function StoryPage() {
  return <ForumTopicPage topic="story" />;
}
