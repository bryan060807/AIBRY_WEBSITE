import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

interface ForumAdminPostRouteContext {
  params: {
    postId: string;
  };
}

function moderationPath(postId: string) {
  return `/api/forum/admin/posts/${encodeURIComponent(postId)}`;
}

export async function PATCH(
  request: Request,
  { params }: ForumAdminPostRouteContext
) {
  return proxyWebsiteApiRequest(moderationPath(params.postId), request);
}

export async function DELETE(
  request: Request,
  { params }: ForumAdminPostRouteContext
) {
  return proxyWebsiteApiRequest(moderationPath(params.postId), request);
}
