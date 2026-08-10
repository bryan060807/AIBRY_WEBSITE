'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createForumComment,
  deleteForumComment,
  toggleForumCommentLike,
  updateForumComment,
} from '@/lib/server/forum';
import { logWebsiteOperationError, WebsiteApiError } from '@/lib/server/websiteApi';

interface ActionState {
  message: string;
}

// ===================================
// ACTION 1: INSERT COMMENT
// ===================================
export async function insertComment(
  postId: string,
  topic: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const content = (formData.get('content') as string)?.trim();

  if (!content) {
    return { message: 'Comment content is required.' };
  }

  try {
    await createForumComment({ postId, content });
  } catch (error) {
    if (isAuthError(error)) {
      return { message: 'You must be logged in to reply. Please log in and try again.' };
    }

    logWebsiteOperationError('forum.comment.create', error);
    return { message: 'Failed to post comment. Please try again.' };
  }

  revalidatePath(`/forum/${topic}/${postId}`);

  return { message: 'Comment posted successfully!' };
}

// ===================================
// ACTION 2: TOGGLE LIKE
// ===================================
export async function toggleLike(
  commentId: string,
  topic: string,
  postId: string,
  currentlyLiked = false
) {
  try {
    await toggleForumCommentLike(commentId, currentlyLiked);
  } catch (error) {
    if (!isAuthError(error)) {
      logWebsiteOperationError('forum.comment.like.toggle', error);
    }

    redirect('/login?message=Sign in to like a comment!');
  }

  revalidatePath(`/forum/${topic}/${postId}`);
}

export async function updateForumCommentAction(
  commentId: string,
  topic: string,
  postId: string,
  formData: FormData
) {
  const content = (formData.get('content') as string)?.trim();

  if (!content) {
    return;
  }

  try {
    await updateForumComment(commentId, { content });
  } catch (error) {
    logWebsiteOperationError('forum.comment.update', error);
    return;
  }

  revalidatePath(`/forum/${topic}/${postId}`);
}

export async function deleteForumCommentAction(
  commentId: string,
  topic: string,
  postId: string
) {
  try {
    await deleteForumComment(commentId);
  } catch (error) {
    logWebsiteOperationError('forum.comment.delete', error);
    return;
  }

  revalidatePath(`/forum/${topic}/${postId}`);
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
