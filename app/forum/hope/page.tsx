import type { Metadata } from 'next';
import ForumTopicPage from '@/components/forum/ForumTopicPage';

export const metadata: Metadata = {
  title: 'Projects & Updates | AIBRY Forum',
  description:
    'AIBRY app, music, release, merch, and site update threads.',
};

export default async function HopePage() {
  return <ForumTopicPage topic="hope" />;
}
