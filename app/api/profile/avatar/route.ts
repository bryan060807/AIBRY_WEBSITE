import { proxyWebsiteApiRequest } from "@/lib/server/routeProxy";

export async function POST(request: Request) {
  return proxyWebsiteApiRequest("/api/v1/profile/avatar", request);
}

export async function DELETE(request: Request) {
  return proxyWebsiteApiRequest("/api/v1/profile/avatar", request);
}
