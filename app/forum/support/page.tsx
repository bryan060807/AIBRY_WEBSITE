import type { Metadata } from 'next';
import ForumTopicPage from '@/components/forum/ForumTopicPage';

export const metadata: Metadata = {
  title: 'Help & Support | AIBRY Forum',
  description:
    'Ask questions, report issues, request help, or get support from the AIBRY community.',
};

export default async function SupportPage() {
  return <ForumTopicPage topic="support" />;
}
