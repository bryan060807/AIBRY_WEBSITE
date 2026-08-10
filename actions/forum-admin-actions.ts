"use server";

import { revalidatePath } from "next/cache";
import {
  deleteForumAdminThread,
  updateForumAdminThread,
} from "@/lib/server/forum";
import { logWebsiteOperationError } from "@/lib/server/websiteApi";

function revalidateForum(topic?: string) {
  revalidatePath("/forum/admin");
  revalidatePath("/forum");
  if (topic) revalidatePath(`/forum/${topic}`);
}

export async function setForumThreadHidden(
  postId: string,
  topic: string,
  hidden: boolean
): Promise<void> {
  try {
    await updateForumAdminThread(postId, { hidden });
    revalidateForum(topic);
  } catch (error) {
    logWebsiteOperationError("forum.admin.thread.hidden", error);
  }
}

export async function setForumThreadLocked(
  postId: string,
  topic: string,
  locked: boolean
): Promise<void> {
  try {
    await updateForumAdminThread(postId, { locked });
    revalidateForum(topic);
    revalidatePath(`/forum/${topic}/${postId}`);
  } catch (error) {
    logWebsiteOperationError("forum.admin.thread.locked", error);
  }
}

export async function setForumThreadPinned(
  postId: string,
  topic: string,
  pinned: boolean
): Promise<void> {
  try {
    await updateForumAdminThread(postId, { pinned });
    revalidateForum(topic);
  } catch (error) {
    logWebsiteOperationError("forum.admin.thread.pinned", error);
  }
}

export async function softDeleteForumThread(
  postId: string,
  topic: string
): Promise<void> {
  try {
    await deleteForumAdminThread(postId);
    revalidateForum(topic);
    revalidatePath(`/forum/${topic}/${postId}`);
  } catch (error) {
    logWebsiteOperationError("forum.admin.thread.delete", error);
  }
}
