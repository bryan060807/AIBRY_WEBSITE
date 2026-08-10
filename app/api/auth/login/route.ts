import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function POST(request: Request) {
  return proxyWebsiteApiRequest("/api/auth/login", request);
}
