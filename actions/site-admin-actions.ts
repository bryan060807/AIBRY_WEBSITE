"use server";

import { revalidatePath } from "next/cache";
import { deleteContactAdminMessage } from "@/lib/server/site-admin";
import { logWebsiteOperationError } from "@/lib/server/websiteApi";

export async function deleteContactMessage(messageId: string): Promise<void> {
  try {
    await deleteContactAdminMessage(messageId);
    revalidatePath("/forum/admin");
  } catch (error) {
    logWebsiteOperationError("site.admin.contact.delete", error);
  }
}
