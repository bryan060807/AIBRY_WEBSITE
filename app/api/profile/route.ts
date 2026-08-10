import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function GET(request: Request) {
  return proxyWebsiteApiRequest("/api/v1/profile", request);
}

export async function PATCH(request: Request) {
  return proxyWebsiteApiRequest("/api/v1/profile", request);
}
