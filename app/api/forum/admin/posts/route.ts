import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function GET(request: Request) {
  return proxyWebsiteApiRequest("/api/forum/admin/posts", request);
}
