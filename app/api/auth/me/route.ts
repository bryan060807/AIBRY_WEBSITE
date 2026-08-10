import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function GET(request: Request) {
  return proxyWebsiteApiRequest("/api/auth/me", request);
}
