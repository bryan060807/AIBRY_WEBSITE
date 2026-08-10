'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createForumPost, deleteForumPost, updateForumPost } from '@/lib/server/forum';
import { logWebsiteOperationError, WebsiteApiError } from '@/lib/server/websiteApi';

interface ForumActionState {
  message: string;
}

export async function postToForum(
  topic: string,
  _prevState: ForumActionState,
  formData: FormData
): Promise<ForumActionState> {
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!title || !content) {
    return { message: 'Title and content are required.' };
  }

  let insertedPost: { id: string; topic: string };
  try {
    insertedPost = await createForumPost({ topic, title, content });
  } catch (error) {
    if (isAuthError(error)) {
      return { message: 'You must be logged in to post. Please log in and try again.' };
    }

    logWebsiteOperationError('forum.post.create', error);
    return {
      message:
        error instanceof WebsiteApiError
          ? error.message
          : 'Failed to post to forum. Please try again.',
    };
  }

  revalidatePath(`/forum/${insertedPost.topic}`);

  redirect(`/forum/${insertedPost.topic}/${insertedPost.id}`);
}

export async function updateForumPostAction(
  postId: string,
  topic: string,
  formData: FormData
) {
  const title = (formData.get('title') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();

  if (!title || !content) {
    return;
  }

  try {
    await updateForumPost(postId, { title, content });
  } catch (error) {
    logWebsiteOperationError('forum.post.update', error);
    return;
  }

  revalidatePath(`/forum/${topic}`);
  revalidatePath(`/forum/${topic}/${postId}`);
}

export async function deleteForumPostAction(postId: string, topic: string) {
  try {
    await deleteForumPost(postId);
  } catch (error) {
    logWebsiteOperationError('forum.post.delete', error);
    return;
  }

  revalidatePath(`/forum/${topic}`);
  revalidatePath(`/forum/${topic}/${postId}`);
  redirect(`/forum/${topic}`);
}

function isAuthError(error: unknown) {
  return (
    error instanceof WebsiteApiError &&
    (error.status === 401 ||
      error.status === 403 ||
      error.code === "auth_required" ||
      error.code === "AUTH_REQUIRED")
  );
}
